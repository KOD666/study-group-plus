import Link from "next/link";
import { Users, BookOpen, Calendar, Plus, Search, Clock, ChevronRight, GraduationCap, Target, Sparkles, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  // Mock data for demonstration
  const userGroups = [
    {
      id: 1,
      name: "Calculus Study Group",
      subject: "Mathematics",
      members: 8,
      nextSession: "Today, 3:00 PM",
      nextSessionDate: new Date("2025-06-28T15:00:00"),
      color: "from-blue-500 to-indigo-500",
      lastActivity: "2 hours ago",
      isActive: true
    },
    {
      id: 2,
      name: "Physics Problem Solving",
      subject: "Physics",
      members: 6,
      nextSession: "Tomorrow, 10:00 AM",
      nextSessionDate: new Date("2025-06-29T10:00:00"),
      color: "from-emerald-500 to-teal-500",
      lastActivity: "1 day ago",
      isActive: true
    },
    {
      id: 3,
      name: "Data Structures & Algorithms",
      subject: "Computer Science",
      members: 12,
      nextSession: "Monday, 2:00 PM",
      nextSessionDate: new Date("2025-06-30T14:00:00"),
      color: "from-purple-500 to-pink-500",
      lastActivity: "3 hours ago",
      isActive: false
    },
    {
      id: 4,
      name: "Organic Chemistry Lab",
      subject: "Chemistry",
      members: 5,
      nextSession: "Wednesday, 11:00 AM",
      nextSessionDate: new Date("2025-07-02T11:00:00"),
      color: "from-orange-500 to-red-500",
      lastActivity: "5 hours ago",
      isActive: false
    }
  ];

  const weeklyStats = {
    studyHours: 24,
    sessionsAttended: 7,
    notesShared: 15,
    upcomingSessions: 5
  };

  const upcomingEvents = [
    { title: "Calculus Quiz Review", time: "Today, 3:00 PM", type: "session", color: "blue" },
    { title: "Physics Lab Report Due", time: "Tomorrow, 11:59 PM", type: "deadline", color: "red" },
    { title: "CS Study Marathon", time: "Monday, 2:00 PM", type: "session", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Use the existing Navbar component */}
      <Navbar isAuthenticated={true} userName="Alex Chen" />

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-32 left-20 text-blue-600">
          <GraduationCap size={80} />
        </div>
        <div className="absolute top-48 right-32 text-indigo-600">
          <Users size={60} />
        </div>
        <div className="absolute bottom-32 left-32 text-slate-600">
          <BookOpen size={70} />
        </div>
        <div className="absolute bottom-20 right-20 text-blue-700">
          <Sparkles size={65} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            You have {upcomingEvents.length} upcoming sessions and {weeklyStats.notesShared} new shared notes to review.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3">
                <Clock className="text-white" size={20} />
              </div>
              <span className="text-sm text-green-600 font-medium">+12% this week</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{weeklyStats.studyHours}h</h3>
            <p className="text-gray-600 text-sm">Study Hours</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3">
                <Target className="text-white" size={20} />
              </div>
              <span className="text-sm text-blue-600 font-medium">This week</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{weeklyStats.sessionsAttended}</h3>
            <p className="text-gray-600 text-sm">Sessions Attended</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3">
                <Share2 className="text-white" size={20} />
              </div>
              <span className="text-sm text-purple-600 font-medium">New</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{weeklyStats.notesShared}</h3>
            <p className="text-gray-600 text-sm">Notes Shared</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3">
                <Calendar className="text-white" size={20} />
              </div>
              <span className="text-sm text-orange-600 font-medium">Coming up</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{weeklyStats.upcomingSessions}</h3>
            <p className="text-gray-600 text-sm">Upcoming Sessions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Groups Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Study Groups</h2>
              <Link
                href="/create"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus size={16} />
                <span>Create New Group</span>
              </Link>
            </div>

            <div className="space-y-4">
              {userGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`bg-gradient-to-r ${group.color} rounded-xl p-3 shadow-lg`}>
                        <BookOpen className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                          {group.isActive && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{group.subject}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users size={14} />
                            <span>{group.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>Next: {group.nextSession}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </div>
              ))}
            </div>

            {/* Discover Groups Button */}
            <div className="mt-6">
              <Link
                href="/discover"
                className="w-full bg-gradient-to-r from-slate-100 to-blue-100 hover:from-blue-100 hover:to-indigo-100 border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-2xl p-6 transition-all duration-200 flex items-center justify-center space-x-3 group"
              >
                <Search className="text-blue-600 group-hover:text-blue-700" size={20} />
                <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                  Discover More Study Groups
                </span>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      event.color === 'blue' ? 'bg-blue-500' :
                      event.color === 'red' ? 'bg-red-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                      <p className="text-gray-500 text-xs">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/create"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-2">
                    <Plus className="text-white" size={16} />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600">Create Study Group</span>
                </Link>
                
                <Link
                  href="/discover"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                >
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2">
                    <Search className="text-white" size={16} />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-emerald-600">Find Groups</span>
                </Link>
                
                <Link
                  href="/notes"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 transition-colors group"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
                    <BookOpen className="text-white" size={16} />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-purple-600">My Notes</span>
                </Link>
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles size={20} />
                <h3 className="font-bold">Study Streak</h3>
              </div>
              <p className="text-2xl font-bold mb-1">7 days</p>
              <p className="text-yellow-100 text-sm">Keep it up! You&apos;re on fire 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}