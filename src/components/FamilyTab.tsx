import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, AlertTriangle, Users, Check, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { AnalyticsPage } from "./AnalyticsPage";
import { toast } from "sonner@2.0.3";

interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SpamAlert {
  id: string;
  memberName: string;
  type: 'spam_call' | 'scam_message';
  description: string;
  time: string;
}

const allFamilyMembers: FamilyMember[] = [
  { id: "1", name: "Mẹ", phone: "0912345678", relationship: "Mẹ" },
  { id: "2", name: "Bố", phone: "0923456789", relationship: "Bố" },
  { id: "3", name: "Con gái - Lan", phone: "0934567890", relationship: "Con gái" },
  { id: "4", name: "Con trai - Nam", phone: "0945678901", relationship: "Con trai" },
  { id: "5", name: "Anh Minh", phone: "0956789012", relationship: "Anh trai" },
  { id: "6", name: "Chị Hương", phone: "0967890123", relationship: "Em gái" },
  { id: "7", name: "Cháu Đức", phone: "0978901234", relationship: "Cháu trai" },
  { id: "8", name: "Cháu Mai", phone: "0989012345", relationship: "Cháu gái" },
];

const mockSpamAlerts: SpamAlert[] = [
  {
    id: "1",
    memberName: "Con gái - Lan",
    type: "scam_message",
    description: "Nhận được tin nhắn giả mạo ngân hàng yêu cầu cung cấp mã PIN",
    time: "2 giờ trước"
  },
  {
    id: "2",
    memberName: "Anh Minh",
    type: "spam_call",
    description: "Cuộc gọi từ số lạ tự xưng là nhân viên bảo hiểm",
    time: "Hôm qua"
  }
];

export function FamilyTab() {
  const [showSelection, setShowSelection] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set(["3", "4"])); // Con gái và con trai được chọn mặc định

  const handleMemberToggle = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSaveSelection = () => {
    setShowSelection(false);
    toast.success("Đã lưu lựa chọn thành công!", { duration: 2000 });
  };

  const selectedFamilyMembers = allFamilyMembers.filter(member => 
    selectedMembers.has(member.id)
  );

  const relevantAlerts = mockSpamAlerts.filter(alert => 
    selectedFamilyMembers.some(member => member.name === alert.memberName)
  );

  if (showAnalytics) {
    return <AnalyticsPage onBack={() => setShowAnalytics(false)} />;
  }

  if (showSelection) {
    return (
      <div className="h-full">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSelection(false)}
              className="min-h-[56px] min-w-[56px] p-0"
            >
              <ArrowLeft className="w-7 h-7" />
            </Button>
            <h2>Chọn người thân quan tâm</h2>
          </div>

          {/* Family members list */}
          <div className="space-y-3 mb-6">
            {allFamilyMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 border-2 border-gray-200 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={member.id}
                    checked={selectedMembers.has(member.id)}
                    onCheckedChange={() => handleMemberToggle(member.id)}
                    className="min-w-[32px] min-h-[32px]"
                  />
                  <label htmlFor={member.id} className="flex-1 cursor-pointer">
                    <h3>{member.name}</h3>
                    <p className="text-[#4a4a4a]">{member.relationship}</p>
                    <p className="text-[#4a4a4a]">{member.phone}</p>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Save button */}
          <Button
            onClick={handleSaveSelection}
            className="w-full min-h-[64px] bg-blue-500 hover:bg-blue-600"
          >
            <Check className="w-7 h-7 mr-2" />
            Lưu lựa chọn
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="p-4">
        <h2 className="mb-6">Người thân</h2>
        
        {/* Action buttons */}
        <div className="space-y-4 mb-6">
          <Button
            onClick={() => setShowSelection(true)}
            variant="outline"
            className="w-full min-h-[64px] border-2 border-blue-300 hover:bg-blue-50"
          >
            <Users className="w-7 h-7 mr-3" />
            Chọn người thân bạn quan tâm
          </Button>
          
          <Button
            onClick={() => setShowAnalytics(true)}
            variant="outline"
            className="w-full min-h-[64px] border-2 border-green-300 hover:bg-green-50"
          >
            <BarChart3 className="w-7 h-7 mr-3" />
            Biểu đồ phân tích
          </Button>
        </div>

        {/* Currently selected members */}
        <div className="mb-6">
          <h3 className="mb-4">Danh sách quan tâm ({selectedFamilyMembers.length})</h3>
          {selectedFamilyMembers.length > 0 ? (
            <div className="space-y-2">
              {selectedFamilyMembers.map((member) => (
                <div key={member.id} className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="min-w-[48px] min-h-[48px] bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p>{member.name}</p>
                      <p className="text-[#4a4a4a]">{member.relationship}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#4a4a4a]">Chưa chọn ai để quan tâm</p>
          )}
        </div>

        {/* Spam alerts */}
        <div>
          <h3 className="mb-4">Cảnh báo gần đây</h3>
          {relevantAlerts.length > 0 ? (
            <div className="space-y-4">
              {relevantAlerts.map((alert) => (
                <Alert key={alert.id} className="border-2 border-orange-300 bg-orange-50">
                  <AlertTriangle className="h-7 w-7 text-orange-700" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="text-orange-800">
                        <strong>{alert.memberName}</strong> - {alert.time}
                      </p>
                      <p className="text-orange-800">{alert.description}</p>
                      <p className="text-orange-700">
                        {alert.type === 'spam_call' ? '📞 Cuộc gọi lừa đảo' : '💬 Tin nhắn lừa đảo'}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#4a4a4a]">Không có cảnh báo nào gần đây</p>
              <p className="text-[#4a4a4a] mt-2">Đây là tin tốt! 😊</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}