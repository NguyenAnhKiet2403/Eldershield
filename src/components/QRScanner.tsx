import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, ScanLine, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface QRScannerProps {
  onClose: () => void;
}

type ScanMode = "demo" | "safe" | "unsafe";

export function QRScanner({ onClose }: QRScannerProps) {
  const [mode, setMode] = useState<ScanMode>("demo");

  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (mode === "safe") {
      speak("Mã an toàn");
    } else if (mode === "unsafe") {
      speak("Mã có khả năng lừa đảo");
    }
  }, [mode]);

  const handleBackToDemo = () => {
    window.speechSynthesis.cancel();
    setMode("demo");
  };

  const handleClose = () => {
    window.speechSynthesis.cancel();
    onClose();
  };

  if (mode === "demo") {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2>Demo quét mã QR</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-14 w-14 p-0"
            onClick={handleClose}
          >
            <X className="w-7 h-7" />
          </Button>
        </div>

        {/* Scanner frame */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
          <div className="relative w-full max-w-sm aspect-square">
            {/* Scanner frame with animated corners */}
            <div className="absolute inset-0 border-4 border-gray-300 rounded-3xl overflow-hidden">
              <div className="absolute inset-8 border-2 border-blue-400 rounded-2xl">
                {/* Animated scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-blue-500 shadow-lg shadow-blue-500"
                  animate={{
                    top: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
              
              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
            </div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center">
                <ScanLine className="w-12 h-12 text-blue-500" />
              </div>
            </div>
          </div>

          <p className="text-[#1a1a1a] text-center mt-6">
            Di chuyển camera đến mã QR để quét
          </p>
        </div>

        {/* Demo buttons */}
        <div className="space-y-4">
          <p className="text-center text-[#4a4a4a] mb-2">
            Chọn loại mã QR để demo:
          </p>
          <Button
            onClick={() => setMode("safe")}
            className="w-full min-h-[68px] bg-green-500 hover:bg-green-600 text-white gap-3"
          >
            <ShieldCheck className="w-8 h-8" />
            Mã an toàn
          </Button>
          <Button
            onClick={() => setMode("unsafe")}
            className="w-full min-h-[68px] bg-orange-600 hover:bg-orange-700 text-white gap-3"
          >
            <ShieldAlert className="w-8 h-8" />
            Mã không an toàn
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "safe") {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-green-50 to-white p-6">
        {/* Header */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-14 w-14 p-0"
            onClick={handleBackToDemo}
          >
            <X className="w-7 h-7" />
          </Button>
        </div>

        {/* Safe QR result */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
          >
            <ShieldCheck className="w-14 h-14 text-white" />
          </motion.div>

          <h2 className="mb-4 text-green-600">Mã QR an toàn!</h2>
          
          {/* QR Code placeholder */}
          <div className="w-64 h-64 bg-white border-4 border-green-500 rounded-2xl p-4 mb-6 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-green-100 rounded-xl flex items-center justify-center">
              <div className="grid grid-cols-8 gap-1 p-4">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${
                      Math.random() > 0.5 ? "bg-green-700" : "bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-6 w-full">
            <p className="text-[#1a1a1a] text-center">
              ✓ Đây là mã QR hợp lệ và an toàn
            </p>
            <p className="text-[#4a4a4a] text-center mt-2">
              Bạn có thể tiếp tục sử dụng mã này
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "unsafe") {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-orange-50 to-white p-6">
        {/* Header */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-14 w-14 p-0"
            onClick={handleBackToDemo}
          >
            <X className="w-7 h-7" />
          </Button>
        </div>

        {/* Unsafe QR result */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center mb-6"
          >
            <ShieldAlert className="w-14 h-14 text-white" />
          </motion.div>

          <h2 className="mb-4 text-orange-700">Cảnh báo nguy hiểm!</h2>
          
          {/* QR Code placeholder */}
          <div className="w-64 h-64 bg-white border-4 border-orange-600 rounded-2xl p-4 mb-6 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-orange-100 rounded-xl flex items-center justify-center">
              <div className="grid grid-cols-8 gap-1 p-4">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${
                      Math.random() > 0.5 ? "bg-orange-700" : "bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-orange-100 border-2 border-orange-600 rounded-2xl p-6 w-full">
            <p className="text-[#1a1a1a] text-center">
              ⚠️ Mã có khả năng lừa đảo
            </p>
            <p className="text-[#4a4a4a] text-center mt-2">
              KHÔNG nên truy cập hoặc cung cấp thông tin cá nhân
            </p>
            <Button
              className="w-full min-h-[56px] bg-blue-500 hover:bg-blue-600 mt-4"
              onClick={handleBackToDemo}
            >
              Quét mã khác
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
