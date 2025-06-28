"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Users, Plus, Calendar, BookOpen, LogOut, User, Globe, Copy, Check } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface StudyGroup {
  _id: string;
  name: string;
  subject: string;
  description: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  groupCode: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('user');
      
      if (!isAuthenticated || !userData) {
        router.push('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchUserGroups(parsedUser.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchUserGroups = async (userId: string) => {
    try {
      const response = await fetch(`/api/groups/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setGroups(data.groups || []);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setIsJoining(true);
    setJoinError('');
    setJoinSuccess('');

    try {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupCode: joinCode.trim(),
          userId: user?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setJoinSuccess('Successfully joined the group!');
        setJoinCode('');
        // Refresh groups
        if (user) {
          fetchUserGroups(user.id);
        }
      } else {
        setJoinError(data.message || 'Failed to join group');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      setJoinError('Network error. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const copyGroupCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg mr-3">
                <Users className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">StudyGroup+</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/discover"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Discover
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {groups.length > 0 
              ? `You're part of ${groups.length} study group${groups.length > 1 ? 's' : ''}.`
              : "Ready to start your collaborative learning journey?"
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Create Group CTA */}
            <div className="mb-8">
              <Link
                href="/create"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-8 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-4 group"
              >
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <Plus size={32} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-1">Create Study Group</h3>
                  <p className="text-blue-100">Start collaborating with your classmates</p>
                </div>
              </Link>
            </div>

            {/* My Groups Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Study Groups</h2>
              
              {groups.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Users size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No study groups yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Create your first study group or join an existing one using a group code.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/create"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      Create Group
                    </Link>
                    <Link
                      href="/discover"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      Discover Groups
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {groups.map((group) => (
                    <div
                      key={group._id}
                      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3 shadow-lg">
                            <BookOpen className="text-white" size={20} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
                            <p className="text-blue-600 font-medium mb-2">{group.subject}</p>
                            <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Users size={14} />
                                <span>{group.members.length} member{group.members.length !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyGroupCode(group.groupCode)}
                            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            {copiedCode === group.groupCode ? (
                              <>
                                <Check size={14} />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>{group.groupCode}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3 shadow-lg">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Groups joined:</span>
                  <span className="font-medium text-gray-900">{groups.length}</span>
                </div>
              </div>
            </div>

            {/* Join Group */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Join a Group</h3>
              
              {joinError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{joinError}</p>
                </div>
              )}

              {joinSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{joinSuccess}</p>
                </div>
              )}

              <form onSubmit={handleJoinGroup} className="space-y-4">
                <div>
                  <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Code
                  </label>
                  <input
                    type="text"
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter group code"
                    disabled={isJoining}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isJoining || !joinCode.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJoining ? 'Joining...' : 'Join Group'}
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/discover"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2">
                    <Globe className="text-white" size={16} />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-emerald-600">Discover Groups</span>
                </Link>
                
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-purple-600">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}