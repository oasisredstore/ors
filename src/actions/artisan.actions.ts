"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireArtisan } from "@/lib/session";
import { z } from "zod";

const ProfileSchema = z.object({
  shopName: z.string().min(2, "Shop name must be at least 2 characters").max(100),
  bio: z.string().max(1000).optional(),
  bioAr: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  specialization: z.string().max(200).optional(),
  whatsapp: z.string().max(30).optional(),
  email: z.string().email().optional().or(z.literal("")),
  // B6 FIX: Restrict image URLs to relative /uploads/ paths only.
  // Accepting arbitrary URLs (including javascript: and external trackers)
  // is a privacy and XSS risk. All uploads go through /api/upload which
  // returns /uploads/... paths, so this regex covers all valid inputs.
  avatarUrl: z
    .string()
    .regex(/^\/uploads\/[a-zA-Z0-9._-]+$/, "Avatar must be an uploaded image")
    .optional()
    .or(z.literal("")),
  coverUrl: z
    .string()
    .regex(/^\/uploads\/[a-zA-Z0-9._-]+$/, "Cover must be an uploaded image")
    .optional()
    .or(z.literal("")),
});

export async function updateArtisanProfileAction(formData: FormData) {
  const session = await requireArtisan();

  const artisan = await prisma.artisan.findUnique({
    where: { userId: session.userId },
  });
  if (!artisan) return { error: "Artisan profile not found" };

  const raw = {
    shopName: formData.get("shopName") as string,
    bio: (formData.get("bio") as string) || undefined,
    bioAr: (formData.get("bioAr") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
    specialization: (formData.get("specialization") as string) || undefined,
    whatsapp: (formData.get("whatsapp") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    avatarUrl: (formData.get("avatarUrl") as string) || undefined,
    coverUrl: (formData.get("coverUrl") as string) || undefined,
  };

  const parsed = ProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Clean up empty optional strings
  const data = {
    shopName: parsed.data.shopName,
    bio: parsed.data.bio || null,
    bioAr: parsed.data.bioAr || null,
    location: parsed.data.location || null,
    specialization: parsed.data.specialization || null,
    whatsapp: parsed.data.whatsapp || null,
    email: parsed.data.email || null,
    avatarUrl: parsed.data.avatarUrl || null,
    coverUrl: parsed.data.coverUrl || null,
  };

  await prisma.artisan.update({
    where: { id: artisan.id },
    data,
  });

  revalidatePath("/en/dashboard");
  revalidatePath("/ar/dashboard");
  revalidatePath("/en/dashboard/profile");
  revalidatePath("/ar/dashboard/profile");
  revalidatePath(`/en/artisans/${artisan.slug}`);
  revalidatePath(`/ar/artisans/${artisan.slug}`);

  return { success: true };
}
