import Link from "next/link";
import { Users, BookOpen, MessageCircle, Brain, Calendar, Share2, Sparkles, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <section className="relative px-4 py-20 sm:py-32">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-20 left-20 text-blue-600">
            <GraduationCap size={60} />
          </div>
          <div className="absolute top-40 right-32 text-indigo-600">
            <Users size={50} />
          </div>
          <div className="absolute bottom-32 left-32 text-slate-600">
            <BookOpen size={45} />
          </div>
          <div className="absolute bottom-20 right-20 text-blue-700">
            <Sparkles size={55} />
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
              <Users className="text-white" size={32} />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            StudyGroup<span className="text-blue-600">+</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Form smarter study groups, share notes, stay focused — powered by AI.
          </p>
          
          <div className="mb-12">
            <Link 
              href="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to study better
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Collaborate with peers, stay organized, and boost your academic performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-4 shadow-lg mb-6 inline-block">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Create or Join Study Groups
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Form focused study groups with classmates or join existing ones based on your subjects and goals.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-lg mb-6 inline-block">
                <Share2 className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Share Notes & Resources
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload and share study materials, notes, and resources with your group members seamlessly.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg mb-6 inline-block">
                <MessageCircle className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real-time Chat & Fun Jam Breaks
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Stay connected with instant messaging and take fun breaks together to maintain focus and motivation.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg mb-6 inline-block">
                <Brain className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI-Powered Study Assistant
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized study recommendations, scheduling assistance, and smart insights to optimize your learning.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-200">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-3 shadow-lg">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Smart Scheduling</h4>
                <p className="text-gray-600">
                  Coordinate study sessions with AI-powered scheduling that finds the best times for everyone.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-200">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-3 shadow-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Progress Tracking</h4>
                <p className="text-gray-600">
                  Monitor your study progress and celebrate achievements with your group members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg mr-3">
                <Users className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold">StudyGroup+</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6 md:mb-0">
              <Link 
                href="/discover" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Discover
              </Link>
              <Link 
                href="/special/university" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Universities
              </Link>
              <Link 
                href="/profile" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Profile
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 StudyGroup+. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}