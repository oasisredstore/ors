"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireArtisan, requireAdmin } from "@/lib/session";
import { ProductSchema } from "@/lib/validations/product.schema";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export async function createProductAction(formData: FormData) {
  const session = await requireArtisan();

  const artisan = await prisma.artisan.findUnique({
    where: { userId: session.userId },
  });

  if (!artisan) return { error: "Artisan profile not found" };
  if (!artisan.isApproved) return { error: "Your account is pending approval" };

  const raw = {
    name: formData.get("name") as string,
    nameAr: (formData.get("nameAr") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    descriptionAr: (formData.get("descriptionAr") as string) || undefined,
    categoryId: formData.get("categoryId") as string,
    material: (formData.get("material") as string) || undefined,
    dimensions: (formData.get("dimensions") as string) || undefined,
    origin: (formData.get("origin") as string) || undefined,
    price: formData.get("price") as string,
    stockQty: formData.get("stockQty") as string,
    isPublished: formData.get("isPublished") === "true",
    isFeatured: false,
  };

  const parsed = ProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  // A3 FIX: The pre-flight uniqueness check + insert is a TOCTOU race —
  // two concurrent requests can both pass the check before either commits.
  // Retry on a P2002 unique-constraint error from Prisma instead.
  let product;
  let attempt = 0;
  while (true) {
    try {
      product = await prisma.product.create({
        data: {
          ...parsed.data,
          slug,
          artisanId: artisan.id,
        },
      });
      break;
    } catch (err: unknown) {
      const isPrismaUniqueError =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: string }).code === "P2002";
      if (isPrismaUniqueError && attempt < 10) {
        slug = `${baseSlug}-${++counter}`;
        attempt++;
        continue;
      }
      throw err;
    }
  }

  // Save uploaded images
  const imageUrlsRaw = formData.get("imageUrls") as string;
  if (imageUrlsRaw) {
    try {
      const imageUrls: string[] = JSON.parse(imageUrlsRaw);
      if (imageUrls.length > 0) {
        await prisma.productImage.createMany({
          data: imageUrls.map((url, i) => ({
            productId: product.id,
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        });
      }
    } catch {
      // Invalid JSON, skip images
    }
  }

  revalidatePath("/en/dashboard/products");
  revalidatePath("/ar/dashboard/products");

  return { success: true, productId: product.id };
}

export async function updateProductAction(id: string, formData: FormData) {
  const session = await requireArtisan();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { artisan: true },
  });

  if (!product) return { error: "Product not found" };
  if (
    product.artisan.userId !== session.userId &&
    session.role !== "ADMIN"
  ) {
    return { error: "Unauthorized" };
  }

  const raw = {
    name: formData.get("name") as string,
    nameAr: (formData.get("nameAr") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    descriptionAr: (formData.get("descriptionAr") as string) || undefined,
    categoryId: formData.get("categoryId") as string,
    material: (formData.get("material") as string) || undefined,
    dimensions: (formData.get("dimensions") as string) || undefined,
    origin: (formData.get("origin") as string) || undefined,
    price: formData.get("price") as string,
    stockQty: formData.get("stockQty") as string,
    isPublished: formData.get("isPublished") === "true",
    isFeatured: formData.get("isFeatured") === "true",
  };

  const parsed = ProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  // Append any newly uploaded images
  const imageUrlsRaw = formData.get("imageUrls") as string;
  if (imageUrlsRaw) {
    try {
      const imageUrls: string[] = JSON.parse(imageUrlsRaw);
      if (imageUrls.length > 0) {
        const existing = await prisma.productImage.findMany({
          where: { productId: id },
          orderBy: { sortOrder: "desc" },
          take: 1,
        });
        const startOrder = existing[0] ? existing[0].sortOrder + 1 : 0;
        const hasPrimary = await prisma.productImage.count({
          where: { productId: id, isPrimary: true },
        });

        await prisma.productImage.createMany({
          data: imageUrls.map((url, i) => ({
            productId: id,
            url,
            isPrimary: hasPrimary === 0 && i === 0,
            sortOrder: startOrder + i,
          })),
        });
      }
    } catch {
      // Invalid JSON, skip images
    }
  }

  revalidatePath("/en/dashboard/products");
  revalidatePath("/ar/dashboard/products");
  revalidatePath(`/en/products/${product.slug}`);
  revalidatePath(`/ar/products/${product.slug}`);

  return { success: true };
}

export async function deleteProductAction(id: string) {
  const session = await requireArtisan();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { artisan: true },
  });

  if (!product) return { error: "Product not found" };
  if (
    product.artisan.userId !== session.userId &&
    session.role !== "ADMIN"
  ) {
    return { error: "Unauthorized" };
  }

  // B7 FIX: Check for existing order items before deleting. OrderItem.product
  // now uses onDelete: Restrict, so Prisma/SQLite will raise a FK error if we
  // don't check first. Surface a clear message instead of a generic 500.
  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    return {
      error:
        `Cannot delete "${product.name}" — it has ${orderItemCount} order item(s) referencing it. ` +
        "Unpublish it instead to hide it from the marketplace.",
    };
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/en/dashboard/products");
  revalidatePath("/ar/dashboard/products");
  revalidatePath("/en/products");
  revalidatePath("/ar/products");

  return { success: true };
}

export async function togglePublishAction(id: string) {
  const session = await requireArtisan();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { artisan: true },
  });

  if (!product) return { error: "Product not found" };
  if (
    product.artisan.userId !== session.userId &&
    session.role !== "ADMIN"
  ) {
    return { error: "Unauthorized" };
  }

  await prisma.product.update({
    where: { id },
    data: { isPublished: !product.isPublished },
  });

  revalidatePath("/en/dashboard/products");
  revalidatePath("/ar/dashboard/products");

  return { success: true };
}

export async function adminToggleFeaturedAction(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { isFeatured: !product.isFeatured },
  });

  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/admin/products");
  revalidatePath("/ar/admin/products");
}

export async function adminTogglePublishAction(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { isPublished: !product.isPublished },
  });

  revalidatePath("/en/admin/products");
  revalidatePath("/ar/admin/products");
  revalidatePath("/en/products");
  revalidatePath("/ar/products");
  revalidatePath(`/en/products/${product.slug}`);
  revalidatePath(`/ar/products/${product.slug}`);
}
