import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ReceiptText, Users as UsersIcon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo linked to Dashboard */}
            <Link to="/" onClick={closeMenu} className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">FinDash</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-8 items-center space-x-2">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              {['admin', 'analyst'].includes(user?.role) && (
                <Link to="/records" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname.startsWith('/records') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}>
                  <ReceiptText size={18} /> Records
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/users" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname.startsWith('/users') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}>
                  <UsersIcon size={18} /> Users
                </Link>
              )}
            </div>
          </div>
          
          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
              <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">{user?.role}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="ml-4 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-blue-600 focus:outline-none p-2 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg absolute w-full z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={closeMenu} className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 transition-colors ${location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}>
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            {['admin', 'analyst'].includes(user?.role) && (
              <Link to="/records" onClick={closeMenu} className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 transition-colors ${location.pathname.startsWith('/records') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}>
                <ReceiptText size={20} /> Records
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/users" onClick={closeMenu} className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 transition-colors ${location.pathname.startsWith('/users') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}>
                <UsersIcon size={20} /> Users
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="text-base font-semibold text-gray-900">{user?.name}</div>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{user?.role}</div>
              </div>
            </div>
            <div className="mt-4 px-4">
              <button
                onClick={() => { closeMenu(); logout(); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-base font-medium text-red-600 bg-white hover:bg-red-50 rounded-xl transition-colors shadow-sm"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
