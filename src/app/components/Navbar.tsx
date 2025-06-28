"use client"

import Link from "next/link";
import { useState } from "react";
import { Users, Search, Plus, User, LogOut, Bell, Menu, X } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export default function Navbar({ isAuthenticated = false, userName = "User" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <Users className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">
                StudyGroup<span className="text-blue-600">+</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-blue-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/discover"
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-blue-50 flex items-center space-x-1"
                  >
                    <Search size={16} />
                    <span>Discover</span>
                  </Link>
                  <Link
                    href="/create"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-1 hover:scale-105"
                  >
                    <Plus size={16} />
                    <span>Create Group</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/discover"
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-blue-50"
                  >
                    Discover
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-blue-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3">
              <button className="text-gray-500 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-all duration-200 relative group">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Notifications
                </div>
              </button>
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-medium">{userName}</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 backdrop-blur-sm">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                      onClick={closeProfileDropdown}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                      onClick={closeProfileDropdown}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                      onClick={closeProfileDropdown}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-2 rounded-lg mx-2"
                      onClick={() => {
                        closeProfileDropdown();
                        console.log('Logout clicked');
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-100 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">View profile</p>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/discover"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-blue-50 flex items-center space-x-2"
                    onClick={closeMobileMenu}
                  >
                    <Search size={18} />
                    <span>Discover Groups</span>
                  </Link>
                  <Link
                    href="/create"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-blue-50 flex items-center space-x-2"
                    onClick={closeMobileMenu}
                  >
                    <Plus size={18} />
                    <span>Create Group</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    Profile Settings
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <button
                      className="w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-red-50 flex items-center space-x-2"
                      onClick={() => {
                        closeMobileMenu();
                        console.log('Logout clicked');
                      }}
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/discover"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    Discover Groups
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <div className="px-3 py-2">
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white block px-4 py-3 rounded-xl text-base font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg text-center"
                      onClick={closeMobileMenu}
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeProfileDropdown}
        ></div>
      )}
    </nav>
  );
}