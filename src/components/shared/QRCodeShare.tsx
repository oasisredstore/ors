"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { QrCode, X, Share2, Download } from "lucide-react";

interface QRCodeShareProps {
  url: string;
  title: string;
}

export function QRCodeShare({ url, title }: QRCodeShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    // Generate the absolute URL on the client-side
    if (typeof window !== "undefined") {
      if (url.startsWith("/")) {
        setFullUrl(`${window.location.origin}${url}`);
      } else if (!url.startsWith("http")) {
        setFullUrl(`${window.location.origin}/${url}`);
      } else {
        setFullUrl(url);
      }
    }
  }, [url]);

  const handleDownload = () => {
    const svg = document.getElementById("QRCodeImage");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill white background for the PNG
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${title.replace(/\s+/g, "-")}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    // Add XML declaration to fix rendering issues in some browsers
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: `قورارة للحرف - ${title}`, 
          text: "اكتشف هذا على منصة الواحة الحمراء!",
          url: fullUrl 
        });
      }
    } catch (err) {
      console.log("Share failed or was cancelled", err);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-clay-50 border border-clay-200 text-clay-700 rounded-xl transition-all font-medium text-sm shadow-sm"
      >
        <QrCode className="w-4 h-4" />
        <span className="hidden sm:inline">رمز QR</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 p-2 text-clay-400 hover:text-clay-700 hover:bg-clay-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6 mt-2">
              <div className="w-12 h-12 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6 text-sand-600" />
              </div>
              <h3 className="font-bold text-xl text-clay-800 mb-1">{title}</h3>
              <p className="text-sm text-clay-500">امسح الرمز أو شاركه للوصول المباشر</p>
            </div>
            
            {fullUrl && (
              <div className="flex justify-center bg-white p-6 rounded-2xl border-2 border-dashed border-desert-200 mb-6 relative group">
                <QRCode 
                  id="QRCodeImage"
                  value={fullUrl} 
                  size={200}
                  level="H"
                  fgColor="#422006" // clay-900
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-sand-500 hover:bg-sand-600 text-white rounded-xl transition-colors font-semibold text-sm"
              >
                <Download className="w-4 h-4" />
                تحميل
              </button>
              <button 
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-clay-100 hover:bg-clay-200 text-clay-800 rounded-xl transition-colors font-semibold text-sm"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
