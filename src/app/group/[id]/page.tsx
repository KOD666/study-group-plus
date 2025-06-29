"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from "next/link";
import { Users, BookOpen, Calendar, Copy, Check, FileText, MessageCircle, Gamepad2, Upload, Download , Share2 ,ArrowLeft, Clock, User, Crown, Mail } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface GroupMember {
  _id: string;
  name: string;
  email: string;
  joinedAt: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  fileType?: string;
  fileName?: string;
}

interface GroupData {
  _id: string;
  name: string;
  subject: string;
  description: string;
  tags: string[];
  members: string[];
  memberDetails?: GroupMember[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  groupCode: string;
  memberCount: number;
  isActive: boolean;
  notes?: Note[];
}

type TabType = 'notes' | 'chat' | 'jam';

export default function GroupDetailPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [group, setGroup] = useState<GroupData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [jamTimer, setJamTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

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
        fetchGroupData(groupId);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    };

    if (groupId) {
      checkAuth();
    }
  }, [router, groupId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && jamTimer > 0) {
      interval = setInterval(() => {
        setJamTimer(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, jamTimer]);

  const fetchGroupData = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setGroup(data.group);
      } else {
        setError(data.message || 'Failed to fetch group data');
      }
    } catch (error) {
      console.error('Error fetching group:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (minutes: number) => {
    setJamTimer(minutes * 60);
    setTimerActive(true);
  };

  const isUserMember = () => {
    return user && group && group.members.includes(user.id);
  };

  const isGroupOwner = () => {
    return user && group && group.createdBy === user.id;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users size={24} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Group Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!group || !user) {
    return null;
  }

  if (!isUserMember()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users size={24} className="text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">You need to be a member of this group to view its details.</p>
          <Link
            href="/discover"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Discover Groups</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg">
                <Users className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">StudyGroup+</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => copyToClipboard(`${window.location.origin}/join/${group.groupCode}`, 'invite')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Share2 size={16} />
                <span>{copiedItem === 'invite' ? 'Copied!' : 'Invite'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-4 shadow-lg">
                <BookOpen className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                <p className="text-xl text-blue-600 font-medium mb-2">{group.subject}</p>
                {group.description && (
                  <p className="text-gray-600 mb-4">{group.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={() => copyToClipboard(group.groupCode, 'code')}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors mb-2"
              >
                {copiedItem === 'code' ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedItem === 'code' ? 'Copied!' : group.groupCode}</span>
              </button>
              <p className="text-sm text-gray-500">Group Code</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <User size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <p className="font-medium text-gray-900 flex items-center space-x-1">
                  <span>{group.createdByName}</span>
                  {isGroupOwner() && <Crown size={14} className="text-yellow-500" />}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Created on</p>
                <p className="font-medium text-gray-900">
                  {new Date(group.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-lg p-2">
                <Users size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Members</p>
                <p className="font-medium text-gray-900">{group.memberCount} member{group.memberCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'notes', label: 'Notes', icon: FileText },
                { id: 'chat', label: 'Chat', icon: MessageCircle },
                { id: 'jam', label: 'Jam', icon: Gamepad2 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Study Notes</h3>
                  <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Upload size={16} />
                    <span>Upload Note</span>
                  </button>
                </div>

                {group.notes && group.notes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.notes.map((note) => (
                      <div key={note._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <FileText size={16} className="text-blue-600" />
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download size={16} />
                          </button>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{note.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{note.content}</p>
                        <div className="text-xs text-gray-500">
                          <p>By {note.uploadedByName}</p>
                          <p>{new Date(note.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <FileText size={32} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h4>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Start sharing study materials and notes with your group members.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Group Chat</h3>
                
                <div className="bg-gray-50 rounded-xl p-6 h-96 flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4">
                    <div className="text-center py-8">
                      <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <MessageCircle size={32} className="text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Chat coming soon!</h4>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Real-time chat functionality will be available in the next update.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      disabled
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                    <button
                      disabled
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jam' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Study Jam</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-red-100 rounded-lg p-2">
                        <Clock size={20} className="text-red-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Pomodoro Timer</h4>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-4xl font-mono font-bold text-gray-900 mb-4">
                        {formatTime(jamTimer)}
                      </div>
                      {timerActive && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${((25 * 60 - jamTimer) / (25 * 60)) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => startTimer(25)}
                        disabled={timerActive}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        25 min
                      </button>
                      <button
                        onClick={() => startTimer(5)}
                        disabled={timerActive}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        5 min
                      </button>
                      <button
                        onClick={() => setTimerActive(!timerActive)}
                        disabled={jamTimer === 0}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {timerActive ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => {
                          setJamTimer(0);
                          setTimerActive(false);
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <Gamepad2 size={20} className="text-purple-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Mini Games</h4>
                    </div>
                    
                    <div className="text-center py-8">
                      <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Gamepad2 size={24} className="text-purple-600" />
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">Coming Soon!</h5>
                      <p className="text-gray-600 text-sm">
                        Fun study break games and activities will be available soon.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Group Members ({group.memberCount})</h3>
          
          {group.memberDetails && group.memberDetails.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.memberDetails.map((member) => (
                <div key={member._id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2 shadow-lg">
                    <User className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      {member._id === group.createdBy && (
                        <Crown size={14} className="text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Mail size={12} />
                      <span>{member.email}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: group.memberCount }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2 shadow-lg">
                    <User className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Group Member {index + 1}</p>
                    <p className="text-sm text-gray-600">member@example.com</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}