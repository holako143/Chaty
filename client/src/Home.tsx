import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { MessageCircle, Settings, Users, Gift } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">{APP_TITLE}</h1>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setLocation("/settings")}>
                <Settings className="w-4 h-4 ml-2" />
                الإعدادات
              </Button>
              <Button variant="destructive" onClick={logout}>
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">أهلاً وسهلاً {user?.name}!</h2>
            <p className="text-xl text-gray-600">مرحباً بك في تطبيق الدردشة المتكامل</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => setLocation("/chat")}
            >
              <MessageCircle className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="font-bold mb-2">الدردشة</h3>
              <p className="text-sm text-gray-600">انضم إلى غرف الدردشة والتحدث مع الآخرين</p>
            </Card>

            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setLocation("/users")}
            >
              <Users className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="font-bold mb-2">المستخدمون</h3>
              <p className="text-sm text-gray-600">تابع المستخدمين النشطين وتفاعل معهم</p>
            </Card>

            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setLocation("/users")}
            >
              <Gift className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="font-bold mb-2">الهدايا</h3>
              <p className="text-sm text-gray-600">أرسل الهدايا للمستخدمين المفضلين</p>
            </Card>

            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setLocation("/settings")}
            >
              <Settings className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-bold mb-2">التخصيص</h3>
              <p className="text-sm text-gray-600">خصص ملفك الشخصي بالألوان والزخرفة</p>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              onClick={() => setLocation("/chat")}
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              ابدأ الدردشة الآن
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Not authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">{APP_TITLE}</h1>
        <p className="text-gray-600 mb-6 text-center">
          تطبيق دردشة متكامل مع ميزات متقدمة للتفاعل والتواصل مع المستخدمين الآخرين
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span>دردشة حية مع المستخدمين</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Gift className="w-5 h-5 text-purple-500" />
            <span>إرسال الهدايا والرموز</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Users className="w-5 h-5 text-green-500" />
            <span>إدارة المستخدمين والغرف</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Settings className="w-5 h-5 text-orange-500" />
            <span>تخصيص كامل للملف الشخصي</span>
          </div>
        </div>
        <Button
          size="lg"
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700"
          onClick={() => window.location.href = getLoginUrl()}
        >
          تسجيل الدخول الآن
        </Button>
      </Card>
    </div>
  );
}
