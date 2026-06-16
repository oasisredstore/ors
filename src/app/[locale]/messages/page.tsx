import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { replyMessageAction, markConversationReadAction } from "@/actions/message.actions";
import { MessageCircle, ArrowLeft } from "lucide-react";

export default async function MessagesInboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const isAr = locale === "ar";

  // Get all conversations for this user (as tourist)
  const conversations = await prisma.conversation.findMany({
    where: { touristId: session.userId },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  const user = { name: session.firstName ?? session.email.split("@")[0], role: session.role };

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-clay-800 mb-6">
            {isAr ? "صندوق الرسائل" : "Message Inbox"}
          </h1>

          {conversations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-desert-100 p-16 text-center shadow-sm">
              <MessageCircle className="w-12 h-12 text-clay-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-clay-700 mb-2">
                {isAr ? "لا توجد رسائل بعد" : "No messages yet"}
              </h3>
              <p className="text-sm text-clay-400 max-w-xs mx-auto">
                {isAr
                  ? "يمكنك التواصل مع مزودي الخدمات من صفحات خدماتهم"
                  : "You can contact service providers from their service pages"}
              </p>
              <Link href={`/${locale}/services`} className="mt-5 inline-block text-sm text-sand-600 font-semibold hover:text-sand-700">
                {isAr ? "استعرض الخدمات ←" : "Browse Services →"}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => {
                const last = conv.messages[0];
                const isUnread = last && !last.isRead && last.senderId !== session.userId;
                return (
                  <Link
                    key={conv.id}
                    href={`/${locale}/messages/${conv.id}`}
                    className={`block bg-white rounded-2xl border p-5 hover:shadow-md transition-all ${isUnread ? "border-sand-400" : "border-desert-200"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sand-300 to-clay-600 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className={`text-sm truncate ${isUnread ? "font-bold text-clay-900" : "font-semibold text-clay-700"}`}>
                            {conv.subject}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0">
                            {isUnread && <span className="w-2 h-2 bg-sand-500 rounded-full" />}
                            <span className="text-xs text-clay-400">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {last && (
                          <p className="text-xs text-clay-500 truncate">{last.body}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
