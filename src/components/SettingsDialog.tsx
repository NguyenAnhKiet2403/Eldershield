import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { Settings, User, Phone, LogOut, Shield, ChevronRight } from "lucide-react";
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
import { getStoredPermissions, savePermissions, initialPermissions } from "./PermissionRequest";
import type { Permission } from "./PermissionRequest";

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>(getStoredPermissions());
  
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

  const handleTogglePermission = (permissionId: string) => {
    const newPermissions = permissions.map(p =>
      p.id === permissionId ? { ...p, granted: !p.granted } : p
    );
    setPermissions(newPermissions);
    savePermissions(newPermissions);
    toast.success(
      newPermissions.find(p => p.id === permissionId)?.granted 
        ? "Đã cấp quyền" 
        : "Đã thu hồi quyền",
      { duration: 2000 }
    );
  };

  const getPermissionIcon = (iconType: typeof Shield) => {
    return iconType;
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Cài đặt tài khoản</DialogTitle>
            <DialogDescription className="sr-only">
              Xem thông tin tài khoản và các tùy chọn cài đặt
            </DialogDescription>
          </DialogHeader>

          {!showPermissions ? (
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
                  className="w-full min-h-[64px] justify-between border-2"
                  onClick={() => setShowPermissions(true)}
                >
                  <div className="flex items-center">
                    <Shield className="w-7 h-7 mr-4" />
                    Quản lý quyền truy cập
                  </div>
                  <ChevronRight className="w-6 h-6" />
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
          ) : (
            <div className="space-y-6 p-2">
              {/* Back button */}
              <Button
                variant="ghost"
                className="min-h-[56px] gap-2"
                onClick={() => setShowPermissions(false)}
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
                Quay lại
              </Button>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="mb-2">Quản lý quyền</h2>
                <p className="text-[#4a4a4a]">
                  Bật hoặc tắt các quyền truy cập của app
                </p>
              </div>

              <Separator />

              {/* Permissions list */}
              <div className="space-y-3">
                {permissions.map((permission) => {
                  const Icon = getPermissionIcon(permission.icon);
                  return (
                    <div
                      key={permission.id}
                      className="p-4 border-2 border-gray-200 rounded-2xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`min-w-[56px] min-h-[56px] rounded-full flex items-center justify-center flex-shrink-0 ${
                          permission.granted ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-7 h-7 ${
                            permission.granted ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="mb-2">{permission.name}</h3>
                          <p className="text-[#4a4a4a] text-[16px] mb-3">
                            {permission.description}
                          </p>
                          <Button
                            onClick={() => handleTogglePermission(permission.id)}
                            className={`min-h-[48px] w-full ${
                              permission.granted
                                ? 'bg-orange-600 hover:bg-orange-700'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                          >
                            {permission.granted ? 'Thu hồi quyền' : 'Cấp quyền'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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