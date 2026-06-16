import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { replyMessageAction, markConversationReadAction } from "@/actions/message.actions";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const isAr = locale === "ar";

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      },
      tourist: true,
    },
  });

  if (!conversation || conversation.touristId !== session.userId) {
    redirect(`/${locale}/messages`);
  }

  // Mark messages as read
  await markConversationReadAction(id);

  const user = { name: session.firstName ?? session.email.split("@")[0], role: session.role };
  const replyAction = replyMessageAction.bind(null, id);

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link
              href={`/${locale}/messages`}
              className="w-9 h-9 rounded-full bg-white border border-desert-200 flex items-center justify-center hover:bg-desert-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-clay-600" />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-clay-800">{conversation.subject}</h1>
              <p className="text-xs text-clay-400">{new Date(conversation.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="bg-white rounded-3xl border border-desert-200 overflow-hidden shadow-sm mb-4">
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {conversation.messages.map((msg) => {
                const isMe = msg.senderId === session.userId;
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${isMe ? "bg-clay-700" : "bg-sand-500"}`}>
                      {msg.sender.firstName.charAt(0)}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isMe ? "bg-clay-800 text-white" : "bg-desert-50 text-clay-800 border border-desert-100"}`}>
                      <p className="text-sm leading-relaxed">{msg.body}</p>
                      <p className={`text-xs mt-1.5 ${isMe ? "text-clay-400" : "text-clay-400"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply form */}
            <div className="border-t border-desert-100 p-4">
              <form
                action={async (formData: FormData) => {
                  "use server";
                  await replyMessageAction(id, formData);
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  name="body"
                  required
                  placeholder={isAr ? "اكتب ردك هنا..." : "Type your reply..."}
                  className="flex-1 px-4 py-2.5 border border-desert-200 rounded-xl text-sm focus:outline-none focus:border-sand-400 bg-desert-50"
                  id="reply-input"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-clay-800 hover:bg-clay-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  id="send-reply-btn"
                >
                  <Send className="w-4 h-4" />
                  {isAr ? "إرسال" : "Send"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
