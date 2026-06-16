"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

// ─── Provider actions ───────────────────────────────────────────────────────

export async function confirmBookingAction(bookingId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: { include: { provider: true } } },
  });

  if (!booking) return { error: "Booking not found" };
  if (booking.service.provider.userId !== session.userId)
    return { error: "Not authorized to manage this booking" };
  if (booking.status !== "PENDING")
    return { error: "Only pending bookings can be confirmed" };

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" },
  });

  revalidatePath("/en/dashboard/bookings");
  revalidatePath("/ar/dashboard/bookings");
  return { success: true };
}

export async function rejectBookingAction(bookingId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: { include: { provider: true } } },
  });

  if (!booking) return { error: "Booking not found" };
  if (booking.service.provider.userId !== session.userId)
    return { error: "Not authorized to manage this booking" };
  if (booking.status !== "PENDING")
    return { error: "Only pending bookings can be rejected" };

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/en/dashboard/bookings");
  revalidatePath("/ar/dashboard/bookings");
  return { success: true };
}

// ─── Tourist cancellation ───────────────────────────────────────────────────

export async function cancelBookingAction(bookingId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) return { error: "Booking not found" };
  if (booking.userId !== session.userId)
    return { error: "You can only cancel your own bookings" };
  if (!["PENDING", "CONFIRMED"].includes(booking.status))
    return { error: "This booking cannot be cancelled" };

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/en/account");
  revalidatePath("/ar/account");
  return { success: true };
}

// ─── Create booking (tourist) ───────────────────────────────────────────────

const CreateBookingSchema = z.object({
  serviceId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  guestsCount: z.coerce.number().int().min(1).max(50),
  notes: z.string().max(500).optional(),
});

export async function createBookingAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "You must be logged in to book" };

  const raw = {
    serviceId: formData.get("serviceId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    guestsCount: formData.get("guestsCount"),
    notes: formData.get("notes"),
  };

  const parsed = CreateBookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const service = await prisma.service.findUnique({
    where: { id: parsed.data.serviceId, isPublished: true },
  });
  if (!service) return { error: "Service not found" };

  const start = new Date(parsed.data.startDate);
  const end = new Date(parsed.data.endDate);

  if (end <= start) return { error: "End date must be after start date" };

  const nights = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalAmount = service.price * nights * parsed.data.guestsCount;

  // Check for conflicting bookings on same service
  const conflict = await prisma.booking.findFirst({
    where: {
      serviceId: parsed.data.serviceId,
      status: { in: ["PENDING", "CONFIRMED"] },
      AND: [
        { startDate: { lt: end } },
        { endDate: { gt: start } },
      ],
    },
  });
  if (conflict) return { error: "Selected dates are not available for this service" };

  const booking = await prisma.booking.create({
    data: {
      userId: session.userId,
      serviceId: parsed.data.serviceId,
      startDate: start,
      endDate: end,
      guestsCount: parsed.data.guestsCount,
      totalAmount,
      notes: parsed.data.notes || null,
      status: "PENDING",
    },
  });

  revalidatePath("/en/account");
  revalidatePath("/ar/account");

  return { success: true, bookingId: booking.id };
}
