"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft, UserCircle2, Upload } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Group {
  id: string;
  title: string;
  subject: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const userData = localStorage.getItem("user");

      if (!isAuthenticated || !userData) {
        router.push("/login");
        return;
      }

      try {
        const parsed: UserData = JSON.parse(userData);
        setUser(parsed);

        const dummyGroups: Group[] = [
          { id: "1", title: "AI & ML", subject: "Computer Science" },
          { id: "2", title: "Discrete Math", subject: "Mathematics" },
        ];
        setGroups(dummyGroups);
      } catch (err) {
        console.error("Error loading profile", err);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      setUploading(true);
      try {
        const response = await fetch("/api/auth/upload-profile-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, image: base64Image }),
        });

        const result = await response.json();
        if (result.success) {
          const updatedUser = { ...user, profileImage: result.image };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          alert("Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md">
              <Users className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">StudyGroup+</h1>
          </div>
          <Link href="/dashboard" className="flex items-center text-sm text-gray-600 hover:text-blue-600">
            <ArrowLeft size={16} />
            <span className="ml-1">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile Info */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-10">
          <div className="flex items-center gap-6 mb-6">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-blue-500"
              />
            ) : (
              <div className="bg-blue-100 p-4 rounded-full">
                <UserCircle2 className="text-blue-600" size={40} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Upload */}
          <label className="inline-flex items-center gap-2 text-sm text-blue-700 font-medium cursor-pointer">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload New Photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </section>

        {/* Groups */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Joined Groups</h3>
          {groups.length === 0 ? (
            <p className="text-gray-500">You haven&apos;t joined any groups yet.</p>
          ) : (
            <ul className="space-y-4">
              {groups.map((group) => (
                <li
                  key={group.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                >
                  <h4 className="text-md font-semibold text-blue-700">{group.title}</h4>
                  <p className="text-sm text-gray-600">Subject: {group.subject}</p>
                  <Link
                    href={`/group/${group.id}`}
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                  >
                    View Group →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}