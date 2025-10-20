import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, BarChart3, TrendingUp, Phone, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface ScamData {
  day: string;
  calls: number;
  messages: number;
  total: number;
}

interface ScamTypeData {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

const selectedFamilyMembers: FamilyMember[] = [
  { id: "3", name: "Con gái - Lan", phone: "0934567890", relationship: "Con gái" },
  { id: "4", name: "Con trai - Nam", phone: "0945678901", relationship: "Con trai" },
];

const mockWeeklyData: { [key: string]: ScamData[] } = {
  "3": [
    { day: "T2", calls: 2, messages: 3, total: 5 },
    { day: "T3", calls: 1, messages: 2, total: 3 },
    { day: "T4", calls: 0, messages: 1, total: 1 },
    { day: "T5", calls: 3, messages: 4, total: 7 },
    { day: "T6", calls: 1, messages: 2, total: 3 },
    { day: "T7", calls: 0, messages: 1, total: 1 },
    { day: "CN", calls: 2, messages: 3, total: 5 },
  ],
  "4": [
    { day: "T2", calls: 1, messages: 1, total: 2 },
    { day: "T3", calls: 0, messages: 2, total: 2 },
    { day: "T4", calls: 2, messages: 1, total: 3 },
    { day: "T5", calls: 1, messages: 0, total: 1 },
    { day: "T6", calls: 0, messages: 3, total: 3 },
    { day: "T7", calls: 1, messages: 1, total: 2 },
    { day: "CN", calls: 0, messages: 2, total: 2 },
  ],
};

const mockScamTypes: { [key: string]: ScamTypeData[] } = {
  "3": [
    { type: "Giả mạo ngân hàng", count: 8, percentage: 40, color: "#ef4444" },
    { type: "Trúng thương", count: 6, percentage: 30, color: "#f97316" },
    { type: "Bán hàng giả", count: 4, percentage: 20, color: "#eab308" },
    { type: "Khác", count: 2, percentage: 10, color: "#6b7280" },
  ],
  "4": [
    { type: "Giả mạo ngân hàng", count: 5, percentage: 33, color: "#ef4444" },
    { type: "Đầu tư tài chính", count: 4, percentage: 27, color: "#8b5cf6" },
    { type: "Bán hàng giả", count: 3, percentage: 20, color: "#eab308" },
    { type: "Trúng thưởng", count: 2, percentage: 13, color: "#f97316" },
    { type: "Khác", count: 1, percentage: 7, color: "#6b7280" },
  ],
};

interface AnalyticsPageProps {
  onBack: () => void;
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const [selectedMember, setSelectedMember] = useState<string>(selectedFamilyMembers[0]?.id || "");

  const currentMember = selectedFamilyMembers.find(m => m.id === selectedMember);
  const weeklyData = mockWeeklyData[selectedMember] || [];
  const scamTypes = mockScamTypes[selectedMember] || [];
  
  const totalScams = weeklyData.reduce((sum, day) => sum + day.total, 0);
  const totalCalls = weeklyData.reduce((sum, day) => sum + day.calls, 0);
  const totalMessages = weeklyData.reduce((sum, day) => sum + day.messages, 0);

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
            <h2>Biểu đồ phân tích</h2>
            <p className="text-[#4a4a4a]">Thống kê lừa đảo 7 ngày qua</p>
          </div>
        </div>

        {/* Member selector */}
        <div className="mb-6">
          <label className="mb-3 block">Chọn người thân:</label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="min-h-[60px] border-2">
              <SelectValue placeholder="Chọn người thân" />
            </SelectTrigger>
            <SelectContent>
              {selectedFamilyMembers.map((member) => (
                <SelectItem key={member.id} value={member.id} className="py-3">
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentMember && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle>Tổng quan tuần này</CardTitle>
                  <CardDescription className="text-[#4a4a4a]">
                    Phân tích cho {currentMember.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="text-[24px] text-orange-700">{totalScams}</div>
                      <div className="text-orange-800">Tổng lừa đảo</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="text-[24px] text-amber-700">{totalCalls}</div>
                      <div className="text-amber-800 flex items-center justify-center gap-1">
                        <Phone className="w-5 h-5" />
                        Cuộc gọi
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="text-[24px] text-yellow-700">{totalMessages}</div>
                      <div className="text-yellow-800 flex items-center justify-center gap-1">
                        <MessageSquare className="w-5 h-5" />
                        Tin nhắn
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly trend chart */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-7 h-7" />
                  Xu hướng theo ngày
                </CardTitle>
                <CardDescription className="text-[#4a4a4a]">
                  Số lượng lừa đảo mỗi ngày trong tuần
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="day" 
                        fontSize={14}
                        tick={{ fontSize: 14 }}
                      />
                      <YAxis 
                        fontSize={14}
                        tick={{ fontSize: 14 }}
                      />
                      <Tooltip 
                        labelStyle={{ fontSize: '14px' }}
                        contentStyle={{ fontSize: '14px' }}
                        formatter={(value, name) => [
                          value,
                          name === 'calls' ? 'Cuộc gọi' : 
                          name === 'messages' ? 'Tin nhắn' : 'Tổng'
                        ]}
                      />
                      <Bar dataKey="calls" fill="#f97316" name="calls" />
                      <Bar dataKey="messages" fill="#eab308" name="messages" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Scam types pie chart */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-7 h-7" />
                  Phân loại lừa đảo
                </CardTitle>
                <CardDescription className="text-[#4a4a4a]">
                  Các loại lừa đảo phổ biến nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scamTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ percentage }) => `${percentage}%`}
                        labelStyle={{ fontSize: '12px' }}
                      >
                        {scamTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ fontSize: '14px' }}
                        formatter={(value, name, props) => [
                          `${value} lần (${props.payload.percentage}%)`,
                          props.payload.type
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="space-y-2">
                  {scamTypes.map((type) => (
                    <div key={type.type} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                        <span>{type.type}</span>
                      </div>
                      <div>
                        <span className="text-[#1a1a1a]">{type.count} lần</span>
                        <span className="text-[#4a4a4a] ml-2">({type.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">💡 Lời khuyên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-blue-900">
                    • Nhắc nhở {currentMember.name} không cung cấp thông tin cá nhân qua điện thoại
                  </p>
                  <p className="text-blue-900">
                    • Luôn xác minh với ngân hàng qua số hotline chính thức
                  </p>
                  <p className="text-blue-900">
                    • Không tin vào các thông báo trúng thưởng bất ngờ
                  </p>
                  <p className="text-blue-900">
                    • Báo cáo ngay cho gia đình khi nhận được cuộc gọi đáng ngờ
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}