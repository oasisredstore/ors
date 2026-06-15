"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const ServiceReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(1000).optional().transform(v => v === "" ? null : v),
});

export async function submitServiceReviewAction(serviceId: string, serviceSlug: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") {
    return { error: "Only logged-in customers can leave reviews." };
  }

  const raw = {
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  };

  const parsed = ServiceReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid review data provided." };
  }

  try {
    // Check if review exists
    const existing = await prisma.serviceReview.findUnique({
      where: {
        userId_serviceId: {
          userId: session.userId,
          serviceId: serviceId,
        },
      },
    });

    if (existing) {
      await prisma.serviceReview.update({
        where: { id: existing.id },
        data: {
          rating: parsed.data.rating,
          comment: parsed.data.comment,
        },
      });
    } else {
      // Create new review
      await prisma.serviceReview.create({
        data: {
          userId: session.userId,
          serviceId: serviceId,
          rating: parsed.data.rating,
          comment: parsed.data.comment,
        },
      });
    }

    // A4 FIX: Use revalidatePath to trigger Next.js to purge its router cache
    // and re-fetch the updated data on the client side without needing a hard
    // refresh. We revalidate the specific service page and the parent pages.
    revalidatePath(`/ar/services/${serviceSlug}`);
    revalidatePath(`/en/services/${serviceSlug}`);
    revalidatePath(`/fr/services/${serviceSlug}`);

    return { success: true };
  } catch (error) {
    console.error("Review submission error:", error);
    return { error: "An error occurred while submitting your review." };
  }
}
