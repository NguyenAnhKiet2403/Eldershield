import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Shield, Mic, Phone, MessageSquare, Bell, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface Permission {
  id: string;
  name: string;
  description: string;
  icon: typeof Shield;
  granted: boolean;
}

interface PermissionRequestProps {
  onComplete: () => void;
}

const PERMISSIONS_KEY = "eldershield_permissions";

export const initialPermissions: Permission[] = [
  {
    id: "RECORD_AUDIO",
    name: "Ghi âm",
    description: "Để ghi lại nội dung cuộc gọi lừa đảo làm bằng chứng",
    icon: Mic,
    granted: false,
  },
  {
    id: "READ_PHONE_STATE",
    name: "Đọc trạng thái điện thoại",
    description: "Để phát hiện cuộc gọi đến và kiểm tra số điện thoại lừa đảo",
    icon: Phone,
    granted: false,
  },
  {
    id: "READ_SMS",
    name: "Đọc tin nhắn SMS",
    description: "Để quét và phát hiện tin nhắn lừa đảo",
    icon: MessageSquare,
    granted: false,
  },
  {
    id: "RECEIVE_SMS",
    name: "Nhận tin nhắn SMS",
    description: "Để kiểm tra tin nhắn đến có phải lừa đảo hay không",
    icon: MessageSquare,
    granted: false,
  },
  {
    id: "SYSTEM_ALERT_WINDOW",
    name: "Hiển thị cảnh báo trên màn hình",
    description: "Để hiển thị cảnh báo ngay khi có cuộc gọi hoặc tin nhắn lừa đảo",
    icon: Eye,
    granted: false,
  },
  {
    id: "POST_NOTIFICATIONS",
    name: "Gửi thông báo",
    description: "Để thông báo cho bạn và người thân về các mối đe dọa lừa đảo",
    icon: Bell,
    granted: false,
  },
];

export function getStoredPermissions(): Permission[] {
  if (typeof window === "undefined") return initialPermissions;
  
  const stored = localStorage.getItem(PERMISSIONS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return initialPermissions.map(p => ({
        ...p,
        granted: parsed[p.id] || false,
      }));
    } catch {
      return initialPermissions;
    }
  }
  return initialPermissions;
}

export function savePermissions(permissions: Permission[]) {
  const permissionsMap = permissions.reduce((acc, p) => {
    acc[p.id] = p.granted;
    return acc;
  }, {} as Record<string, boolean>);
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissionsMap));
}

export function hasRequestedPermissions(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PERMISSIONS_KEY) !== null;
}

export function PermissionRequest({ onComplete }: PermissionRequestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [direction, setDirection] = useState(1);

  const currentPermission = permissions[currentIndex];
  const Icon = currentPermission?.icon || Shield;

  const handleGrant = (granted: boolean) => {
    const newPermissions = [...permissions];
    newPermissions[currentIndex] = {
      ...newPermissions[currentIndex],
      granted,
    };
    setPermissions(newPermissions);

    if (currentIndex < permissions.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Save and complete
      savePermissions(newPermissions);
      onComplete();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  if (!currentPermission) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="mb-2">Yêu cầu quyền truy cập</h2>
          <p className="text-[#4a4a4a]">
            Để bảo vệ bạn tốt nhất, ElderShield cần một số quyền
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-6 justify-center">
          {permissions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-blue-500"
                  : index < currentIndex
                  ? "w-2 bg-green-500"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Permission card with animation */}
        <div className="overflow-hidden mb-6 min-h-[280px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-center mb-3">{currentPermission.name}</h3>
                <p className="text-[#1a1a1a] text-center mb-4">
                  {currentPermission.description}
                </p>
                <div className="text-center text-[#4a4a4a]">
                  Quyền {currentIndex + 1} / {permissions.length}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => handleGrant(true)}
            className="w-full min-h-[64px] bg-blue-500 hover:bg-blue-600"
          >
            Chấp nhận
          </Button>
          <Button
            onClick={() => handleGrant(false)}
            variant="outline"
            className="w-full min-h-[64px] border-2"
          >
            Bỏ qua
          </Button>
        </div>

        <p className="text-center text-[14px] text-[#4a4a4a] mt-4">
          Bạn có thể thay đổi các quyền này bất cứ lúc nào trong Cài đặt
        </p>
      </div>
    </div>
  );
}
