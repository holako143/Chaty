import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioVideoBoxProps {
  userId: string;
  userName: string;
  isLocal?: boolean;
  isSpeaking?: boolean;
  onMicToggle?: (enabled: boolean) => void;
  onVideoToggle?: (enabled: boolean) => void;
  onHangup?: () => void;
}

export function AudioVideoBox({
  userId,
  userName,
  isLocal = false,
  isSpeaking = false,
  onMicToggle,
  onVideoToggle,
  onHangup,
}: AudioVideoBoxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    if (isLocal && videoRef.current) {
      // Get local stream
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: videoEnabled })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Failed to get media:", error);
        });
    }
  }, [isLocal, videoEnabled]);

  const handleMicToggle = () => {
    const newState = !micEnabled;
    setMicEnabled(newState);
    onMicToggle?.(newState);
  };

  const handleVideoToggle = () => {
    const newState = !videoEnabled;
    setVideoEnabled(newState);
    onVideoToggle?.(newState);
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Speaking Indicator */}
      {isSpeaking && !isLocal && (
        <div className="absolute inset-0 border-4 border-green-500 animate-pulse pointer-events-none" />
      )}

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <p className="text-white font-semibold">{userName}</p>
        <p className="text-gray-300 text-sm">{isLocal ? "أنت" : "متصل"}</p>
      </div>

      {/* Controls */}
      {isLocal && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant={micEnabled ? "default" : "destructive"}
            onClick={handleMicToggle}
            className="rounded-full w-10 h-10 p-0"
          >
            {micEnabled ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant={videoEnabled ? "default" : "secondary"}
            onClick={handleVideoToggle}
            className="rounded-full w-10 h-10 p-0"
          >
            {videoEnabled ? (
              <Video className="w-4 h-4" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={onHangup}
            className="rounded-full w-10 h-10 p-0"
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Mic Status Indicator */}
      <div className="absolute top-4 left-4">
        {micEnabled ? (
          <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
            <Mic className="w-4 h-4" />
            <span>مايك مفعل</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            <MicOff className="w-4 h-4" />
            <span>مايك معطل</span>
          </div>
        )}
      </div>
    </div>
  );
}
