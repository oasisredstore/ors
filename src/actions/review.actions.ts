"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { z } from "zod";

const ReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function submitReviewAction(
  productId: string,
  productSlug: string,
  formData: FormData
) {
  const session = await requireSession();

  // Only customers can submit reviews
  if (session.role !== "CUSTOMER") {
    return { error: "Only customers can submit reviews" };
  }

  const raw = {
    rating: formData.get("rating"),
    comment: (formData.get("comment") as string) || undefined,
  };

  const parsed = ReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Check if product exists and is published
  const product = await prisma.product.findUnique({
    where: { id: productId, isPublished: true },
  });
  if (!product) return { error: "Product not found" };

  // B5 FIX: Require the reviewer to have a DELIVERED order containing this
  // product. Without this check, any authenticated customer can submit reviews
  // for products they never purchased, enabling fake/spam reviews.
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: session.userId, status: "DELIVERED" },
    },
  });
  if (!hasPurchased) {
    return { error: "You can only review products you have purchased and received." };
  }

  // Enforce one review per user per product (upsert)
  await prisma.review.upsert({
    where: { userId_productId: { userId: session.userId, productId } },
    create: {
      userId: session.userId,
      productId,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
    },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
    },
  });

  revalidatePath(`/en/products/${productSlug}`);
  revalidatePath(`/ar/products/${productSlug}`);

  return { success: true };
}
