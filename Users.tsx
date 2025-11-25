import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Gift, MessageCircle } from "lucide-react";

export default function Users() {
  const { user, isAuthenticated } = useAuth();
  const [selectedGift, setSelectedGift] = useState("🎁");
  const [giftName, setGiftName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Fetch rooms to get users
  const { data: rooms = [] } = trpc.rooms.list.useQuery();

  // Send gift mutation
  const sendGiftMutation = trpc.gifts.send.useMutation({
    onSuccess: () => {
      setGiftName("");
      setSelectedUserId(null);
      setSelectedGift("🎁");
    },
  });

  // Get received gifts
  const { data: receivedGifts = [] } = trpc.gifts.getReceived.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleSendGift = () => {
    if (!selectedUserId || !giftName.trim()) return;

    sendGiftMutation.mutate({
      recipientId: selectedUserId,
      giftName,
      emoji: selectedGift,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">يرجى تسجيل الدخول أولاً</p>
        </Card>
      </div>
    );
  }

  const giftEmojis = ["🎁", "💝", "🌹", "🎀", "💐", "🎉", "🎊", "⭐", "💎", "👑"];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">المستخدمون والهدايا</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Send Gift Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Gift className="w-6 h-6" />
                أرسل هدية
              </h2>

              <div className="space-y-4">
                {/* Gift Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">اختر الهدية</label>
                  <div className="grid grid-cols-5 gap-2">
                    {giftEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedGift(emoji)}
                        className={`text-3xl p-3 rounded-lg transition-all ${
                          selectedGift === emoji
                            ? "bg-blue-500 scale-110"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gift Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الهدية</label>
                  <Input
                    value={giftName}
                    onChange={(e) => setGiftName(e.target.value)}
                    placeholder="مثال: هدية جميلة"
                    dir="rtl"
                  />
                </div>

                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">اختر المستخدم</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {rooms.length === 0 ? (
                      <p className="text-gray-500">لا توجد غرف متاحة</p>
                    ) : (
                      rooms.map((room) => (
                        <div key={room.id} className="border rounded-lg p-3">
                          <p className="font-semibold mb-2">{room.name}</p>
                          <div className="text-sm text-gray-600">
                            <p>المالك: {room.ownerId}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSendGift}
                  disabled={!selectedUserId || !giftName.trim() || sendGiftMutation.isPending}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  size="lg"
                >
                  <Gift className="w-4 h-4 ml-2" />
                  {sendGiftMutation.isPending ? "جاري الإرسال..." : "أرسل الهدية"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Received Gifts Section */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">الهدايا المستقبلة</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {receivedGifts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لم تستقبل أي هدايا بعد</p>
                ) : (
                  receivedGifts.map((gift) => (
                    <div key={gift.id} className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
                      <div className="text-2xl mb-1">{gift.emoji}</div>
                      <p className="font-semibold text-sm">{gift.giftName}</p>
                      <p className="text-xs text-gray-600">
                        من: المستخدم {gift.senderId}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(gift.createdAt).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
