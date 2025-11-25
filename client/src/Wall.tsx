import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Trash2, Image, Send } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface WallPost {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export default function Wall() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<WallPost[]>([
    {
      id: 1,
      authorId: 1,
      authorName: "أحمد محمد",
      authorAvatar: "A",
      content: "يوم جميل في التطبيق! استمتعت بالدردشة مع الجميع 😊",
      timestamp: "منذ ساعة",
      likes: 45,
      comments: 12,
      liked: false,
    },
    {
      id: 2,
      authorId: 2,
      authorName: "فاطمة علي",
      authorAvatar: "F",
      content: "الميزات الجديدة رائعة جداً! شكراً للفريق 🎉",
      image: "https://via.placeholder.com/400x300",
      timestamp: "منذ ساعتين",
      likes: 78,
      comments: 23,
      liked: true,
    },
    {
      id: 3,
      authorId: 3,
      authorName: "محمد سالم",
      authorAvatar: "M",
      content: "من يريد الانضمام إلى غرفة الألعاب الجديدة؟",
      timestamp: "منذ 3 ساعات",
      likes: 32,
      comments: 8,
      liked: false,
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post: WallPost = {
        id: posts.length + 1,
        authorId: user?.id || 0,
        authorName: user?.name || "مستخدم",
        authorAvatar: (user?.name?.[0] || "U").toUpperCase(),
        content: newPost,
        image: selectedImage || undefined,
        timestamp: "الآن",
        likes: 0,
        comments: 0,
        liked: false,
      };
      setPosts([post, ...posts]);
      setNewPost("");
      setSelectedImage(null);
    }
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">الحائط</h1>
        <p className="text-gray-600">شارك أفكارك وتفاعل مع المجتمع</p>
      </div>

      {/* Create Post Card */}
      <Card className="p-6 bg-white shadow-lg mb-8">
        <div className="flex gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {(user?.name?.[0] || "U").toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="ما الذي تفكر به؟"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="mb-4 relative">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                // File input trigger
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setSelectedImage(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              <Image className="w-4 h-4" />
              <span>صورة</span>
            </Button>
          </div>
          <Button
            onClick={handlePostSubmit}
            disabled={!newPost.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
            <span>نشر</span>
          </Button>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 bg-white shadow-lg">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {post.authorAvatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {post.authorName}
                  </h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              {post.authorId === user?.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              )}
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-4">{post.content}</p>

            {/* Post Image */}
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            {/* Post Stats */}
            <div className="flex gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
              <span>{post.likes} إعجاب</span>
              <span>{post.comments} تعليق</span>
            </div>

            {/* Post Actions */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => handleLike(post.id)}
              >
                <Heart
                  className={`w-4 h-4 ${
                    post.liked ? "fill-red-600 text-red-600" : ""
                  }`}
                />
                <span>{post.liked ? "إلغاء الإعجاب" : "إعجاب"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تعليق</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
