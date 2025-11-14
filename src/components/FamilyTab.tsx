import { useState } from "react";
import { Button } from "./ui/button";
import { Crown, Heart, Users } from "lucide-react";
import { FamilyPremiumView } from "./FamilyPremiumView";
import { FamilyNotificationsView } from "./FamilyNotificationsView";
import { FamilyFreeView } from "./FamilyFreeView";

type ViewType = "menu" | "premium" | "notifications" | "free";

export function FamilyTab() {
  const [currentView, setCurrentView] = useState<ViewType>("menu");

  if (currentView === "premium") {
    return <FamilyPremiumView onBack={() => setCurrentView("menu")} />;
  }

  if (currentView === "notifications") {
    return <FamilyNotificationsView onBack={() => setCurrentView("menu")} />;
  }

  if (currentView === "free") {
    return <FamilyFreeView onBack={() => setCurrentView("menu")} />;
  }

  // Main menu view
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center p-4">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-14 h-14 text-white" />
          </div>
          <h2 className="mb-2">Người thân</h2>
          <p className="text-[#4a4a4a]">Chọn chế độ xem bên dưới</p>
        </div>

        <div className="space-y-4">
          {/* Button 1: Premium screen */}
          <Button
            onClick={() => setCurrentView("premium")}
            className="w-full min-h-[80px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg flex flex-col gap-1 py-4"
          >
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8" />
              <div className="text-left">
                <div className="leading-tight">Màn hình gói Premium</div>
                <div className="text-sm opacity-90 leading-tight">Quản lý và theo dõi người thân</div>
              </div>
            </div>
          </Button>

          {/* Button 2: Notifications from family */}
          <Button
            onClick={() => setCurrentView("notifications")}
            className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg flex flex-col gap-1 py-4"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8" />
              <div className="text-left">
                <div className="leading-tight">Màn hình người thân</div>
                <div className="text-sm opacity-90 leading-tight">Tin nhắn từ người được theo dõi</div>
              </div>
            </div>
          </Button>

          {/* Button 3: Free user upgrade screen */}
          <Button
            onClick={() => setCurrentView("free")}
            className="w-full min-h-[80px] bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg flex flex-col gap-1 py-4"
          >
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div className="text-left">
                <div className="leading-tight">Màn hình người dùng Free</div>
                <div className="text-sm opacity-90 leading-tight">Nâng cấp để mở khóa tính năng</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Info text */}
        <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center">
          <p className="text-[#1a1a1a]">
            💡 Đây là trang demo các chế độ
          </p>
          <p className="text-[#4a4a4a] mt-2">
            Chọn một nút để xem giao diện tương ứng
          </p>
        </div>
      </div>
    </div>
  );
}
