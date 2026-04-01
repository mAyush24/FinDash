import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ReceiptText, Users as UsersIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">FinDash</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              {['admin', 'analyst'].includes(user?.role) && (
                <Link to="/records" className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <ReceiptText size={18} /> Records
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/users" className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <UsersIcon size={18} /> Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
