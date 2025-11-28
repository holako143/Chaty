import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  MessageSquare,
  Zap,
  Trash2,
  Ban,
  Edit,
  Plus,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
  bannedUsers: number;
  totalRooms: number;
  reportedContent: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  status: "online" | "offline";
}

interface Report {
  id: number;
  reportedUser: string;
  reason: string;
  status: "pending" | "resolved";
  date: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "reports" | "settings" | "filters"
  >("dashboard");

  const [stats] = useState<AdminStats>({
    totalUsers: 1250,
    activeUsers: 456,
    totalMessages: 45230,
    bannedUsers: 12,
    totalRooms: 28,
    reportedContent: 5,
  });

  const [users] = useState<User[]>([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      role: "member",
      joinedAt: "2025-01-15",
      status: "online",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      role: "moderator",
      joinedAt: "2025-01-10",
      status: "online",
    },
    {
      id: 3,
      name: "محمد سالم",
      email: "mohammad@example.com",
      role: "member",
      joinedAt: "2025-01-20",
      status: "offline",
    },
  ]);

  const [reports] = useState<Report[]>([
    {
      id: 1,
      reportedUser: "مستخدم غير لائق",
      reason: "محتوى مسيء",
      status: "pending",
      date: "2025-01-25",
    },
    {
      id: 2,
      reportedUser: "رسالة مسيئة",
      reason: "كلمات نابية",
      status: "resolved",
      date: "2025-01-24",
    },
  ]);

  const [filters] = useState<string[]>([
    "كلمة سيئة 1",
    "كلمة سيئة 2",
    "كلمة سيئة 3",
  ]);

  const [newFilter, setNewFilter] = useState("");

  const handleAddFilter = () => {
    if (newFilter.trim()) {
      setNewFilter("");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">وصول مرفوض</h1>
          <p className="text-gray-600">
            أنت لا تملك صلاحيات الوصول إلى لوحة التحكم
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">إدارة شاملة لتطبيق الدردشة</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {[
          { id: "dashboard", label: "لوحة التحكم", icon: BarChart3 },
          { id: "users", label: "المستخدمون", icon: Users },
          { id: "reports", label: "التقارير", icon: MessageSquare },
          { id: "filters", label: "الفلاتر", icon: Zap },
          { id: "settings", label: "الإعدادات", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(
                tab.id as
                  | "dashboard"
                  | "users"
                  | "reports"
                  | "settings"
                  | "filters"
              )
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    إجمالي المستخدمين
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalUsers}
                  </p>
                </div>
                <Users className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    المستخدمون النشطون
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {stats.activeUsers}
                  </p>
                </div>
                <Zap className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    إجمالي الرسائل
                  </p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {stats.totalMessages}
                  </p>
                </div>
                <MessageSquare className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    المستخدمون المحظورون
                  </p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {stats.bannedUsers}
                  </p>
                </div>
                <Ban className="w-12 h-12 text-red-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    إجمالي الغرف
                  </p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {stats.totalRooms}
                  </p>
                </div>
                <MessageSquare className="w-12 h-12 text-indigo-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    المحتوى المبلغ عنه
                  </p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {stats.reportedContent}
                  </p>
                </div>
                <Shield className="w-12 h-12 text-orange-600 opacity-20" />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6">إدارة المستخدمين</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    الاسم
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    البريد الإلكتروني
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    الدور
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    الحالة
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{u.name}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          u.status === "online"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.status === "online" ? "متصل" : "غير متصل"}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Ban className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6">التقارير والشكاوى</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {report.reportedUser}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      السبب: {report.reason}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{report.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.status === "pending" ? "قيد الانتظار" : "تم الحل"}
                    </span>
                    <Button size="sm" variant="outline">
                      عرض
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters Tab */}
      {activeTab === "filters" && (
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6">إدارة الفلاتر</h2>
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              placeholder="أضف كلمة جديدة للفلترة"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleAddFilter} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة
            </Button>
          </div>
          <div className="space-y-2">
            {filters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="font-semibold text-gray-900">{filter}</span>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6">إعدادات النظام</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم التطبيق
              </label>
              <input
                type="text"
                defaultValue="تطبيق الدردشة المتكامل"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الحد الأقصى للمستخدمين في الغرفة
              </label>
              <input
                type="number"
                defaultValue={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                تفعيل الصوت والفيديو
              </label>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600"
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              حفظ الإعدادات
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
