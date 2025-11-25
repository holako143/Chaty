import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import {
  MessageCircle,
  Users,
  Gift,
  Settings,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

export default function Landing() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"guest" | "member" | "register">(
    "guest"
  );
  const [guestName, setGuestName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(1250);
  const [announcement, setAnnouncement] = useState(
    "مرحباً بك في تطبيق الدردشة المتكامل! 🎉"
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/chat");
    }
  }, [isAuthenticated, user, navigate]);

  const handleGuestLogin = () => {
    if (guestName.trim()) {
      // Store guest name in session storage
      sessionStorage.setItem("guestName", guestName);
      navigate("/chat");
    }
  };

  const handleMemberLogin = () => {
    if (memberEmail && memberPassword) {
      // Redirect to OAuth login
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600">تطبيق الدردشة</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">العربية</Button>
            <Button variant="outline">English</Button>
          </div>
        </div>
      </header>

      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="animate-pulse text-center font-semibold">
            📢 {announcement}
          </div>
        </div>
      </div>

      {/* Scrolling Message Bar */}
      <div className="bg-indigo-50 py-2 overflow-hidden border-b-2 border-indigo-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 animate-scroll">
            <span className="whitespace-nowrap text-indigo-700 font-medium">
              ✨ انضم إلى آلاف المستخدمين النشطين الآن!
            </span>
            <span className="whitespace-nowrap text-indigo-700 font-medium">
              🎁 احصل على هدايا وتفاعل مع الآخرين
            </span>
            <span className="whitespace-nowrap text-indigo-700 font-medium">
              🎙️ استمتع بالبث الصوتي المباشر
            </span>
            <span className="whitespace-nowrap text-indigo-700 font-medium">
              ⭐ اجمع النقاط والنجوم
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Online Users */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-lg sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-lg">حالة الاتصال</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  المتصلون الآن:
                  <span className="font-bold text-green-600 ml-2">
                    {onlineUsers}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  ✓ الخادم يعمل بكفاءة
                </div>
              </div>
            </Card>
          </div>

          {/* Center - Login Forms */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("guest")}
                  className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                    activeTab === "guest"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  زائر
                </button>
                <button
                  onClick={() => setActiveTab("member")}
                  className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                    activeTab === "member"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  عضو
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                    activeTab === "register"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  تسجيل
                </button>
              </div>

              {/* Guest Login */}
              {activeTab === "guest" && (
                <Card className="p-6 bg-white shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    دخول زائر
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="اسم مؤقت"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={handleGuestLogin}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      دخول كزائر
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      بدون الحاجة لكلمة سر
                    </p>
                  </div>
                </Card>
              )}

              {/* Member Login */}
              {activeTab === "member" && (
                <Card className="p-6 bg-white shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    دخول عضو
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="كلمة المرور"
                      value={memberPassword}
                      onChange={(e) => setMemberPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={handleMemberLogin}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      دخول
                    </Button>
                  </div>
                </Card>
              )}

              {/* Register */}
              {activeTab === "register" && (
                <Card className="p-6 bg-white shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    تسجيل عضوية جديدة
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="الاسم"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="كلمة المرور"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="تأكيد كلمة المرور"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      إنشاء حساب
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Right Sidebar - Online Members */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="font-bold text-lg mb-4">الأعضاء النشطون</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">مستخدم {i + 1}</p>
                      <p className="text-xs text-gray-500">متاح ✓</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">دردشة حية</h3>
            <p className="text-gray-600 text-sm">
              تواصل مع الآخرين في الوقت الفعلي
            </p>
          </Card>

          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <Users className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">مجتمع نشط</h3>
            <p className="text-gray-600 text-sm">
              انضم إلى آلاف المستخدمين النشطين
            </p>
          </Card>

          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <Gift className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">نظام الهدايا</h3>
            <p className="text-gray-600 text-sm">
              أرسل هدايا واحصل على مكافآت
            </p>
          </Card>

          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <Settings className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">تخصيص كامل</h3>
            <p className="text-gray-600 text-sm">
              خصص ملفك الشخصي بالألوان والزخرفة
            </p>
          </Card>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-bold text-lg mb-4">تابعنا على وسائل التواصل</h3>
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
              title="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
              title="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="hover:text-pink-400 transition-colors"
              title="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="hover:text-red-400 transition-colors"
              title="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 تطبيق الدردشة المتكامل. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
