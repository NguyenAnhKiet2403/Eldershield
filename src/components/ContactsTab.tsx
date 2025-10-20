import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Phone, Search, User } from "lucide-react";
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

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

const mockContacts: Contact[] = [
  { id: "1", name: "Mẹ", phone: "0912345678" },
  { id: "2", name: "Bố", phone: "0923456789" },
  { id: "3", name: "Con gái", phone: "0934567890" },
  { id: "4", name: "Con trai", phone: "0945678901" },
  { id: "5", name: "Bác sĩ Hùng", phone: "0956789012" },
  { id: "6", name: "Anh Nam hàng xóm", phone: "0967890123" },
  { id: "7", name: "Chị Lan", phone: "0978901234" },
  { id: "8", name: "Cô Phương", phone: "0989012345" },
].sort((a, b) => a.name.localeCompare(b.name, 'vi'));

export function ContactsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmCallDialog, setConfirmCallDialog] = useState<{phone: string, name: string} | null>(null);

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleCallRequest = (phone: string, name: string) => {
    setConfirmCallDialog({ phone, name });
  };

  const handleConfirmCall = () => {
    if (confirmCallDialog) {
      toast.success(`Đang gọi ${confirmCallDialog.name}...`, {
        duration: 3000,
      });
      setConfirmCallDialog(null);
    }
  };

  return (
    <>
      <div className="h-full">
        <div className="p-4">
          <h2 className="mb-6">Danh bạ</h2>
          
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-7 h-7 text-[#4a4a4a]" />
            <Input
              type="text"
              placeholder="Tìm kiếm tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 min-h-[60px] border-2 rounded-2xl"
            />
          </div>

          {/* Contacts list */}
          <div className="space-y-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="min-w-[60px] min-h-[60px] bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  {/* Contact info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1">{contact.name}</h3>
                    <p className="text-[#4a4a4a]">{contact.phone}</p>
                  </div>
                  
                  {/* Call button */}
                  <Button
                    className="min-h-[56px] min-w-[56px] p-0 bg-green-500 hover:bg-green-600 rounded-full flex-shrink-0"
                    onClick={() => handleCallRequest(contact.phone, contact.name)}
                  >
                    <Phone className="w-7 h-7" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#4a4a4a]">Không tìm thấy liên hệ nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={!!confirmCallDialog} onOpenChange={(open) => !open && setConfirmCallDialog(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận gọi điện</AlertDialogTitle>
            <AlertDialogDescription className="text-[#1a1a1a]">
              Bạn có chắc chắn muốn gọi cho <strong>{confirmCallDialog?.name}</strong> không?
              <br />
              <span className="text-[20px]">{confirmCallDialog?.phone}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-[56px]">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              className="min-h-[56px] bg-green-500 hover:bg-green-600"
              onClick={handleConfirmCall}
            >
              Đồng ý gọi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}