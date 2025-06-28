"use client"

import Link from "next/link";
import { useState } from "react";
import { Users, Search, Plus, User, LogOut, Bell } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export default function Navbar({ isAuthenticated = false, userName = "User" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg group-hover:shadow-xl transition-all duration-200">
                <Users className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">
                StudyGroup<span className="text-blue-600">+</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                // Authenticated Navigation
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/discover"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-50 flex items-center space-x-1"
                  >
                    <Search size={16} />
                    <span>Discover</span>
                  </Link>
                  <Link
                    href="/create"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Create Group</span>
                  </Link>
                </>
              ) : (
                
                <>
                  <Link
                    href="/discover"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-50"
                  >
                    Discover
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3">
              
              <button className="text-gray-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 relative">
                <Bell size={20} />
                
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-medium">{userName}</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        // Add logout logic here
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

        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
              {isAuthenticated ? (
                // Authenticated Mobile Navigation
                <>
                  <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">View profile</p>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/discover"
                    className="text-gray-700 hover:text-blue-600  px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-blue-50 flex items-center space-x-2"
                    onClick={closeMobileMenu}
                  >
                    <Search size={18} />
                    <span>Discover Groups</span>
                  </Link>
                  <Link
                    href="/create"
                    className="text-gray-700 hover:text-blue-600  px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-blue-50 flex items-center space-x-2"
                    onClick={closeMobileMenu}
                  >
                    <Plus size={18} />
                    <span>Create Group</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    Profile Settings
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <button
                      className="w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-red-50 flex items-center space-x-2"
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
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    Discover Groups
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-blue-50"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white block px-3 py-2 rounded-lg text-base font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg mx-3 my-2 text-center"
                    onClick={closeMobileMenu}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
}