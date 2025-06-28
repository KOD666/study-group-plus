"use client"

import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, BookOpen, Users, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 opacity-35">
        <div className="absolute top-16 left-16 text-emerald-600">
          <GraduationCap size={65} />
        </div>
        <div className="absolute top-36 right-28 text-teal-600">
          <Users size={55} />
        </div>
        <div className="absolute bottom-32 left-32 text-emerald-700">
          <BookOpen size={50} />
        </div>
        <div className="absolute bottom-16 right-16 text-teal-700">
          <Sparkles size={60} />
        </div>
      </div>

      {/* Main signup container */}
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg border border-gray-100 relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 shadow-lg">
              <GraduationCap className="text-white" size={28} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Join StudyGroup+</h1>
          <p className="text-gray-600 text-lg">Start your collaborative learning journey!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base pr-12"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base pr-12"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start pt-2">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 mt-1" 
            />
            <span className="ml-3 text-sm font-medium text-gray-700 leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Privacy Policy</a>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-4 focus:ring-emerald-200"
          >
            Create Account
          </button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-1 border-t-2 border-gray-200"></div>
          <span className="px-6 text-sm font-medium text-gray-500 bg-white">or</span>
          <div className="flex-1 border-t-2 border-gray-200"></div>
        </div>

        <p className="text-center text-base text-gray-700">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}