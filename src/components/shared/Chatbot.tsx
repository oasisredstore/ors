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
    keywords: ["فاتيس", "سجاد", "نسيج", "زناتي", "زرابي", "fatiss", "carpet", "weaving", "rug"],
    responseAr: "سجادة <b>الفاتيس</b> هي تحفة من النسيج الزناتي في قورارة. تُنسج يدوياً من الصوف الطبيعي وتتميز برموز هندسية مثل المعينات التي ترمز لدرء العين الحاسدة. <br/><br/><a href='/ar/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>تصفح السجاد من هنا</a>",
    responseEn: "The <b>Fatiss</b> carpet is a masterpiece of Zenete weaving from Gourara. Handwoven from natural wool, it features geometric symbols like diamonds to deflect the evil eye. <br/><br/><a href='/en/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>Browse carpets here</a>"
  },
  {
    keywords: ["تادارة", "سعف", "نخيل", "طبق", "tadara", "palm", "plate", "basket"],
    responseAr: "<b>التادارة</b> هي طبق مخروطي يُصنع ببراعة من سعف نخيل التمر. تُستخدم تقليدياً لحفظ الخبز دافئاً وحمايته من رمال الصحراء. <br/><br/><a href='/ar/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>اكتشف منتجات السعف</a>",
    responseEn: "The <b>Tadara</b> is a conical plate skillfully crafted from date-palm fronds. It is traditionally used to keep bread warm and protect it from desert sand. <br/><br/><a href='/en/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>Discover palm products</a>"
  },
  {
    keywords: ["هدية", "تذكار", "سياحة", "هدايا", "gift", "souvenir", "tourist", "recommend"],
    responseAr: "لدينا العديد من الهدايا الرائعة للسياح! إذا كنت تبحث عن شيء صغير وأصيل، أنصحك بـ <b>البلغة الجلدية</b> أو <b>مروحة السعف</b>. أما إذا أردت قطعة فاخرة، فلا شيء يعلو على <b>سوار الدارة الفضي</b>. <br/><br/><a href='/ar/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>تصفح كل المنتجات</a>",
    responseEn: "We have wonderful souvenirs! If you want something small and authentic, I recommend the <b>Leather Babouches</b> or the <b>Palm Leaf Fan</b>. For a premium gift, nothing beats the <b>Silver Dara Bracelet</b>. <br/><br/><a href='/en/products' style='color:#b45309; text-decoration:underline; font-weight:bold;'>Browse all products</a>"
  },
  {
    keywords: ["فقارة", "ري", "ماء", "فخار", "براد", "foggara", "water", "irrigation", "clay", "barrad"],
    responseAr: "ارتباط قورارة بالماء فريد جداً! الفخار الأحمر كـ <b>البرّاد</b> يستخدم للتبريد الطبيعي، و <b>نظام الفقارة</b> هو هندسة جوفية عبقرية لتوزيع المياه بين الواحات.",
    responseEn: "Gourara's connection to water is unique! Red clay like the <b>Barrad</b> is used for natural cooling, and the <b>Foggara</b> system is an ingenious underground engineering for water distribution."
  },
  {
    keywords: ["توصيل", "شحن", "شراء", "دفع", "delivery", "shipping", "buy", "pay"],
    responseAr: "حالياً المنصة في المرحلة التجريبية. قريباً سنوفر خدمات التوصيل على المستوى الوطني والدولي بالتعاون مع شركائنا. الدفع حالياً يتم عند الاستلام.",
    responseEn: "Currently, the platform is in its pilot phase. We will soon offer national and international delivery services. Payment is currently cash on delivery."
  },
  {
    keywords: ["حرفي", "صانع", "اتصال", "تواصل", "موقع", "artisan", "maker", "contact", "whatsapp"],
    responseAr: "يمكنك التواصل مع أي حرفي مباشرة عبر صفحة المنتج أو ملفه الشخصي باستخدام زر الواتساب أو البريد الإلكتروني المباشر. نحن ندعم التواصل المباشر لدعم السياحة المكانية!",
    responseEn: "You can contact any artisan directly via the product page or their profile using the WhatsApp or direct email buttons. We support direct contact to promote geo-tourism!"
  },
  {
    keywords: ["مرحبا", "سلام", "اهلا", "hello", "hi", "hey"],
    responseAr: "مرحباً بك في الواحة الحمراء! أنا دليلك الذكي لقورارة. كيف يمكنني مساعدتك في استكشاف تراثنا اليوم؟",
    responseEn: "Welcome to the Red Oasis! I am your smart Gourara guide. How can I help you explore our heritage today?"
  }
];

const DEFAULT_RESPONSE_AR = "عذراً، لم أفهم سؤالك تماماً. أنا نظام خبير مبرمج للإجابة عن أسئلة تخص تراث تيميمون (مثل التادارة، الفاتيس، الفخار، أو اقتراحات الهدايا). جرب سؤالي عن هذه المواضيع!";
const DEFAULT_RESPONSE_EN = "Sorry, I didn't quite catch that. I am an expert system programmed to answer questions about Timimoun's heritage (like Tadara, Fatiss, Pottery, or Souvenirs). Try asking me about these topics!";

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
            ? "مرحباً! أنا دليل قورارة الذكي 🌴. اسألني عن الهدايا التذكارية، التادارة، الفاتيس، أو أي شيء يخص تراث تيميمون." 
            : "Hello! I'm the Gourara Smart Guide 🌴. Ask me about souvenirs, Tadara, Fatiss, or anything about Timimoun's heritage.",
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
    ? ["اقترح لي هدية", "ما هي التادارة؟", "قصة سجاد الفاتيس", "التوصيل والدفع"]
    : ["Suggest a souvenir", "What is Tadara?", "Fatiss carpet story", "Shipping info"];

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
