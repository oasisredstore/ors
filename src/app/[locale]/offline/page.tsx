import Link from "next/link";

export const metadata = {
  title: "You're Offline — Gourara Crafts",
  description: "It looks like you've lost your internet connection. Check your connection and try again.",
};

export default function OfflinePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #1E1410 0%, #2D1C14 40%, #1E1410 70%, #3C2508 100%)",
      }}
    >
      {/* Background ambient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(204,144,32,0.40) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, rgba(192,74,26,0.30) 0%, transparent 70%)" }}
      />

      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-zenete opacity-5 pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #DEB048 0%, #C04A1A 60%, #762C0C 100%)",
              boxShadow: "0 0 60px rgba(204,144,32,0.25), 0 8px 40px rgba(0,0,0,0.40)",
            }}
          >
            <span
              className="font-arabic font-black text-white"
              style={{ fontSize: "2rem" }}
            >
              ق
            </span>
          </div>
        </div>

        {/* Offline icon */}
        <div className="text-7xl mb-6">📶</div>

        <h1 className="font-display text-4xl font-bold text-white mb-4">
          You're Offline
          <span className="font-arabic block text-2xl mt-1" style={{ color: "#DEB048" }}>
            أنت غير متصل
          </span>
        </h1>

        <p className="text-clay-300 text-lg mb-3 leading-relaxed">
          It looks like you've lost your internet connection.
        </p>
        <p className="font-arabic text-clay-400 text-base mb-10" dir="rtl">
          يبدو أنك فقدت الاتصال بالإنترنت. تحقق من اتصالك وحاول مجدداً.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl w-full sm:w-auto justify-center"
            style={{
              background: "linear-gradient(135deg, #DEB048 0%, #C04A1A 100%)",
              boxShadow: "0 8px 24px rgba(192,74,26,0.40)",
            }}
          >
            🔄 Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-clay-300 hover:text-white transition-all w-full sm:w-auto justify-center"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            🏠 Home
          </Link>
        </div>

        {/* Helpful note */}
        <p className="text-clay-500 text-sm mt-10 max-w-sm mx-auto leading-relaxed">
          Pages you've visited recently may still be available in offline mode.
        </p>
      </div>
    </div>
  );
}
