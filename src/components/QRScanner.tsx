import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { X, ShieldCheck, ShieldAlert, Camera } from "lucide-react";
import { motion } from "motion/react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onClose: () => void;
}

type ScanResult = "scanning" | "safe" | "unsafe";

// Định nghĩa các mã QR an toàn và không an toàn
// Bạn có thể thay đổi các giá trị này sau khi import hình ảnh
const SAFE_QR_CODES = [
  "SAFE_QR_CODE_1", // Thay bằng nội dung mã QR an toàn thật
  "https://chinhphu.vn",
  "SAFE",
];

const UNSAFE_QR_CODES = [
  "UNSAFE_QR_CODE_1", // Thay bằng nội dung mã QR không an toàn thật
  "https://xosodaiphat.com/xsmb-xo-so-mien-bac.html",
  "UNSAFE",
];

export function QRScanner({ onClose }: QRScannerProps) {
  const [scanResult, setScanResult] = useState<ScanResult>("scanning");
  const [scannedCode, setScannedCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  // Cấu hình URL file audio của bạn tại đây
  const audioFiles = {
    safe: "/path/to/ma-an-toan.mp3", // Thay bằng URL file audio "Mã an toàn"
    unsafe: "/path/to/ma-lua-dao.mp3", // Thay bằng URL file audio "Mã có khả năng lừa đảo"
  };

  const playAudio = (type: "safe" | "unsafe") => {
    // Dừng audio đang phát (nếu có)
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Tạo và phát audio mới
    const newAudio = new Audio(audioFiles[type]);
    newAudio.volume = 1.0;
    newAudio.play().catch((error) => {
      console.error("Lỗi phát audio:", error);
      // Fallback về Web Speech API nếu không phát được audio
      const utterance = new SpeechSynthesisUtterance(
        type === "safe" ? "Mã an toàn" : "Mã có khả năng lừa đảo"
      );
      utterance.lang = "vi-VN";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    });
    
    setAudio(newAudio);
  };

  const checkQRCode = (decodedText: string): "safe" | "unsafe" => {
    // Kiểm tra xem mã có trong danh sách an toàn không
    if (SAFE_QR_CODES.some(code => decodedText.includes(code) || code.includes(decodedText))) {
      return "safe";
    }
    
    // Kiểm tra xem mã có trong danh sách không an toàn không
    if (UNSAFE_QR_CODES.some(code => decodedText.includes(code) || code.includes(decodedText))) {
      return "unsafe";
    }
    
    // Mặc định: nếu không khớp với bất kỳ mã nào, coi là không an toàn
    return "unsafe";
  };

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" }, // Sử dụng camera sau
        {
          fps: 10, // Số khung hình mỗi giây
          qrbox: { width: 250, height: 250 }, // Kích thước vùng quét
        },
        (decodedText) => {
          // Callback khi quét thành công
          if (!isScanning.current) {
            isScanning.current = true;
            setScannedCode(decodedText);
            
            const result = checkQRCode(decodedText);
            setScanResult(result);
            playAudio(result);
            
            // Dừng quét
            stopScanning();
          }
        },
        (errorMessage) => {
          // Callback khi có lỗi (bỏ qua, vì lỗi này xảy ra liên tục khi chưa quét được)
          // console.log(errorMessage);
        }
      );
    } catch (err) {
      console.error("Lỗi khi khởi động camera:", err);
      setError("Không thể truy cập camera. Vui lòng cho phép truy cập camera trong cài đặt trình duyệt.");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error("Lỗi khi dừng scanner:", err);
      }
    }
  };

  const handleClose = async () => {
    await stopScanning();
    
    // Dừng audio khi đóng
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    
    onClose();
  };

  const handleScanAgain = async () => {
    isScanning.current = false;
    setScanResult("scanning");
    setScannedCode("");
    setError("");
    
    // Dừng audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    
    // Bắt đầu quét lại
    await startScanning();
  };

  useEffect(() => {
    // Bắt đầu quét khi component mount
    startScanning();

    // Cleanup khi component unmount
    return () => {
      stopScanning();
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Màn hình đang quét
  if (scanResult === "scanning") {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white p-3 md:p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2>Quét mã QR</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 md:h-14 md:w-14 p-0"
            onClick={handleClose}
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </Button>
        </div>

        {/* Camera viewport */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* QR Scanner container */}
            <div id="qr-reader" className="rounded-2xl overflow-hidden shadow-lg"></div>
            
            {/* Instruction text */}
            <p className="text-[#1a1a1a] text-center mt-4">
              <Camera className="w-6 h-6 inline-block mr-2" />
              Di chuyển camera đến mã QR để quét
            </p>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border-2 border-red-300 rounded-2xl">
                <p className="text-red-700 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-2xl">
          <p className="text-[#1a1a1a] text-center">
            💡 Đưa mã QR vào khung hình để quét
          </p>
        </div>
      </div>
    );
  }

  // Màn hình kết quả - Mã an toàn
  if (scanResult === "safe") {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-green-50 to-white p-3 md:p-4">
        {/* Header */}
        <div className="flex justify-end mb-2 md:mb-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 md:h-14 md:w-14 p-0"
            onClick={handleClose}
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </Button>
        </div>

        {/* Safe QR result */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 md:mb-6"
          >
            <ShieldCheck className="w-12 h-12 md:w-14 md:h-14 text-white" />
          </motion.div>

          <h2 className="mb-3 md:mb-4 text-green-600">Mã QR an toàn!</h2>

          <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-4 md:p-6 w-full max-w-sm mb-4">
            <p className="text-[#1a1a1a] text-center">
              ✓ Đây là mã QR hợp lệ và an toàn
            </p>
            <p className="text-[#4a4a4a] text-center mt-2">
              Bạn có thể tiếp tục sử dụng mã này
            </p>
            
            {/* Hiển thị nội dung mã đã quét */}
            <div className="mt-4 p-3 bg-white rounded-xl">
              <p className="text-[#4a4a4a] text-center text-sm">Nội dung mã:</p>
              <p className="text-[#1a1a1a] text-center break-all mt-1">{scannedCode}</p>
            </div>
          </div>

          <Button
            className="w-full max-w-sm min-h-[56px] md:min-h-[60px] bg-blue-500 hover:bg-blue-600"
            onClick={handleScanAgain}
          >
            Quét mã khác
          </Button>
        </div>
      </div>
    );
  }

  // Màn hình kết quả - Mã không an toàn
  if (scanResult === "unsafe") {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-orange-50 to-white p-3 md:p-4">
        {/* Header */}
        <div className="flex justify-end mb-2 md:mb-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 md:h-14 md:w-14 p-0"
            onClick={handleClose}
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </Button>
        </div>

        {/* Unsafe QR result */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-orange-600 rounded-full flex items-center justify-center mb-4 md:mb-6"
          >
            <ShieldAlert className="w-12 h-12 md:w-14 md:h-14 text-white" />
          </motion.div>

          <h2 className="mb-3 md:mb-4 text-orange-700">Cảnh báo nguy hiểm!</h2>

          <div className="bg-orange-100 border-2 border-orange-600 rounded-2xl p-4 md:p-6 w-full max-w-sm mb-4">
            <p className="text-[#1a1a1a] text-center">
              ⚠️ Mã có khả năng lừa đảo
            </p>
            <p className="text-[#4a4a4a] text-center mt-2">
              KHÔNG nên truy cập hoặc cung cấp thông tin cá nhân
            </p>
            
            {/* Hiển thị nội dung mã đã quét */}
            <div className="mt-4 p-3 bg-white rounded-xl">
              <p className="text-[#4a4a4a] text-center text-sm">Nội dung mã:</p>
              <p className="text-[#1a1a1a] text-center break-all mt-1">{scannedCode}</p>
            </div>
          </div>

          <Button
            className="w-full max-w-sm min-h-[56px] md:min-h-[60px] bg-blue-500 hover:bg-blue-600"
            onClick={handleScanAgain}
          >
            Quét mã khác
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
