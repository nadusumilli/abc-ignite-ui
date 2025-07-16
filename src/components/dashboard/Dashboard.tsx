'use client';

import { useState } from 'react';
import { Calendar, Users, BookOpen, BarChart3, Plus, Search, User } from 'lucide-react';
import ClassesSection from './ClassesSection';
import BookingsSection from './BookingsSection';
import StatisticsSection from './StatisticsSection';
import InstructorsSection from './InstructorsSection';
import CreateClassModal from '../modals/CreateClassModal';
import CreateBookingModal from '../modals/CreateBookingModal';
import CreateInstructorModal from '../modals/CreateInstructorModal';
import SearchModal from '../modals/SearchModal';

type TabType = 'classes' | 'bookings' | 'instructors' | 'statistics';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('classes');
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [isCreateInstructorOpen, setIsCreateInstructorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const tabs = [
    {
      id: 'classes' as TabType,
      label: 'Classes',
      icon: BookOpen,
      count: 0, // Will be populated by the component
    },
    {
      id: 'bookings' as TabType,
      label: 'Bookings',
      icon: Calendar,
      count: 0, // Will be populated by the component
    },
    {
      id: 'instructors' as TabType,
      label: 'Instructors',
      icon: User,
      count: 0, // Will be populated by the component
    },
    {
      id: 'statistics' as TabType,
      label: 'Statistics',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">ABC Ignite</h1>
                <p className="text-sm text-gray-600">Gym Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              
              <button
                onClick={() => setIsCreateInstructorOpen(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>New Instructor</span>
              </button>
              
              <button
                onClick={() => setIsCreateClassOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Class</span>
              </button>
              
              <button
                onClick={() => setIsCreateBookingOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>New Booking</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'classes' && <ClassesSection />}
        {activeTab === 'bookings' && <BookingsSection />}
        {activeTab === 'instructors' && <InstructorsSection />}
        {activeTab === 'statistics' && <StatisticsSection />}
      </main>

      {/* Modals */}
      <CreateClassModal
        isOpen={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
      />
      
      <CreateBookingModal
        isOpen={isCreateBookingOpen}
        onClose={() => setIsCreateBookingOpen(false)}
      />
      
      <CreateInstructorModal
        isOpen={isCreateInstructorOpen}
        onClose={() => setIsCreateInstructorOpen(false)}
      />
      
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
} 