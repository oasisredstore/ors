"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  isHtml?: boolean;
}

const KNOWLEDGE_BASE = [
  {
    keywords: ["حجز", "فندق", "مبيت", "إقامة", "غرفة", "hotel", "stay", "book", "room", "accommodation"],
    responseAr: "نقدم في المنصة خدمة حجز الفنادق ودور الضيافة (القصور) في تيميمون. يمكنك تصفح أماكن الإقامة، رؤية التقييمات، والحجز مباشرة عبر المنصة! <br/><br/><a href='/ar/services' style='color:#b45309; text-decoration:underline; font-weight:bold;'>تصفح أماكن الإقامة</a>",
    responseEn: "We offer bookings for hotels and guesthouses (Ksours) in Timimoun. You can browse accommodations, see reviews, and book directly! <br/><br/><a href='/en/services' style='color:#b45309; text-decoration:underline; font-weight:bold;'>Browse accommodations</a>"
  },
  {
    keywords: ["مرشد", "دليل", "جولة", "سفاري", "نقل", "guide", "transport", "tour", "safari", "trip"],
    responseAr: "يمكنك العثور على مرشدين سياحيين محليين معتمدين لرحلات السفاري بالدفع الرباعي أو جولات الجمال في العرق الغربي الكبير، بالإضافة لخدمات النقل الموثوقة. <br/><br/><a href='/ar/services' style='color:#b45309; text-decoration:underline; font-weight:bold;'>ابحث عن مرشد</a>",
    responseEn: "You can find certified local guides for 4x4 safaris or camel treks into the Grand Erg Occidental, as well as reliable transport services. <br/><br/><a href='/en/services' style='color:#b45309; text-decoration:underline; font-weight:bold;'>Find a guide</a>"
  },
  {
    keywords: ["تسجيل", "انضمام", "حرفي", "مقدم خدمة", "بيع", "register", "join", "sell", "account", "provider"],
    responseAr: "تدعم منصتنا تعدد الأدوار! يمكنك الانضمام كعميل عادي، أو كـ <b>حرفي</b> لبيع منتجاتك، أو كـ <b>مقدم خدمة سياحية</b> (فندق/مرشد) لتلقي الحجوزات. الحرفيون ومقدمو الخدمات يحصلون على لوحة تحكم خاصة بهم.",
    responseEn: "Our platform supports multiple roles! You can join as a Customer, an <b>Artisan</b> to sell products, or a <b>Tourism Provider</b> (Hotel/Guide) to receive bookings. Artisans and Providers get their own dashboard."
  },
  {
    keywords: ["متحف", "تراث", "تاريخ", "ثقافة", "heritage", "museum", "history", "culture"],
    responseAr: "تيميمون غنية بالتراث! ندعوك لزيارة <b>المتحف الرقمي</b> في منصتنا لاستكشاف العمارة الحمراء، أنظمة الفقارة، والصناعات التقليدية عبر الزمن. <br/><br/><a href='/ar/heritage' style='color:#b45309; text-decoration:underline; font-weight:bold;'>زيارة المتحف الرقمي</a>",
    responseEn: "Timimoun is rich in heritage! Visit our <b>Virtual Museum</b> to explore the red architecture, Foggara systems, and traditional crafts through time. <br/><br/><a href='/en/heritage' style='color:#b45309; text-decoration:underline; font-weight:bold;'>Visit Virtual Museum</a>"
  },
  {
    keywords: ["فاتيس", "سجاد", "نسيج", "زناتي", "زرابي", "fatiss", "carpet", "weaving", "rug"],
    responseAr: "سجادة <b>الفاتيس</b> هي تحفة من النسيج الزناتي في قورارة. تُنسج يدوياً من الصوف الطبيعي. <br/><br/><a href='/ar/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>تصفح السجاد من هنا</a>",
    responseEn: "The <b>Fatiss</b> carpet is a masterpiece of Zenete weaving from Gourara. Handwoven from natural wool. <br/><br/><a href='/en/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>Browse carpets here</a>"
  },
  {
    keywords: ["هدية", "تذكار", "هدايا", "gift", "souvenir", "recommend"],
    responseAr: "لدينا منتجات حرفية أصيلة! أنصحك بـ <b>البلغة الجلدية</b>، <b>مروحة السعف</b>، أو <b>سوار الدارة الفضي</b> كهدية فاخرة. <br/><br/><a href='/ar/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>تصفح كل المنتجات</a>",
    responseEn: "We have authentic crafts! I recommend <b>Leather Babouches</b>, <b>Palm Leaf Fan</b>, or the <b>Silver Dara Bracelet</b> as a premium gift. <br/><br/><a href='/en/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>Browse all products</a>"
  },
  {
    keywords: ["مرحبا", "سلام", "اهلا", "hello", "hi", "hey"],
    responseAr: "مرحباً بك في الواحة الحمراء! أنا دليلك الذكي الشامل. كيف يمكنني مساعدتك في حجز فندق، إيجاد مرشد، أو شراء منتجات حرفية؟",
    responseEn: "Welcome to the Red Oasis! I am your smart guide. How can I help you book a hotel, find a guide, or buy authentic crafts?"
  }
];

