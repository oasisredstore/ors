"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function approveArtisanAction(artisanId: string) {
  await requireAdmin();

  await prisma.artisan.update({
    where: { id: artisanId },
    data: { isApproved: true },
  });

  revalidatePath("/en/admin/artisans");
  revalidatePath("/ar/admin/artisans");
}

export async function toggleUserActiveAction(userId: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  revalidatePath("/en/admin/users");
  revalidatePath("/ar/admin/users");
}

// A6 FIX: enumerate every valid status value and reject anything else before
// it reaches the database, eliminating the unsafe `as never` cast.
const VALID_ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type ValidOrderStatus = (typeof VALID_ORDER_STATUSES)[number];

export async function adminUpdateOrderStatusAction(
  orderId: string,
  status: string
) {
  await requireAdmin();

  if (!VALID_ORDER_STATUSES.includes(status as ValidOrderStatus)) {
    return { error: `Invalid order status: "${status}"` };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as ValidOrderStatus },
  });

  revalidatePath("/en/admin/orders");
  revalidatePath("/ar/admin/orders");

  return { success: true };
}

export async function adminDeleteProductAction(id: string) {
  await requireAdmin();

  await prisma.product.delete({ where: { id } });

  revalidatePath("/en/admin/products");
  revalidatePath("/ar/admin/products");
}
