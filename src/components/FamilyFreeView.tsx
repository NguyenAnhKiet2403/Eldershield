import { Button } from "./ui/button";
import { ArrowLeft, Crown, Shield, MapPin, BarChart3, Phone, Bell, Zap, CheckCircle2, Lock } from "lucide-react";

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const premiumFeatures: Feature[] = [
  {
    id: "1",
    icon: <Shield className="w-10 h-10" />,
    title: "AI cảnh báo lừa đảo thời gian thực",
    description: "Nhận diện và chặn cuộc gọi, tin nhắn lừa đảo ngay lập tức bằng AI tiên tiến"
  },
  {
    id: "2",
    icon: <MapPin className="w-10 h-10" />,
    title: "Định vị người thân",
    description: "Theo dõi vị trí người thân để đảm bảo an toàn, nhận cảnh báo khi vào vùng nguy hiểm"
  },
  {
    id: "3",
    icon: <BarChart3 className="w-10 h-10" />,
    title: "Biểu đồ phân tích chi tiết",
    description: "Xem thống kê đầy đủ về các mối đe dọa, xu hướng lừa đảo và báo cáo hàng tháng"
  },
  {
    id: "4",
    icon: <Bell className="w-10 h-10" />,
    title: "Thông báo ưu tiên",
    description: "Nhận cảnh báo ngay lập tức khi phát hiện dấu hiệu lừa đảo với người thân"
  },
  {
    id: "5",
    icon: <Phone className="w-10 h-10" />,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ chuyên gia tư vấn an toàn mạng hỗ trợ bạn bất cứ lúc nào"
  },
  {
    id: "6",
    icon: <Lock className="w-10 h-10" />,
    title: "Bảo vệ toàn diện",
    description: "Mở rộng bảo vệ lên đến 8 người thân với 1 tài khoản Premium"
  }
];

interface FamilyFreeViewProps {
  onBack: () => void;
}

export function FamilyFreeView({ onBack }: FamilyFreeViewProps) {
  return (
    <div className="h-full overflow-y-auto">
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
          <h2>Nâng cấp Premium</h2>
        </div>

        {/* Premium banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 p-6 mb-6 shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-12 h-12 text-amber-500" />
              </div>
            </div>
            <h2 className="text-white text-center mb-2">ElderShield Premium</h2>
            <p className="text-white text-center opacity-90">
              Bảo vệ toàn diện cho bạn và người thân
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Current plan notice */}
        <div className="mb-6 p-4 border-2 border-gray-300 rounded-2xl bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-[#1a1a1a]">Gói hiện tại: <strong>Miễn phí</strong></p>
              <p className="text-[#4a4a4a]">Tính năng giới hạn</p>
            </div>
          </div>
        </div>

        {/* Features list */}
        <div className="mb-6">
          <h3 className="mb-4 text-center">Tính năng Premium</h3>
          <div className="space-y-4">
            {premiumFeatures.map((feature) => (
              <div
                key={feature.id}
                className="p-4 border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50 to-white"
              >
                <div className="flex gap-4">
                  <div className="min-w-[64px] min-h-[64px] bg-blue-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-600 mb-2">{feature.title}</h3>
                    <p className="text-[#4a4a4a] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits comparison */}
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-2xl">
          <h3 className="text-green-700 mb-4 text-center">Lợi ích khi nâng cấp</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <p className="text-[#1a1a1a]">Bảo vệ không giới hạn người thân (lên đến 8 người)</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <p className="text-[#1a1a1a]">AI phát hiện lừa đảo chính xác 99.9%</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <p className="text-[#1a1a1a]">Ưu tiên hỗ trợ khẩn cấp 24/7</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <p className="text-[#1a1a1a]">Cập nhật tính năng mới liên tục</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl">
          <div className="text-center mb-4">
            <p className="text-[#4a4a4a] mb-2">Giá ưu đãi đặc biệt</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-400 line-through">499.000đ/tháng</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 mt-2">
              <span className="text-purple-600">Chỉ</span>
              <span className="text-purple-600">199.000đ</span>
              <span className="text-[#4a4a4a]">/tháng</span>
            </div>
            <div className="mt-2 inline-block bg-red-500 text-white px-4 py-1 rounded-full">
              <Zap className="w-5 h-5 inline mr-1" />
              Giảm 60%
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            className="w-full min-h-[68px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
            onClick={() => {}}
          >
            <Crown className="w-7 h-7 mr-3" />
            Nâng cấp Premium ngay
          </Button>
          
          <Button
            variant="outline"
            className="w-full min-h-[64px] border-2 border-blue-300 hover:bg-blue-50"
            onClick={() => {}}
          >
            Dùng thử miễn phí 7 ngày
          </Button>
        </div>

        {/* Trust badges */}
        <div className="text-center space-y-2">
          <p className="text-[#4a4a4a]">✓ Thanh toán an toàn</p>
          <p className="text-[#4a4a4a]">✓ Hủy bất cứ lúc nào</p>
          <p className="text-[#4a4a4a]">✓ Hoàn tiền trong 30 ngày</p>
        </div>
      </div>
    </div>
  );
}
