import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Phone, AlertTriangle, Clock, Play, Pause, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
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
import { toast } from "sonner@2.0.3";

export interface SavedCallData {
  id: string;
  phoneNumber: string;
  timestamp: number;
  duration: number;
  isScam: boolean;
  transcript: string[];
  hasScamKeywords: boolean;
}

interface CallDataViewProps {
  onBack: () => void;
}

export function CallDataView({ onBack }: CallDataViewProps) {
  const [savedCalls, setSavedCalls] = useState<SavedCallData[]>([]);
  const [selectedCall, setSelectedCall] = useState<SavedCallData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [callToDelete, setCallToDelete] = useState<string | null>(null);

  // Load saved calls from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("elderShield_savedCalls");
    if (stored) {
      try {
        const calls = JSON.parse(stored);
        setSavedCalls(calls);
      } catch (e) {
        console.error("Error loading saved calls:", e);
      }
    }
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play call recording (read transcript with TTS)
  const handlePlayCall = (call: SavedCallData) => {
    setSelectedCall(call);
    setCurrentLine(0);
    setIsPlaying(false);
  };

  // Play/pause TTS
  const togglePlayback = () => {
    if (!selectedCall) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      playTranscript();
    }
  };

  // Play transcript line by line
  const playTranscript = () => {
    if (!selectedCall || currentLine >= selectedCall.transcript.length) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(selectedCall.transcript[currentLine]);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;

    utterance.onend = () => {
      const nextLine = currentLine + 1;
      if (nextLine < selectedCall.transcript.length) {
        setCurrentLine(nextLine);
        setTimeout(() => {
          const nextUtterance = new SpeechSynthesisUtterance(selectedCall.transcript[nextLine]);
          nextUtterance.lang = 'vi-VN';
          nextUtterance.rate = 0.9;
          nextUtterance.onend = () => {
            if (nextLine + 1 >= selectedCall.transcript.length) {
              setIsPlaying(false);
              setCurrentLine(0);
            }
          };
          window.speechSynthesis.speak(nextUtterance);
        }, 500);
      } else {
        setIsPlaying(false);
        setCurrentLine(0);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Delete call
  const handleDeleteRequest = (callId: string) => {
    setCallToDelete(callId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (callToDelete) {
      const updatedCalls = savedCalls.filter(call => call.id !== callToDelete);
      setSavedCalls(updatedCalls);
      localStorage.setItem("elderShield_savedCalls", JSON.stringify(updatedCalls));
      
      if (selectedCall?.id === callToDelete) {
        setSelectedCall(null);
      }
      
      toast.success("Đã xóa dữ liệu cuộc gọi", { duration: 2000 });
    }
    setShowDeleteDialog(false);
    setCallToDelete(null);
  };

  // Clean up TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Detail view
  if (selectedCall) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.speechSynthesis.cancel();
                setSelectedCall(null);
                setIsPlaying(false);
                setCurrentLine(0);
              }}
              className="min-h-[56px] min-w-[56px] p-0"
            >
              <ArrowLeft className="w-7 h-7" />
            </Button>
            <div className="flex-1">
              <h2>Chi tiết cuộc gọi</h2>
              <p className="text-[#4a4a4a]">{selectedCall.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Call info card */}
          <div className={`p-4 border-2 rounded-2xl ${
            selectedCall.hasScamKeywords 
              ? 'border-red-300 bg-red-50' 
              : 'border-blue-200 bg-blue-50'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                selectedCall.hasScamKeywords ? 'bg-red-200' : 'bg-blue-200'
              }`}>
                {selectedCall.hasScamKeywords ? (
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                ) : (
                  <Phone className="w-7 h-7 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h3>{selectedCall.phoneNumber}</h3>
                <p className="text-[#4a4a4a]">
                  {formatTimestamp(selectedCall.timestamp)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-[#4a4a4a]">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{formatDuration(selectedCall.duration)}</span>
              </div>
              {selectedCall.hasScamKeywords && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Phát hiện lừa đảo</span>
                </div>
              )}
            </div>
          </div>

          {/* Playback controls */}
          {selectedCall.transcript.length > 0 && (
            <div className="p-4 border-2 border-green-200 bg-green-50 rounded-2xl">
              <h3 className="mb-3">Phát lại nội dung</h3>
              <Button
                onClick={togglePlayback}
                className="w-full min-h-[64px] bg-green-500 hover:bg-green-600"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-7 h-7 mr-3" />
                    Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="w-7 h-7 mr-3" />
                    Phát nội dung
                  </>
                )}
              </Button>
              {isPlaying && (
                <p className="text-center text-[#4a4a4a] mt-3">
                  Đang phát dòng {currentLine + 1}/{selectedCall.transcript.length}
                </p>
              )}
            </div>
          )}

          {/* Transcript */}
          <div className="space-y-2">
            <h3>Nội dung cuộc gọi</h3>
            {selectedCall.transcript.length > 0 ? (
              <div className="space-y-2">
                {selectedCall.transcript.map((text, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl border-2 ${
                      index === currentLine && isPlaying
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="text-[#4a4a4a] min-w-[30px]">
                        {index + 1}.
                      </div>
                      <p className="text-[#1a1a1a] flex-1">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#4a4a4a] text-center py-8">
                Không có nội dung văn bản
              </p>
            )}
          </div>

          {/* Delete button */}
          <Button
            variant="outline"
            className="w-full min-h-[64px] border-2 border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleDeleteRequest(selectedCall.id)}
          >
            <Trash2 className="w-7 h-7 mr-3" />
            Xóa dữ liệu cuộc gọi này
          </Button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="min-h-[56px] min-w-[56px] p-0"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h2>Dữ liệu cuộc gọi</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {savedCalls.length > 0 ? (
          <>
            <Alert className="mb-4 border-2 border-blue-300 bg-blue-50">
              <AlertDescription>
                <p className="text-blue-900">
                  Có <strong>{savedCalls.length}</strong> cuộc gọi đã lưu. Bấm vào để xem chi tiết và nghe lại.
                </p>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {savedCalls.map((call) => (
                <div
                  key={call.id}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-colors ${
                    call.hasScamKeywords
                      ? 'border-red-200 bg-red-50 hover:bg-red-100'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => handlePlayCall(call)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`min-w-[56px] min-h-[56px] rounded-full flex items-center justify-center ${
                      call.hasScamKeywords ? 'bg-red-200' : 'bg-blue-100'
                    }`}>
                      {call.hasScamKeywords ? (
                        <AlertTriangle className="w-7 h-7 text-red-600" />
                      ) : (
                        <Phone className="w-7 h-7 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={call.hasScamKeywords ? 'text-red-800' : ''}>
                        {call.phoneNumber}
                      </h3>
                      <p className="text-[#4a4a4a]">
                        {formatTimestamp(call.timestamp)} • {formatDuration(call.duration)}
                      </p>
                      {call.hasScamKeywords && (
                        <p className="text-red-600 mt-1">
                          ⚠️ Phát hiện dấu hiệu lừa đảo
                        </p>
                      )}
                    </div>

                    <Play className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="mb-2">Chưa có dữ liệu</h3>
            <p className="text-[#4a4a4a]">
              Các cuộc gọi được lưu sẽ hiển thị ở đây
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa dữ liệu cuộc gọi</AlertDialogTitle>
            <AlertDialogDescription className="text-[#1a1a1a]">
              Bạn có chắc chắn muốn xóa dữ liệu cuộc gọi này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-[56px]">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              className="min-h-[56px] bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
