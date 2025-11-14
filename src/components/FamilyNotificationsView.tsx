import { Button } from "./ui/button";
import { ArrowLeft, Heart, Shield, CreditCard, MapPin, Phone } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface FamilyNotification {
  id: string;
  from: string;
  relationship: string;
  message: string;
  time: string;
  icon: "shield" | "bank" | "phone" | "location";
}

const mockNotifications: FamilyNotification[] = [
  {
    id: "1",
    from: "Con gái - Lan",
    relationship: "Con gái",
    message: "Nhắc bạn không cung cấp tài khoản ngân hàng qua điện thoại",
    time: "Hôm nay, 14:30",
    icon: "bank"
  },
  {
    id: "2",
    from: "Con trai - Nam",
    relationship: "Con trai",
    message: "Nhắc bạn không trả lời các cuộc gọi lạ yêu cầu chuyển tiền gấp",
    time: "Hôm nay, 10:15",
    icon: "phone"
  },
  {
    id: "3",
    from: "Con gái - Lan",
    relationship: "Con gái",
    message: "Nhắc bạn không nhấn vào link lạ trong tin nhắn SMS",
    time: "Hôm qua, 16:45",
    icon: "shield"
  },
  {
    id: "4",
    from: "Con trai - Nam",
    relationship: "Con trai",
    message: "Nếu cần chuyển tiền, hãy gọi con trước để xác nhận nhé mẹ",
    time: "2 ngày trước",
    icon: "bank"
  },
  {
    id: "5",
    from: "Con gái - Lan",
    relationship: "Con gái",
    message: "Con đã bật tính năng theo dõi vị trí để bảo vệ mẹ",
    time: "3 ngày trước",
    icon: "location"
  }
];

interface FamilyNotificationsViewProps {
  onBack: () => void;
}

export function FamilyNotificationsView({ onBack }: FamilyNotificationsViewProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "bank":
        return <CreditCard className="w-7 h-7 text-blue-600" />;
      case "phone":
        return <Phone className="w-7 h-7 text-orange-600" />;
      case "shield":
        return <Shield className="w-7 h-7 text-green-600" />;
      case "location":
        return <MapPin className="w-7 h-7 text-purple-600" />;
      default:
        return <Heart className="w-7 h-7 text-pink-600" />;
    }
  };

  const getIconBgColor = (iconType: string) => {
    switch (iconType) {
      case "bank":
        return "bg-blue-100";
      case "phone":
        return "bg-orange-100";
      case "shield":
        return "bg-green-100";
      case "location":
        return "bg-purple-100";
      default:
        return "bg-pink-100";
    }
  };

  return (
    <div className="h-full">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="min-h-[56px] min-w-[56px] p-0"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <div>
            <h2>Tin nhắn từ người thân</h2>
            <p className="text-[#4a4a4a]">Lời nhắc yêu thương</p>
          </div>
        </div>

        {/* Info banner */}
        <Alert className="mb-6 border-2 border-pink-300 bg-pink-50">
          <Heart className="h-7 w-7 text-pink-600" />
          <AlertDescription>
            <p className="text-pink-800">
              Người thân của bạn đã gửi những lời nhắc quan tâm để giúp bạn tránh xa lừa đảo
            </p>
          </AlertDescription>
        </Alert>

        {/* Notifications list */}
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-2 border-gray-200 rounded-2xl bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`min-w-[56px] min-h-[56px] ${getIconBgColor(notification.icon)} rounded-full flex items-center justify-center shrink-0`}>
                  {getIcon(notification.icon)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-blue-600">{notification.from}</h3>
                      <p className="text-[#4a4a4a]">{notification.relationship}</p>
                    </div>
                    <p className="text-[#4a4a4a] text-sm whitespace-nowrap">{notification.time}</p>
                  </div>
                  <p className="text-[#1a1a1a] leading-relaxed">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center">
          <p className="text-[#1a1a1a]">
            💙 Người thân luôn quan tâm bảo vệ bạn
          </p>
          <p className="text-[#4a4a4a] mt-2">
            Nếu nghi ngờ, hãy gọi cho con cháu để hỏi
          </p>
        </div>
      </div>
    </div>
  );
}
