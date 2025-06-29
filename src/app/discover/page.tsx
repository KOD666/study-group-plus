"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Users, Search, BookOpen, Calendar, Copy, Check, Plus } from "lucide-react";

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
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const router = useRouter();

  const subjects = Array.from(new Set(groups.map(group => group.subject))).sort();

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
        fetchAllGroups();
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    let filtered = groups;

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(search) ||
        group.subject.toLowerCase().includes(search) ||
        group.description.toLowerCase().includes(search) ||
        group.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(group => group.subject === selectedSubject);
    }

    setFilteredGroups(filtered);
  }, [groups, searchTerm, selectedSubject]);

  const fetchAllGroups = async () => {
    try {
      // Fixed API path to match your route structure
      const response = await fetch('/api/auth/groups/discover');
      const data = await response.json();
      
      if (data.success) {
        setGroups(data.groups || []);
      } else {
        console.error('Failed to fetch groups:', data.message);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupCode: string, groupId: string) => {
    if (!user) return;

    setIsJoining(groupId);
    setJoinError('');
    setJoinSuccess('');

    try {
      // Fixed API path to match your route structure
      const response = await fetch('/api/auth/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupCode: groupCode,
          userId: user.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setJoinSuccess('Successfully joined the group!');
        fetchAllGroups();
        // Clear success message after 3 seconds
        setTimeout(() => setJoinSuccess(''), 3000);
      } else {
        setJoinError(data.message || 'Failed to join group');
        // Clear error message after 5 seconds
        setTimeout(() => setJoinError(''), 5000);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      setJoinError('Network error. Please try again.');
      setTimeout(() => setJoinError(''), 5000);
    } finally {
      setIsJoining(null);
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

  const isUserMember = (group: StudyGroup) => {
    return user && group.members.includes(user.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading groups...</p>
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
            Discover Study Groups
          </h1>
          <p className="text-gray-600 text-lg">
            Find and join study groups that match your interests
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search groups, subjects, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredGroups.length} of {groups.length} groups
          </div>
        </div>

        {joinError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">{joinError}</p>
          </div>
        )}

        {joinSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-600 text-sm font-medium">{joinSuccess}</p>
          </div>
        )}

        {filteredGroups.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedSubject ? 'No groups found' : 'No study groups available'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedSubject 
                ? 'Try adjusting your search or filters to find more groups.'
                : 'Be the first to create a study group and help others learn!'
              }
            </p>
            <Link
              href="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create First Group</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3 shadow-lg">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyGroupCode(group.groupCode)}
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

                <h3 className="text-lg font-bold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{group.subject}</p>
                
                {group.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
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
                      <span className="text-gray-500 text-xs">+{group.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{group.memberCount} member{group.memberCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {isUserMember(group) ? (
                  <button
                    disabled
                    className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-xl font-medium cursor-not-allowed"
                  >
                    Already Joined
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.groupCode, group._id)}
                    disabled={isJoining === group._id}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isJoining === group._id ? 'Joining...' : 'Join Group'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}