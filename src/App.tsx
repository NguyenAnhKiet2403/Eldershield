import { useState, useEffect } from "react";
import { Phone, MessageCircle, Users, Heart, Settings, ScanLine, Maximize, Minimize } from "lucide-react";
import { Button } from "./components/ui/button";
import { PhoneKeypad } from "./components/PhoneKeypad";
import { MessagesTab } from "./components/MessagesTab";
import { ContactsTab } from "./components/ContactsTab";
import { FamilyTab } from "./components/FamilyTab";
import { SettingsDialog } from "./components/SettingsDialog";
import { Toaster } from "./components/ui/sonner";
import { PermissionRequest, hasRequestedPermissions } from "./components/PermissionRequest";
import { QRScanner } from "./components/QRScanner";
import { Switch } from "./components/ui/switch";

type TabType = "phone" | "messages" | "contacts" | "family";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("phone");
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Check if user has already gone through permission request
    if (!hasRequestedPermissions()) {
      setShowPermissionRequest(true);
    }
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        // Enter fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).mozRequestFullScreen) {
          await (elem as any).mozRequestFullScreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Listen to fullscreen changes (when user exits with ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const tabs = [
    { id: "phone" as TabType, label: "Điện thoại", icon: Phone },
    { id: "messages" as TabType, label: "Tin nhắn", icon: MessageCircle },
    { id: "contacts" as TabType, label: "Danh bạ", icon: Users },
    { id: "family" as TabType, label: "Người thân", icon: Heart },
  ];

  const renderContent = () => {
    if (showQRScanner) {
      return <QRScanner onClose={() => setShowQRScanner(false)} />;
    }

    switch (activeTab) {
      case "phone":
        return <PhoneKeypad />;
      case "messages":
        return <MessagesTab />;
      case "contacts":
        return <ContactsTab />;
      case "family":
        return <FamilyTab />;
      default:
        return <PhoneKeypad />;
    }
  };

  return (
    <>
      <div className="min-h-dvh bg-gray-100 flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-md h-dvh md:h-[844px] flex flex-col bg-white md:rounded-3xl md:shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b-2 border-gray-200 p-3.5 md:p-4 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-blue-600">ElderShield</h1>
              <p className="text-[#4a4a4a]">Bảo vệ người thân</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Fullscreen toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-blue-600" />
                ) : (
                  <Maximize className="w-5 h-5 text-gray-500" />
                )}
                <Switch
                  checked={isFullscreen}
                  onCheckedChange={toggleFullscreen}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <SettingsDialog>
                <Button variant="outline" size="sm" className="h-14 w-14 p-0">
                  <Settings className="w-7 h-7" />
                </Button>
              </SettingsDialog>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto bg-white">
            {renderContent()}
          </div>

          {/* Bottom navigation */}
          <div className="bg-white border-t-2 border-gray-200 p-1.5 md:p-2 relative shrink-0">
            <div className="flex justify-around gap-1 md:gap-1.5 items-end">
              {/* First two tabs */}
              {tabs.slice(0, 2).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id && !showQRScanner;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`flex-1 min-h-[52px] md:min-h-[60px] flex flex-col items-center justify-center gap-0.5 rounded-xl md:rounded-2xl ${
                      isActive 
                        ? "bg-blue-500 text-white hover:bg-blue-600" 
                        : "text-[#1a1a1a] hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setShowQRScanner(false);
                      setActiveTab(tab.id);
                    }}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-[11px] md:text-sm leading-tight">{tab.label}</span>
                  </Button>
                );
              })}

              {/* QR Scanner button - elevated */}
              <div className="flex-1 flex justify-center">
                <Button
                  className={`w-13 h-13 md:w-15 md:h-15 rounded-full shadow-lg -mb-5 md:-mb-6 flex items-center justify-center p-0 ${
                    showQRScanner
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  }`}
                  onClick={() => setShowQRScanner(true)}
                >
                  <ScanLine className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </Button>
              </div>

              {/* Last two tabs */}
              {tabs.slice(2).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id && !showQRScanner;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`flex-1 min-h-[52px] md:min-h-[60px] flex flex-col items-center justify-center gap-0.5 rounded-xl md:rounded-2xl ${
                      isActive 
                        ? "bg-blue-500 text-white hover:bg-blue-600" 
                        : "text-[#1a1a1a] hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setShowQRScanner(false);
                      setActiveTab(tab.id);
                    }}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-[11px] md:text-sm leading-tight">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Permission request overlay */}
      {showPermissionRequest && (
        <PermissionRequest onComplete={() => setShowPermissionRequest(false)} />
      )}

      <Toaster position="top-center" expand={true} richColors />
    </>
  );
}