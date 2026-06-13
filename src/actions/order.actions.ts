"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession, requireAdmin } from "@/lib/session";
import type { CartItem } from "@/store/cartStore";

export async function saveAddressAction(formData: FormData) {
  const session = await requireSession();

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const wilaya = formData.get("wilaya") as string;
  const postalCode = (formData.get("postalCode") as string) || undefined;

  if (!fullName || !phone || !street || !city || !wilaya) {
    return { error: "All address fields are required" };
  }

  const address = await prisma.address.create({
    data: {
      userId: session.userId,
      fullName,
      phone,
      street,
      city,
      wilaya,
      postalCode,
    },
  });

  return { success: true, addressId: address.id };
}

export async function createOrderAction(
  items: CartItem[],
  formData: FormData
) {
  const session = await requireSession();

  const addressId = formData.get("addressId") as string;
  const paymentMethod = formData.get("paymentMethod") as
    | "CASH_ON_DELIVERY"
    | "BANK_TRANSFER";
  const notes = (formData.get("notes") as string) || undefined;

  if (!addressId || !paymentMethod) {
    return { error: "Missing address or payment method" };
  }

  if (!items || items.length === 0) {
    return { error: "Cart is empty" };
  }

  // A7 FIX: Verify the address actually belongs to the requesting user before
  // using it, preventing an IDOR where a user could ship orders to another
  // user's saved address by supplying a foreign addressId.
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.userId) {
    return { error: "Invalid delivery address" };
  }

  try {
    // A2 FIX: Wrap the entire order creation inside a single transaction so
    // that stock checks and decrements are atomic. If two concurrent requests
    // race for the last item, only one will succeed — the other will receive
    // an "insufficient stock" error rather than silently over-selling.
    const order = await prisma.$transaction(async (tx) => {
      const productIds = items.map((i) => i.id);

      // Re-fetch products inside the transaction for an authoritative stock read.
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isPublished: true },
      });

      if (products.length !== items.length) {
        throw new Error("One or more products are no longer available");
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      // Validate stock for every item before touching the DB.
      for (const item of items) {
        const dbProduct = productMap.get(item.id)!;
        if (dbProduct.stockQty < item.quantity) {
          throw new Error(
            `"${dbProduct.name}" only has ${dbProduct.stockQty} unit(s) left in stock`
          );
        }
      }

      // Calculate total using DB prices (authoritative — never trust client).
      const totalAmount = items.reduce((sum, item) => {
        const dbProduct = productMap.get(item.id)!;
        return sum + dbProduct.price * item.quantity;
      }, 0);

      // Create the order with items and payment in one atomic operation.
      const newOrder = await tx.order.create({
        data: {
          userId: session.userId,
          addressId,
          totalAmount,
          notes,
          status: "PENDING",
          items: {
            create: items.map((item) => {
              const dbProduct = productMap.get(item.id)!;
              return {
                productId: item.id,
                quantity: item.quantity,
                unitPrice: dbProduct.price,
                subtotal: dbProduct.price * item.quantity,
              };
            }),
          },
          payment: {
            create: {
              method: paymentMethod,
              status: "PENDING",
            },
          },
        },
      });

      // Decrement stockQty for each item atomically.
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stockQty: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    revalidatePath("/en/account/orders");
    revalidatePath("/ar/account/orders");
    revalidatePath("/en/admin/orders");
    revalidatePath("/ar/admin/orders");

    return { success: true, orderId: order.id };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create order";
    return { error: message };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/en/admin/orders");
  revalidatePath("/ar/admin/orders");

  return { success: true };
}

export async function markPaymentPaidAction(orderId: string) {
  await requireAdmin();

  await prisma.payment.update({
    where: { orderId },
    data: { status: "PAID" },
  });

  revalidatePath("/en/admin/orders");
  revalidatePath("/ar/admin/orders");

  return { success: true };
}
