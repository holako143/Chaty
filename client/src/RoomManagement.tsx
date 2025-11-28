import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Shield, Users, Plus } from "lucide-react";

export default function RoomManagement() {
  const { user, isAuthenticated } = useAuth();
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [banUserId, setBanUserId] = useState("");
  const [banReason, setBanReason] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // Fetch rooms
  const { data: rooms = [] } = trpc.rooms.list.useQuery();

  // Create room mutation
  const createRoomMutation = trpc.rooms.create.useMutation({
    onSuccess: () => {
      setNewRoomName("");
      setNewRoomDescription("");
      trpc.useUtils().rooms.list.invalidate();
    },
  });

  // Ban user mutation
  const banUserMutation = trpc.management.banUser.useMutation({
    onSuccess: () => {
      setBanUserId("");
      setBanReason("");
    },
  });

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;

    createRoomMutation.mutate({
      name: newRoomName,
      description: newRoomDescription || undefined,
      isPrivate: false,
    });
  };

  const handleBanUser = () => {
    if (!selectedRoomId || !banUserId.trim()) return;

    const userId = parseInt(banUserId);
    banUserMutation.mutate({
      roomId: selectedRoomId,
      userId,
      reason: banReason || undefined,
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Shield className="w-8 h-8" />
          إدارة الغرف
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Room Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              إنشاء غرفة جديدة
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم الغرفة</label>
                <Input
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="مثال: غرفة الأصدقاء"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <Input
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  placeholder="وصف الغرفة..."
                  dir="rtl"
                />
              </div>

              <Button
                onClick={handleCreateRoom}
                disabled={!newRoomName.trim() || createRoomMutation.isPending}
                className="w-full bg-green-500 hover:bg-green-600"
                size="lg"
              >
                <Plus className="w-4 h-4 ml-2" />
                {createRoomMutation.isPending ? "جاري الإنشاء..." : "إنشاء الغرفة"}
              </Button>
            </div>
          </Card>

          {/* Ban User Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              حظر مستخدم
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اختر الغرفة</label>
                <select
                  value={selectedRoomId || ""}
                  onChange={(e) => setSelectedRoomId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">-- اختر غرفة --</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">معرف المستخدم</label>
                <Input
                  value={banUserId}
                  onChange={(e) => setBanUserId(e.target.value)}
                  placeholder="أدخل معرف المستخدم"
                  type="number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">السبب</label>
                <Input
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="سبب الحظر..."
                  dir="rtl"
                />
              </div>

              <Button
                onClick={handleBanUser}
                disabled={!selectedRoomId || !banUserId.trim() || banUserMutation.isPending}
                className="w-full bg-red-500 hover:bg-red-600"
                size="lg"
              >
                <Shield className="w-4 h-4 ml-2" />
                {banUserMutation.isPending ? "جاري الحظر..." : "حظر المستخدم"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Rooms List */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" />
            قائمة الغرف
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.length === 0 ? (
              <p className="text-gray-500 col-span-full">لا توجد غرف متاحة</p>
            ) : (
              rooms.map((room) => (
                <Card key={room.id} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <h3 className="font-bold text-lg mb-2">{room.name}</h3>
                  {room.description && (
                    <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                  )}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>المالك: {room.ownerId}</p>
                    <p>نوع: {room.isPrivate ? "خاص" : "عام"}</p>
                    <p>تاريخ الإنشاء: {new Date(room.createdAt).toLocaleDateString("ar-SA")}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
