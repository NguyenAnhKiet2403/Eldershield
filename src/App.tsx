import { useState, useEffect } from "react";
import { Phone, MessageCircle, Users, Heart, Settings } from "lucide-react";
import { Button } from "./components/ui/button";
import { PhoneKeypad } from "./components/PhoneKeypad";
import { MessagesTab } from "./components/MessagesTab";
import { ContactsTab } from "./components/ContactsTab";
import { FamilyTab } from "./components/FamilyTab";
import { SettingsDialog } from "./components/SettingsDialog";
import { Toaster } from "./components/ui/sonner";
import { PermissionRequest, hasRequestedPermissions } from "./components/PermissionRequest";

type TabType = "phone" | "messages" | "contacts" | "family";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("phone");
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  useEffect(() => {
    // Check if user has already gone through permission request
    if (!hasRequestedPermissions()) {
      setShowPermissionRequest(true);
    }
  }, []);

  const tabs = [
    { id: "phone" as TabType, label: "Điện thoại", icon: Phone },
    { id: "messages" as TabType, label: "Tin nhắn", icon: MessageCircle },
    { id: "contacts" as TabType, label: "Danh bạ", icon: Users },
    { id: "family" as TabType, label: "Người thân", icon: Heart },
  ];

  const renderContent = () => {
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-md h-screen md:h-[844px] flex flex-col bg-white md:rounded-3xl md:shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-blue-600">ElderShield</h1>
              <p className="text-[#4a4a4a]">Bảo vệ người thân</p>
            </div>
            
            <SettingsDialog>
              <Button variant="outline" size="sm" className="h-14 w-14 p-0">
                <Settings className="w-7 h-7" />
              </Button>
            </SettingsDialog>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto bg-white">
            {renderContent()}
          </div>

          {/* Bottom navigation */}
          <div className="bg-white border-t-2 border-gray-200 p-2">
            <div className="flex justify-around gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`flex-1 min-h-[64px] flex flex-col items-center justify-center gap-1 rounded-2xl ${
                      isActive 
                        ? "bg-blue-500 text-white hover:bg-blue-600" 
                        : "text-[#1a1a1a] hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-7 h-7" />
                    <span>{tab.label}</span>
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