const DEFAULT_RESPONSE_AR = "عذراً، لم أفهم سؤالك تماماً. أنا مبرمج للإجابة عن أسئلة تخص خدمات المنصة (مثل حجز الفنادق، المرشدين السياحيين، المنتجات الحرفية، وطريقة الانضمام). جرب سؤالي عن هذه المواضيع!";
const DEFAULT_RESPONSE_EN = "Sorry, I didn't quite catch that. I am programmed to answer questions about our platform services (like hotel bookings, tour guides, artisan products, and how to join). Try asking me about these topics!";

export function Chatbot({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: isAr 
            ? "مرحباً! أنا دليل قورارة الذكي 🌴. اسألني عن حجز الفنادق، الجولات السياحية، المنتجات الحرفية، أو كيفية الانضمام للمنصة." 
            : "Hello! I'm the Gourara Smart Guide 🌴. Ask me about hotel bookings, tours, handmade crafts, or how to join the platform.",
          isHtml: false
        }
      ]);
    }
  }, [isAr, messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const lowerInput = text.toLowerCase();
      let bestResponse = isAr ? DEFAULT_RESPONSE_AR : DEFAULT_RESPONSE_EN;

      for (const item of KNOWLEDGE_BASE) {
        // Simple keyword matching
        if (item.keywords.some((kw) => lowerInput.includes(kw))) {
          bestResponse = isAr ? item.responseAr : item.responseEn;
          break; // Stop at first match
        }
      }

      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: "bot", 
        text: bestResponse,
        isHtml: true 
      };
      
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay for realism
  };

  const quickReplies = isAr 
    ? ["حجز فندق", "مرشد سياحي", "اقترح لي هدية", "كيف أنضم كحرفي؟"]
    : ["Book a hotel", "Find a guide", "Suggest a gift", "Join as an artisan"];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 ${isAr ? 'right-4 sm:right-6' : 'left-4 sm:left-6'} z-50 w-14 h-14 bg-gradient-to-br from-sand-500 to-clay-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300 group`}
        aria-label="Open Chatbot"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        {/* Notification dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-24 ${isAr ? 'right-4 sm:right-6' : 'left-4 sm:left-6'} z-50 w-[90vw] sm:w-[350px] bg-white rounded-3xl shadow-2xl border border-desert-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300`}
          style={{ height: '500px', maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-clay-900 to-clay-800 p-4 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-sand-500 rounded-full flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{isAr ? "دليل قورارة الذكي" : "Gourara Smart Guide"}</h3>
                <p className="text-xs text-sand-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                  {isAr ? "متصل الآن" : "Online"}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 bg-clay-800 hover:bg-clay-700 rounded-full transition-colors relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-desert-50 space-y-4" dir={isAr ? "rtl" : "ltr"}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? (isAr ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row-reverse') : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "bot" ? 'bg-sand-500 text-white' : 'bg-clay-200 text-clay-600'}`}>
                  {msg.sender === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                
                {/* Bubble */}
                <div 
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "bot" 
                      ? 'bg-white text-clay-700 border border-desert-200 rounded-tr-none' 
                      : 'bg-clay-800 text-white rounded-tl-none'
                  }`}
                >
                  {msg.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-sand-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 bg-white border border-desert-200 rounded-2xl rounded-tr-none flex gap-1 items-center">
                  <span className="w-2 h-2 bg-clay-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-clay-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-clay-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length < 3 && !isTyping && (
            <div className="px-4 py-2 bg-white flex overflow-x-auto gap-2 pb-2 scrollbar-hide shrink-0 border-t border-desert-100" dir={isAr ? "rtl" : "ltr"}>
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(reply)}
                  className="whitespace-nowrap px-3 py-1.5 bg-desert-100 hover:bg-sand-100 text-clay-600 hover:text-sand-700 text-xs rounded-full transition-colors border border-desert-200"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-desert-200 shrink-0" dir={isAr ? "rtl" : "ltr"}>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAr ? "اكتب رسالتك هنا..." : "Type your message..."}
                className="flex-1 bg-desert-50 border border-desert-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sand-400 focus:ring-1 focus:ring-sand-400 text-clay-800"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-clay-800 hover:bg-clay-900 disabled:bg-clay-300 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                <Send className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </button>
            </form>
            <p className="text-[10px] text-center text-clay-400 mt-2">
              {isAr ? "مساعد رقمي مبني على نظام المعرفة الخبير" : "Expert System based digital assistant"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
