"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function activateSubscriptionAction(planId: string) {
  const session = await getSession();
  if (!session) return { error: "You must be logged in" };

  // Only service providers can subscribe
  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: session.userId },
  });
  if (!provider) {
    return { error: "Only registered service providers can subscribe to a plan" };
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { tier: planId as "FREE" | "BASIC" | "PREMIUM" },
  });
  if (!plan || !plan.isActive) {
    return { error: "Subscription plan not found" };
  }

  // Deactivate any existing subscription
  await prisma.userSubscription.updateMany({
    where: { providerId: provider.id, isActive: true },
    data: { isActive: false },
  });

  // Create the new subscription
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDays);

  await prisma.userSubscription.create({
    data: {
      providerId: provider.id,
      planId: plan.id,
      startDate,
      endDate,
      isActive: true,
    },
  });

  revalidatePath("/en/pricing");
  revalidatePath("/ar/pricing");
  revalidatePath("/en/dashboard");
  revalidatePath("/ar/dashboard");

  return { success: true, plan: plan.tier };
}

export async function getCurrentSubscriptionAction() {
  const session = await getSession();
  if (!session) return null;

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: session.userId },
    include: {
      subscriptions: {
        where: { isActive: true },
        include: { plan: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!provider || provider.subscriptions.length === 0) return null;
  return provider.subscriptions[0];
}
