"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft, UserCircle2, Upload, BookOpen, Calendar, Hash } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Group {
  _id: string;
  name: string;
  subject: string;
  description: string;
  tags: string[];
  createdBy: string;
  members: string[];
  createdAt: string;
  groupCode: string;
  memberCount: number;
  isActive: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const userData = localStorage.getItem("user");

      if (!isAuthenticated || !userData) {
        router.push("/login");
        return;
      }

      try {
        const parsed: UserData = JSON.parse(userData);
        setUser(parsed);
        
        // Load user's groups
        await loadUserGroups(parsed.id);
      } catch (err) {
        console.error("Error loading profile", err);
        setError("Failed to load profile data");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const loadUserGroups = async (userId: string) => {
    setLoadingGroups(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/auth/groups/discover?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setGroups(data.groups || []);
      } else {
        throw new Error(data.message || 'Failed to fetch groups');
      }
    } catch (err) {
      console.error('Error fetching user groups:', err);
      setError('Failed to load your groups');
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }

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
          alert(result.message || "Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Failed to upload image");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isGroupCreator = (group: Group) => {
    return group.createdBy === user?.id;
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
          <Link href="/dashboard" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
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
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="bg-blue-100 p-4 rounded-full">
                <UserCircle2 className="text-blue-600" size={40} />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {groups.length} {groups.length === 1 ? 'Group' : 'Groups'}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={14} />
                  {groups.filter(g => isGroupCreator(g)).length} Created
                </span>
              </div>
            </div>
          </div>

          {/* Upload */}
          <label className="inline-flex items-center gap-2 text-sm text-blue-700 font-medium cursor-pointer hover:text-blue-800 transition-colors">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload New Photo"}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => user && loadUserGroups(user.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Groups */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen size={20} />
              Your Study Groups
            </h3>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse More Groups →
            </Link>
          </div>

          {loadingGroups ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading your groups...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="text-gray-400" size={32} />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">No Groups Yet</h4>
              <p className="text-gray-500 mb-4">You haven&apos;t joined any study groups yet.</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Users size={16} />
                Find Study Groups
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-800">{group.name}</h4>
                        {isGroupCreator(group) && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                            Created by you
                          </span>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium text-sm">{group.subject}</p>
                    </div>
                  </div>

                  {group.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
                  )}

                  {group.tags && group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {group.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {group.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">+{group.tags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(group.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Hash size={12} />
                      {group.groupCode}
                    </div>
                  </div>

                  <Link
                    href={`/group/${group._id}`}
                    className="block w-full text-center bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    View Group →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}