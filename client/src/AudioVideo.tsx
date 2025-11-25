import { useState, useEffect } from "react";
import { AudioVideoBox } from "@/components/AudioVideoBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { Mic, MicOff, Users, Volume2 } from "lucide-react";

interface ActiveUser {
  id: string;
  name: string;
  isSpeaking: boolean;
}

export default function AudioVideo() {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([
    { id: "1", name: "أحمد", isSpeaking: false },
    { id: "2", name: "فاطمة", isSpeaking: true },
    { id: "3", name: "محمد", isSpeaking: false },
  ]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [connectedCount, setConnectedCount] = useState(3);

  useEffect(() => {
    // Simulate user speaking status changes
    const interval = setInterval(() => {
      setActiveUsers((prev) =>
        prev.map((u) => ({
          ...u,
          isSpeaking: Math.random() > 0.7,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleMicToggle = (enabled: boolean) => {
    setMicEnabled(enabled);
  };

  const handleVideoToggle = (enabled: boolean) => {
    setVideoEnabled(enabled);
  };

  const handleHangup = () => {
    // Handle hangup logic
    console.log("Hanging up...");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">غرفة الصوت والفيديو</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg">
            <Users className="w-5 h-5" />
            <span>{connectedCount} متصلون</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg">
            <Volume2 className="w-5 h-5" />
            <span>الصوت مفعل</span>
          </div>
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Local User */}
        <AudioVideoBox
          userId={user?.id.toString() || "local"}
          userName={user?.name || "أنت"}
          isLocal={true}
          onMicToggle={handleMicToggle}
          onVideoToggle={handleVideoToggle}
          onHangup={handleHangup}
        />

        {/* Remote Users */}
        {activeUsers.map((remoteUser) => (
          <AudioVideoBox
            key={remoteUser.id}
            userId={remoteUser.id}
            userName={remoteUser.name}
            isLocal={false}
            isSpeaking={remoteUser.isSpeaking}
          />
        ))}
      </div>

      {/* Control Panel */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4">التحكم</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant={micEnabled ? "default" : "destructive"}
            className="flex items-center gap-2"
            onClick={() => handleMicToggle(!micEnabled)}
          >
            {micEnabled ? (
              <>
                <Mic className="w-5 h-5" />
                <span>مايك مفعل</span>
              </>
            ) : (
              <>
                <MicOff className="w-5 h-5" />
                <span>مايك معطل</span>
              </>
            )}
          </Button>

          <Button
            variant={videoEnabled ? "default" : "secondary"}
            className="flex items-center gap-2"
          >
            {videoEnabled ? "فيديو مفعل" : "فيديو معطل"}
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            مشاركة الشاشة
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleHangup}
          >
            إنهاء المكالمة
          </Button>
        </div>
      </Card>

      {/* Active Speakers List */}
      <Card className="bg-gray-800 border-gray-700 p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">المتحدثون النشطون</h2>
        <div className="space-y-2">
          {activeUsers
            .filter((u) => u.isSpeaking)
            .map((speaker) => (
              <div
                key={speaker.id}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">{speaker.name}</span>
                <span className="text-sm text-gray-400 ml-auto">يتحدث الآن</span>
              </div>
            ))}
          {activeUsers.filter((u) => u.isSpeaking).length === 0 && (
            <p className="text-gray-400 text-center py-4">لا أحد يتحدث حالياً</p>
          )}
        </div>
      </Card>
    </div>
  );
}
