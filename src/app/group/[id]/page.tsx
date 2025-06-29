"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from "next/link";
import { Users, BookOpen, Calendar, Copy, Check, ArrowLeft, Tag, User, FileText, Send, MessageCircle, Clock, Mail, Crown } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface GroupMember {
  _id: string;
  name: string;
  email: string;
  joinedAt?: string;
}

interface GroupNote {
  _id: string;
  title: string;
  uploadedBy: {
    name: string;
    email: string;
  };
  uploadedAt: string;
  fileUrl?: string;
}

interface GroupMessage {
  _id: string;
  message: string;
  sender: {
    name: string;
    email: string;
  };
  sentAt: string;
}

interface GroupDetails {
  _id: string;
  name: string;
  subject: string;
  description: string;
  tags: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  members: GroupMember[];
  createdAt: string;
  updatedAt: string;
  groupCode: string;
  memberCount: number;
  isActive: boolean;
  notes: GroupNote[];
  messages: GroupMessage[];
}

export default function GroupDetailPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  useEffect(() => {
    const checkAuth = () => {
      // Prevent SSR issues
      if (typeof window === 'undefined') return;
      
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('user');
        
        if (!isAuthenticated || !userData) {
          router.push('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        if (groupId) {
          fetchGroupDetails(groupId);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear corrupted data
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, groupId]);

  const fetchGroupDetails = async (id: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Fetching group details for ID:', id);
      
      const response = await fetch(`/api/auth/groups/${id}`);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (response.ok && data.success) {
        setGroup(data.group);
      } else {
        console.error('API Error:', data.message);
        setError(data.message || 'Failed to fetch group details');
      }
    } catch (error) {
      console.error('Network error fetching group details:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyGroupCode = async () => {
    if (!group) return;
    
    try {
      await navigator.clipboard.writeText(group.groupCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !group || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const response = await fetch(`/api/auth/groups/${groupId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          userId: user.id
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setNewMessage('');
        await fetchGroupDetails(groupId);
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const isGroupMember = () => {
    if (!user || !group) return false;
    return group.members.some(member => member._id === user.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Users size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Group Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The group you\'re looking for doesn\'t exist.'}</p>
          <Link
            href="/discover"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Groups</span>
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is a member of the group
  if (!isGroupMember()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Users size={32} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">You need to be a member of this group to view its details.</p>
          <Link
            href="/discover"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Groups</span>
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
            <div className="flex items-center">
              <Link
                href="/discover"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mr-4"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Groups</span>
              </Link>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg mr-3">
                <BookOpen className="text-white" size={20} />
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
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3 shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                  <p className="text-blue-600 font-semibold text-lg">{group.subject}</p>
                </div>
              </div>
              
              {group.description && (
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {group.description}
                </p>
              )}

              {group.tags && group.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {group.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 lg:ml-8 lg:w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Group Code</span>
                  <button
                    onClick={copyGroupCode}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-mono text-sm transition-colors"
                  >
                    {copiedCode ? (
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

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Members</span>
                  <div className="flex items-center space-x-1 text-gray-900 font-semibold">
                    <Users size={16} />
                    <span>{group.memberCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Created</span>
                  <div className="flex items-center space-x-1 text-gray-900">
                    <Calendar size={16} />
                    <span className="text-sm">{formatDate(group.createdAt)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Crown size={16} className="text-yellow-500" />
                    <span className="text-gray-600 text-sm">Created by</span>
                  </div>
                  <p className="text-gray-900 font-semibold mt-1">{group.createdBy.name}</p>
                  <p className="text-gray-600 text-sm">{group.createdBy.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Users size={20} />
                <span>Members ({group.memberCount})</span>
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {group.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="bg-blue-100 rounded-full p-2">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                        {member._id === group.createdBy._id && (
                          <Crown size={14} className="text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm truncate flex items-center space-x-1">
                        <Mail size={12} />
                        <span>{member.email}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText size={20} />
                <span>Notes ({group.notes.length})</span>
              </h2>
              
              {group.notes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={32} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No notes uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {group.notes.map((note) => (
                    <div
                      key={note._id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User size={12} />
                          <span>{note.uploadedBy.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{formatDate(note.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-96 lg:h-[600px] flex flex-col">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <MessageCircle size={20} />
                  <span>Group Chat</span>
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {group.messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No messages yet</p>
                    <p className="text-gray-500 text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  group.messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender.email === user?.email ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.sender.email === user?.email
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">{message.sender.name}</p>
                        <p className="mb-2">{message.message}</p>
                        <p
                          className={`text-xs ${
                            message.sender.email === user?.email
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.sentAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSendingMessage}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSendingMessage}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}