"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Users, BookOpen, Calendar, Copy, Check, Plus, User } from "lucide-react";

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
  tags: string[];
  members: string[];
  createdBy: string;
  createdAt: string;
  groupCode: string;
  memberCount: number;
  isActive: boolean;
}

export default function DiscoverGroups() {
  const [user, setUser] = useState<UserData | null>(null);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState('');
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
      const response = await fetch(`/api/auth/groups/discover?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setGroups(data.groups || []);
      } else {
        setError(data.message || 'Failed to fetch groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  const isGroupCreator = (group: StudyGroup) => {
    return user && group.createdBy === user.id;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your groups...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create Group
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Study Groups
          </h1>
          <p className="text-gray-600 text-lg">
            Groups you&apos;ve created or joined
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{groups.length}</p>
                <p className="text-sm text-gray-600">Total Groups</p>
              </div>
            </div>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No study groups yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven&apos;t created or joined any study groups yet. Start by creating your first group!
            </p>
            <Link
              href="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create Your First Group</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Link
                key={group._id}
                href={`/group/${group._id}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 group-hover:border-blue-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3 shadow-lg">
                      <BookOpen className="text-white" size={20} />
                    </div>
                    <div className="flex items-center space-x-2">
                      {isGroupCreator(group) && (
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                          Creator
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          copyGroupCode(group.groupCode);
                        }}
                        className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                      >
                        {copiedCode === group.groupCode ? (
                          <>
                            <Check size={12} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>{group.groupCode}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">{group.subject}</p>
                  
                  {group.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {group.description}
                    </p>
                  )}

                  {group.tags && group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {group.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {group.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{group.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{group.memberCount} member{group.memberCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {groups.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create Another Group</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}