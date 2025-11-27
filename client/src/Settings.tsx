import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Palette, User } from "lucide-react";

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const { data: preferences } = trpc.preferences.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [nameColor, setNameColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [statusColor, setStatusColor] = useState("#00FF00");
  const [decoration, setDecoration] = useState("");
  const [status, setStatus] = useState("متاح");

  useEffect(() => {
    if (preferences) {
      setNameColor(preferences.nameColor);
      setTextColor(preferences.textColor);
      setBackgroundColor(preferences.backgroundColor);
      setStatusColor(preferences.statusColor);
      setDecoration(preferences.decoration);
      setStatus(preferences.status);
    }
  }, [preferences]);

  const updatePreferencesMutation = trpc.preferences.update.useMutation({
    onSuccess: () => {
      trpc.useUtils().preferences.get.invalidate();
    },
  });

  const handleSave = () => {
    updatePreferencesMutation.mutate({
      nameColor,
      textColor,
      backgroundColor,
      statusColor,
      decoration,
      status,
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
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <Palette className="w-6 h-6" />
            <h1 className="text-2xl font-bold">إعدادات التخصيص</h1>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <h2 className="font-semibold">معلومات المستخدم</h2>
              </div>
              <p className="text-gray-600">الاسم: {user?.name}</p>
              <p className="text-gray-600">البريد: {user?.email}</p>
            </div>

            {/* Color Settings */}
            <div>
              <h3 className="font-semibold mb-4">الألوان</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">لون الاسم</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={nameColor}
                      onChange={(e) => setNameColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={nameColor}
                      onChange={(e) => setNameColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">لون الخط</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">لون الخلفية</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">لون الحالة</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={statusColor}
                      onChange={(e) => setStatusColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={statusColor}
                      onChange={(e) => setStatusColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Decoration */}
            <div>
              <h3 className="font-semibold mb-4">الحالة والزخرفة</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الحالة</label>
                  <Input
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="مثال: متاح، مشغول، نائم"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الزخرفة</label>
                  <Input
                    value={decoration}
                    onChange={(e) => setDecoration(e.target.value)}
                    placeholder="مثال: ✨ 👑 🎭"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="font-semibold mb-4">معاينة</h3>
              <div
                className="p-4 rounded-lg border-2"
                style={{ backgroundColor }}
              >
                <div style={{ color: nameColor }} className="font-bold text-lg">
                  {user?.name} {decoration}
                </div>
                <div style={{ color: textColor }} className="mt-2">
                  هذه معاينة لرسالتك
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span style={{ color: textColor }}>{status}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={updatePreferencesMutation.isPending}
              className="w-full bg-blue-500 hover:bg-blue-600"
              size="lg"
            >
              {updatePreferencesMutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
