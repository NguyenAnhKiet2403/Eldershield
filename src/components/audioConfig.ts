// Cấu hình các file audio cảnh báo
// Bạn import các file audio vào đây sau

// Import audio files (Uncomment và thay đổi path khi bạn có file)
// import safeAudio from "../assets/ma-an-toan.mp3";
// import unsafeAudio from "../assets/ma-lua-dao.mp3";
// import scamWarningAudio from "../assets/canh-bao-lua-dao.mp3";

export const AUDIO_FILES = {
  safe: "/path/to/ma-an-toan.mp3", // Thay bằng: safeAudio khi import
  unsafe: "/path/to/ma-lua-dao.mp3", // Thay bằng: unsafeAudio khi import
  scamWarning: "/path/to/canh-bao-lua-dao.mp3", // Thay bằng: scamWarningAudio khi import
};

// Hàm phát audio với fallback về TTS
export const playWarningAudio = (
  type: "safe" | "unsafe" | "scamWarning",
  fallbackText: string
): HTMLAudioElement | null => {
  const audioPath = AUDIO_FILES[type];
  
  // Tạo và phát audio
  const audio = new Audio(audioPath);
  audio.volume = 1.0;
  
  audio.play().catch((error) => {
    console.error("Lỗi phát audio:", error);
    
    // Fallback về Web Speech API nếu không phát được audio
    const utterance = new SpeechSynthesisUtterance(fallbackText);
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  });
  
  return audio;
};
