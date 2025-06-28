"use client"

import React, { useState } from 'react';
import { Eye, EyeOff, Users, BookOpen, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 opacity-35">
        <div className="absolute top-20 left-20 text-blue-600">
          <BookOpen size={60} />
        </div>
        <div className="absolute top-40 right-32 text-indigo-600">
          <Users size={50} />
        </div>
        <div className="absolute bottom-32 left-32 text-slate-600">
          <Sparkles size={45} />
        </div>
        <div className="absolute bottom-20 right-20 text-blue-700">
          <BookOpen size={55} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border border-gray-100 relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
              <Users className="text-white" size={28} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">StudyGroup+</h1>
          <p className="text-gray-600 text-lg">Welcome back! Ready to study together?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-3">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base pr-12"
                placeholder="Enter your password"
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

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2" 
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-200"
          >
            Sign In
          </button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-1 border-t-2 border-gray-200"></div>
          <span className="px-6 text-sm font-medium text-gray-500 bg-white">or</span>
          <div className="flex-1 border-t-2 border-gray-200"></div>
        </div>

        <p className="text-center text-base text-gray-700">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}