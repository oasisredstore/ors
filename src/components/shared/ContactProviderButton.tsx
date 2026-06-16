"use client";

import { useState } from "react";
import { createConversationAction } from "@/actions/message.actions";
import { toast } from "react-hot-toast";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface ContactProviderButtonProps {
  artisanId?: string;
  providerId?: string;
  name: string;
  locale: string;
}

export function ContactProviderButton({
  artisanId,
  providerId,
  name,
  locale,
}: ContactProviderButtonProps) {
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createConversationAction(formData);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isAr ? "تم إرسال رسالتك ✓" : "Message sent ✓");
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-oasis-600 hover:bg-oasis-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg"
        id="contact-provider-btn"
      >
        <MessageCircle className="w-4 h-4" />
        {isAr ? "تواصل معنا" : "Send Message"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-desert-50 flex items-center justify-center hover:bg-desert-100 transition-colors"
            >
              <X className="w-4 h-4 text-clay-600" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-oasis-400 to-oasis-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-clay-800">
                  {isAr ? "إرسال رسالة" : "Send a Message"}
                </h3>
                <p className="text-xs text-clay-500">{isAr ? `إلى: ${name}` : `To: ${name}`}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {artisanId && <input type="hidden" name="artisanId" value={artisanId} />}
              {providerId && <input type="hidden" name="providerId" value={providerId} />}

              <div>
                <label className="block text-xs font-medium text-clay-600 mb-1.5">
                  {isAr ? "موضوع الرسالة *" : "Subject *"}
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  minLength={2}
                  maxLength={200}
                  placeholder={isAr ? "مثال: استفسار عن الحجز" : "e.g. Inquiry about booking"}
                  className="w-full px-3 py-2.5 border border-desert-200 rounded-xl text-sm focus:outline-none focus:border-sand-400"
                  id="msg-subject"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-clay-600 mb-1.5">
                  {isAr ? "الرسالة *" : "Message *"}
                </label>
                <textarea
                  name="body"
                  required
                  minLength={5}
                  maxLength={2000}
                  rows={4}
                  placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."}
                  className="w-full px-3 py-2.5 border border-desert-200 rounded-xl text-sm focus:outline-none focus:border-sand-400 resize-none"
                  id="msg-body"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-clay-900 hover:bg-clay-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                id="msg-send-btn"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isAr ? "إرسال" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
