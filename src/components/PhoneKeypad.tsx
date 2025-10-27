import { Button } from "./ui/button";
import { Phone, Delete, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function PhoneKeypad() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleNumberPress = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleCallRequest = () => {
    if (phoneNumber) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmCall = () => {
    setShowConfirmDialog(false);
    toast.success(`Đang gọi ${phoneNumber}...`, {
      duration: 3000,
    });
  };

  const handleOpenDemo = () => {
    window.open("https://demo-cuocgoi.vercel.app/", "_blank");
  };

  const keypadButtons = [
    [{ label: "1", value: "1" }, { label: "2", value: "2", subtext: "ABC" }, { label: "3", value: "3", subtext: "DEF" }],
    [{ label: "4", value: "4", subtext: "GHI" }, { label: "5", value: "5", subtext: "JKL" }, { label: "6", value: "6", subtext: "MNO" }],
    [{ label: "7", value: "7", subtext: "PQRS" }, { label: "8", value: "8", subtext: "TUV" }, { label: "9", value: "9", subtext: "WXYZ" }],
    [{ label: "*", value: "*" }, { label: "0", value: "0", subtext: "+" }, { label: "#", value: "#" }],
  ];

  return (
    <>
      <div className="flex flex-col items-center gap-8 px-6 py-8">
        {/* Hiển thị số điện thoại */}
        <div className="w-full max-w-md">
          <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-6 min-h-[90px] flex items-center justify-center">
            <span className="text-[28px] tracking-wider text-[#1a1a1a]">
              {phoneNumber || "Nhập số điện thoại"}
            </span>
          </div>
        </div>

        {/* Bàn phím số */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {keypadButtons.flat().map((button, index) => (
            <Button
              key={index}
              variant="outline"
              className="min-h-[72px] w-full border-2 hover:bg-blue-50 active:bg-blue-100"
              onClick={() => handleNumberPress(button.value)}
            >
              <div className="flex flex-col items-center">
                <span>{button.label}</span>
                {button.subtext && <span className="text-[14px] text-[#4a4a4a] mt-1">{button.subtext}</span>}
              </div>
            </Button>
          ))}
        </div>

        {/* Nút điều khiển */}
        <div className="flex gap-4 w-full max-w-md">
          <Button
            variant="outline"
            className="min-h-[64px] flex-1 border-2"
            onClick={handleDelete}
            disabled={!phoneNumber}
          >
            <Delete className="w-7 h-7" />
          </Button>
          
          <Button
            className="min-h-[64px] flex-1 bg-green-500 hover:bg-green-600 text-white"
            onClick={handleCallRequest}
            disabled={!phoneNumber}
          >
            <Phone className="w-7 h-7 mr-2" />
            Gọi
          </Button>
        </div>

        {/* Nút Demo cuộc gọi tới */}
        <div className="w-full max-w-md">
          <Button
            variant="outline"
            className="w-full min-h-[64px] border-2 border-purple-300 bg-purple-50 hover:bg-purple-100"
            onClick={handleOpenDemo}
          >
            <ExternalLink className="w-7 h-7 mr-3" />
            Demo cuộc gọi tới
          </Button>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận gọi điện</AlertDialogTitle>
            <AlertDialogDescription className="text-[#1a1a1a]">
              Bạn có chắc chắn muốn gọi đến số: <strong className="text-[20px]">{phoneNumber}</strong> không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-[56px]">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              className="min-h-[56px] bg-green-500 hover:bg-green-600"
              onClick={handleConfirmCall}
            >
              Đồng ý gọi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}