"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const NewConversationSchema = z.object({
  subject: z.string().min(2).max(200),
  body: z.string().min(5).max(2000),
  artisanId: z.string().optional(),
  providerId: z.string().optional(),
});

export async function createConversationAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "You must be logged in to send messages" };

  const raw = {
    subject: formData.get("subject"),
    body: formData.get("body"),
    artisanId: formData.get("artisanId") || undefined,
    providerId: formData.get("providerId") || undefined,
  };

  const parsed = NewConversationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (!parsed.data.artisanId && !parsed.data.providerId) {
    return { error: "Recipient is required" };
  }

  const conversation = await prisma.conversation.create({
    data: {
      touristId: session.userId,
      artisanId: parsed.data.artisanId || null,
      providerId: parsed.data.providerId || null,
      subject: parsed.data.subject,
      messages: {
        create: {
          senderId: session.userId,
          body: parsed.data.body,
        },
      },
    },
  });

  revalidatePath("/en/messages");
  revalidatePath("/ar/messages");

  return { success: true, conversationId: conversation.id };
}

const ReplySchema = z.object({
  body: z.string().min(1).max(2000),
});

export async function replyMessageAction(
  conversationId: string,
  formData: FormData
) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  // Verify user is part of this conversation
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { messages: false },
  });

  if (!conversation) return { error: "Conversation not found" };

  const isTourist = conversation.touristId === session.userId;
  // provider is either the artisan or service provider
  const isProvider =
    (conversation.artisanId &&
      (await prisma.artisan.findFirst({
        where: { id: conversation.artisanId, userId: session.userId },
      }))) ||
    (conversation.providerId &&
      (await prisma.serviceProvider.findFirst({
        where: { id: conversation.providerId, userId: session.userId },
      })));

  if (!isTourist && !isProvider) {
    return { error: "Not authorized to reply to this conversation" };
  }

  const raw = { body: formData.get("body") };
  const parsed = ReplySchema.safeParse(raw);
  if (!parsed.success) return { error: "Message body is required" };

  await prisma.message.create({
    data: {
      conversationId,
      senderId: session.userId,
      body: parsed.data.body,
    },
  });

  // Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/en/messages/${conversationId}`);
  revalidatePath(`/ar/messages/${conversationId}`);

  return { success: true };
}

export async function markConversationReadAction(conversationId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  // Mark all messages NOT sent by the current user as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: session.userId },
      isRead: false,
    },
    data: { isRead: true },
  });

  revalidatePath(`/en/messages/${conversationId}`);
  revalidatePath(`/ar/messages/${conversationId}`);

  return { success: true };
}

export async function getUnreadCountAction(): Promise<number> {
  const session = await getSession();
  if (!session) return 0;

  // Find conversations where the user is involved
  const myConvs = await prisma.conversation.findMany({
    where: { touristId: session.userId },
    select: { id: true },
  });

  const count = await prisma.message.count({
    where: {
      conversationId: { in: myConvs.map((c) => c.id) },
      senderId: { not: session.userId },
      isRead: false,
    },
  });

  return count;
}
