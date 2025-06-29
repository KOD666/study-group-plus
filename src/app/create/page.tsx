"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Users, ArrowLeft, Plus, BookOpen, Tag, FileText } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function CreateGroup() {
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    tags: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.subject.trim()) {
      setError('Title and subject are required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          subject: formData.subject.trim(),
          tags: formData.tags.trim(),
          description: formData.description.trim(),
          createdBy: user?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Group created successfully! Redirecting...');
        setTimeout(() => {
          router.push(`/group/${data.groupId}`);
        }, 1500);
      } else {
        setError(data.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Plus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create Study Group
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Start your collaborative learning journey by creating a new study group. 
            Invite your classmates and organize your studies together.
          </p>
        </div>

        {/* Create Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  <BookOpen size={16} />
                  <span>Group Title *</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Advanced Calculus Study Group"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  <BookOpen size={16} />
                  <span>Subject *</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="tags" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  <Tag size={16} />
                  <span>Tags (Optional)</span>
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., calculus, derivatives, limits (separate with commas)"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Add relevant tags to help others discover your group
                </p>
              </div>

              <div>
                <label htmlFor="description" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  <FileText size={16} />
                  <span>Description & Schedule (Optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your study group, meeting schedule, goals, or any other relevant information..."
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none text-gray-900 bg-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Include meeting times, study goals, or any group guidelines
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.subject.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Group...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      <span>Create Study Group</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              💡 Tips for a Successful Study Group
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Choose a clear, descriptive title that reflects your subject</li>
              <li>• Add relevant tags to help classmates find your group</li>
              <li>• Include meeting schedule and study goals in the description</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}