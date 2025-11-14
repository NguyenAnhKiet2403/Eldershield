import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Phone, PhoneOff, X, Mic, Volume2 } from "lucide-react";
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
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";
import type { SavedCallData } from "./CallDataView";
import { playWarningAudio } from "./audioConfig";

type CallState = 
  | "menu" 
  | "incoming-blacklist" 
  | "incoming-normal" 
  | "in-call-blacklist"
  | "in-call-normal"
  | "in-call-recording";

interface CallDemoProps {
  onClose: () => void;
}

export function CallDemo({ onClose }: CallDemoProps) {
  const [callState, setCallState] = useState<CallState>("menu");
  const [showScamAlert, setShowScamAlert] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [showRecordingPermission, setShowRecordingPermission] = useState(false);
  const [showSaveDataPrompt, setShowSaveDataPrompt] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Play warning audio from imported file
  const speakWarning = (text: string) => {
    // Sử dụng audio file import thay vì TTS
    playWarningAudio("scamWarning", text);
  };

  // Start call timer
  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Stop call timer
  const stopCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallDuration(0);
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle blacklist incoming call
  const handleBlacklistIncoming = () => {
    setCallState("incoming-blacklist");
    speakWarning("Cảnh báo! Cuộc gọi lừa đảo!");
  };

  // Handle normal incoming call
  const handleNormalIncoming = () => {
    setCallState("incoming-normal");
  };

  // Accept blacklist call
  const handleAcceptBlacklistCall = () => {
    setCallState("in-call-blacklist");
    setShowFeedbackPrompt(true);
    startCallTimer();
  };

  // Accept normal call
  const handleAcceptNormalCall = () => {
    setShowRecordingPermission(true);
  };

  // Handle recording permission response
  const handleRecordingPermission = (allowed: boolean) => {
    setShowRecordingPermission(false);
    if (allowed) {
      setCallState("in-call-recording");
      startCallTimer();
      startRecording();
    } else {
      setCallState("in-call-normal");
      startCallTimer();
    }
  };

  // Start speech recognition
  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'vi-VN';

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
          setTranscript(prev => [...prev, transcriptText]);
          
          // Check for scam keywords
          const scamKeywords = ['trúng thưởng', 'lừa đảo', 'đường dây', 'chuyển tiền', 'tài khoản ngân hàng'];
          const hasScamKeyword = scamKeywords.some(keyword => 
            transcriptText.toLowerCase().includes(keyword)
          );
          
          if (hasScamKeyword && !showScamAlert) {
            setShowScamAlert(true);
            speakWarning("Cảnh báo! Phát hiện dấu hiệu lừa đảo!");
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error("Không có quyền truy cập microphone", { duration: 3000 });
        }
      };

      recognitionRef.current.start();
    } else {
      toast.error("Trình duyệt không hỗ trợ nhận dạng giọng nói", { duration: 3000 });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // End call
  const handleEndCall = () => {
    stopCallTimer();
    stopRecording();
    
    if (callState === "in-call-recording") {
      setShowSaveDataPrompt(true);
    } else {
      resetToMenu();
    }
  };

  // Handle save data response
  const handleSaveData = (save: boolean) => {
    setShowSaveDataPrompt(false);
    
    if (save) {
      // Save call data to localStorage
      const callData: SavedCallData = {
        id: Date.now().toString(),
        phoneNumber: "+84 987 654 321",
        timestamp: Date.now(),
        duration: callDuration,
        isScam: showScamAlert,
        transcript: transcript,
        hasScamKeywords: showScamAlert
      };

      // Get existing calls
      const existingCalls = localStorage.getItem("elderShield_savedCalls");
      const calls = existingCalls ? JSON.parse(existingCalls) : [];
      
      // Add new call at the beginning
      calls.unshift(callData);
      
      // Limit to 20 most recent calls
      const limitedCalls = calls.slice(0, 20);
      
      // Save to localStorage
      localStorage.setItem("elderShield_savedCalls", JSON.stringify(limitedCalls));
      
      toast.success("Dữ liệu đã được lưu, bạn có thể nghe lại trong mục dữ liệu cuộc gọi ở cài đặt", {
        duration: 4000,
      });
    } else {
      toast.success("Đã xóa toàn bộ dữ liệu cuộc gọi, bạn hoàn toàn yên tâm", {
        duration: 4000,
      });
    }
    
    resetToMenu();
  };

  // Reset to menu
  const resetToMenu = () => {
    setCallState("menu");
    setShowScamAlert(false);
    setShowFeedbackPrompt(false);
    setTranscript([]);
  };

  // Reject call
  const handleRejectCall = () => {
    resetToMenu();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCallTimer();
      stopRecording();
      window.speechSynthesis.cancel();
    };
  }, []);

  // Main menu
  if (callState === "menu") {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between">
          <h2>Demo cuộc gọi</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="min-h-[56px] min-w-[56px] p-0"
          >
            <X className="w-7 h-7" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center p-6 gap-6">
          <div className="text-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Phone className="w-14 h-14 text-white" />
            </div>
            <p className="text-[#4a4a4a]">Chọn loại cuộc gọi để demo</p>
          </div>

          <Button
            onClick={handleBlacklistIncoming}
            className="w-full max-w-md min-h-[80px] bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg"
          >
            <div className="text-left">
              <div className="leading-tight">Cuộc gọi trong blacklist</div>
              <div className="text-sm opacity-90 leading-tight">Có cảnh báo lừa đảo tự động</div>
            </div>
          </Button>

          <Button
            onClick={handleNormalIncoming}
            className="w-full max-w-md min-h-[80px] bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg"
          >
            <div className="text-left">
              <div className="leading-tight">Cuộc gọi tới bình thường</div>
              <div className="text-sm opacity-90 leading-tight">Có tính năng ghi âm và phân tích</div>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  // Incoming call - Blacklist
  if (callState === "incoming-blacklist") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-500 to-orange-600 z-50 flex flex-col text-white">
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          {/* Warning Banner */}
          <div className="mb-8 p-6 bg-red-900 bg-opacity-50 border-2 border-white rounded-3xl animate-pulse">
            <div className="flex items-center gap-4 mb-3">
              <Volume2 className="w-12 h-12 text-white" />
              <h2 className="text-white">⚠️ CẢNH BÁO LỪA ĐẢO</h2>
            </div>
            <p className="text-white text-center">
              Số này đã được xác nhận là lừa đảo!
            </p>
          </div>

          {/* Caller info */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-white mb-2">+84 912 345 678</h2>
            <p className="text-white opacity-90">Cuộc gọi đến...</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-6 mt-8">
            <Button
              onClick={handleRejectCall}
              className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-xl"
            >
              <PhoneOff className="w-10 h-10 text-white" />
            </Button>
            
            <Button
              onClick={handleAcceptBlacklistCall}
              className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 shadow-xl"
            >
              <Phone className="w-10 h-10 text-white" />
            </Button>
          </div>

          <p className="mt-8 text-white opacity-75 text-center">
            Không khuyến nghị nhận cuộc gọi này
          </p>
        </div>
      </div>
    );
  }

  // Incoming call - Normal
  if (callState === "incoming-normal") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 z-50 flex flex-col text-white">
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          {/* Caller info */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-white mb-2">+84 987 654 321</h2>
            <p className="text-white opacity-90">Cuộc gọi đến...</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-6 mt-8">
            <Button
              onClick={handleRejectCall}
              className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-xl"
            >
              <PhoneOff className="w-10 h-10 text-white" />
            </Button>
            
            <Button
              onClick={handleAcceptNormalCall}
              className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 shadow-xl"
            >
              <Phone className="w-10 h-10 text-white" />
            </Button>
          </div>
        </div>

        {/* Recording permission dialog */}
        <AlertDialog open={showRecordingPermission} onOpenChange={setShowRecordingPermission}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-3">
                <Mic className="w-8 h-8 text-blue-600" />
                Quyền truy cập ghi âm
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#1a1a1a]">
                Cho phép ElderShield ghi âm và phân tích nội dung cuộc trò chuyện để phát hiện dấu hiệu lừa đảo?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel 
                className="min-h-[56px]"
                onClick={() => handleRecordingPermission(false)}
              >
                Không
              </AlertDialogCancel>
              <AlertDialogAction 
                className="min-h-[56px] bg-blue-500 hover:bg-blue-600"
                onClick={() => handleRecordingPermission(true)}
              >
                Cho phép
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // In call - Blacklist
  if (callState === "in-call-blacklist") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-50 flex flex-col text-white">
        {/* Feedback prompt at top */}
        {showFeedbackPrompt && (
          <Alert className="m-4 border-2 border-yellow-400 bg-yellow-50">
            <AlertDescription>
              <p className="text-yellow-900 mb-3">
                <strong>Đây có phải là cuộc gọi lừa đảo không?</strong>
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="min-h-[48px] flex-1 bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    setShowFeedbackPrompt(false);
                    toast.success("Cảm ơn phản hồi của bạn!", { duration: 2000 });
                  }}
                >
                  Có
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-[48px] flex-1 border-2"
                  onClick={() => {
                    setShowFeedbackPrompt(false);
                    toast.success("Cảm ơn phản hồi của bạn!", { duration: 2000 });
                  }}
                >
                  Không
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 flex flex-col justify-center items-center p-6">
          {/* Caller info */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-white mb-2">+84 912 345 678</h2>
            <p className="text-white opacity-90">{formatDuration(callDuration)}</p>
          </div>

          {/* Warning badge */}
          <div className="mb-8 px-6 py-3 bg-red-600 rounded-full">
            <p className="text-white">⚠️ Cảnh báo lừa đảo</p>
          </div>

          {/* End call button */}
          <Button
            onClick={handleEndCall}
            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-xl"
          >
            <PhoneOff className="w-10 h-10 text-white" />
          </Button>
        </div>
      </div>
    );
  }

  // In call - Normal (no recording)
  if (callState === "in-call-normal") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-50 flex flex-col text-white">
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          {/* Caller info */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-white mb-2">+84 987 654 321</h2>
            <p className="text-white opacity-90">{formatDuration(callDuration)}</p>
          </div>

          {/* End call button */}
          <Button
            onClick={handleEndCall}
            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-xl"
          >
            <PhoneOff className="w-10 h-10 text-white" />
          </Button>
        </div>
      </div>
    );
  }

  // In call - Recording
  if (callState === "in-call-recording") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-50 flex flex-col text-white">
        {/* Scam alert at top */}
        {showScamAlert && (
          <Alert className="m-4 border-2 border-red-400 bg-red-50 animate-pulse">
            <AlertDescription>
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-red-900 flex-1">
                  <strong>⚠️ CẢNH BÁO: Phát hiện dấu hiệu lừa đảo!</strong>
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-[40px] min-w-[40px] p-0"
                  onClick={() => {
                    setShowScamAlert(false);
                    setShowFeedbackPrompt(true);
                  }}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Feedback prompt */}
        {showFeedbackPrompt && !showScamAlert && (
          <Alert className="m-4 border-2 border-yellow-400 bg-yellow-50">
            <AlertDescription>
              <p className="text-yellow-900 mb-3">
                <strong>Đây có phải là cuộc gọi lừa đảo không?</strong>
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="min-h-[48px] flex-1 bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    setShowFeedbackPrompt(false);
                    toast.success("Cảm ơn phản hồi của bạn!", { duration: 2000 });
                  }}
                >
                  Có
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-[48px] flex-1 border-2"
                  onClick={() => {
                    setShowFeedbackPrompt(false);
                    toast.success("Cảm ơn phản hồi của bạn!", { duration: 2000 });
                  }}
                >
                  Không
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 flex flex-col p-6">
          {/* Caller info */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-white mb-2">+84 987 654 321</h2>
            <p className="text-white opacity-90">{formatDuration(callDuration)}</p>
          </div>

          {/* Recording indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-white opacity-75">Đang ghi âm và phân tích...</p>
          </div>

          {/* Transcript display */}
          <div className="flex-1 bg-black bg-opacity-30 rounded-2xl p-4 mb-6 overflow-y-auto max-h-[300px]">
            {transcript.length > 0 ? (
              <div className="p-3 bg-gray-700 bg-opacity-80 rounded-xl border border-gray-600">
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {transcript.join(' ')}
                </p>
              </div>
            ) : (
              <p className="text-white opacity-50 text-center">
                Bắt đầu nói để xem văn bản...
              </p>
            )}
          </div>

          {/* End call button */}
          <div className="flex justify-center">
            <Button
              onClick={handleEndCall}
              className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-xl"
            >
              <PhoneOff className="w-10 h-10 text-white" />
            </Button>
          </div>
        </div>

        {/* Save data prompt */}
        <AlertDialog open={showSaveDataPrompt} onOpenChange={setShowSaveDataPrompt}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Lưu dữ liệu cuộc gọi</AlertDialogTitle>
              <AlertDialogDescription className="text-[#1a1a1a]">
                Bạn có muốn lưu lại dữ liệu cuộc gọi này không?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel 
                className="min-h-[56px]"
                onClick={() => handleSaveData(false)}
              >
                Không
              </AlertDialogCancel>
              <AlertDialogAction 
                className="min-h-[56px] bg-blue-500 hover:bg-blue-600"
                onClick={() => handleSaveData(true)}
              >
                Có
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return null;
}
