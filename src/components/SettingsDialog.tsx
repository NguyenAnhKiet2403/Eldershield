import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { Settings, User, Phone, LogOut } from "lucide-react";
import { Separator } from "./ui/separator";
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
import { useState } from "react";

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const handleCallSupport = () => {
    toast.success("Đang gọi tổng đài hỗ trợ: 1900-xxxx...", {
      duration: 3000,
    });
  };

  const handleLogoutRequest = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutDialog(false);
    toast.success("Đã đăng xuất thành công", {
      duration: 2000,
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Cài đặt tài khoản</DialogTitle>
            <DialogDescription className="sr-only">
              Xem thông tin tài khoản và các tùy chọn cài đặt
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 p-2">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h2>Nguyễn Văn A</h2>
                <p className="text-[#4a4a4a] mt-2">ID: USER001</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full min-h-[64px] justify-start border-2"
                onClick={handleCallSupport}
              >
                <Phone className="w-7 h-7 mr-4" />
                Gọi tổng đài hỗ trợ
              </Button>

              <Button
                variant="outline"
                className="w-full min-h-[64px] justify-start border-2"
              >
                <Settings className="w-7 h-7 mr-4" />
                Cài đặt chung
              </Button>

              <Separator />

              <Button
                variant="outline"
                className="w-full min-h-[64px] justify-start border-2 text-orange-700 border-orange-200 hover:bg-orange-50"
                onClick={handleLogoutRequest}
              >
                <LogOut className="w-7 h-7 mr-4" />
                Đăng xuất
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-[#4a4a4a]">
                ElderShield v1.0 - Bảo vệ người thân
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription className="text-[#1a1a1a]">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-[56px]">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              className="min-h-[56px] bg-orange-600 hover:bg-orange-700"
              onClick={handleConfirmLogout}
            >
              Đồng ý đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}