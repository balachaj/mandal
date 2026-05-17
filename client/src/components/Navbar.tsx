import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, Menu, UserCircle, PlusSquare } from 'lucide-react';

const Navbar = ({ user }: { user?: any }) => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg">
              <img src="/logo.png" alt="Mandal Logo" className="h-10 w-auto object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Mandal</span>
          </div>
          
          <div className="hidden sm:flex space-x-8">
            <NavLink 
              to="/request" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`
              }
            >
              Request Help
            </NavLink>
            <NavLink 
              to="/event" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`
              }
            >
              Communal Event
            </NavLink>
            <NavLink 
              to="/feed" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`
              }
            >
              Open Tasks
            </NavLink>
            <NavLink 
              to="/create" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`
              }
            >
              <div className="flex items-center space-x-1">
                <PlusSquare size={16} />
                <span>New Mandal</span>
              </div>
            </NavLink>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`
              }
            >
              Admin
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-tighter">In Mandal</span>
                <UserCircle size={20} className="text-indigo-600" />
              </div>
            ) : (
              <NavLink to="/join/demo" className="text-gray-400 hover:text-gray-600 transition">
                <UserCircle size={28} />
              </NavLink>
            )}
            <button className="sm:hidden text-gray-500">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
