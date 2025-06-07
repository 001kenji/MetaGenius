import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch, connect } from 'react-redux';
import { showSuccess } from '../../utils/toast';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { CheckAuthenticated, logout,FetchLogout } from "../../actions/auth";

function Navbar({ theme,logout, toggleTheme }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserRefreshToken = useSelector((state) => state.auth.refresh)

  useEffect(() => {
      if(user != null) {
        navigate('/dashboard');
      }else {
        // navigate('/login');
      }
  },[user])
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    return () => setIsMobileMenuOpen(false);
  }, [navigate]);

  
  const handleLogout = async () => {
    var access  = localStorage.getItem('access')
    logout()
    // showSuccess('Logged out successfully.');
    FetchLogout(UserRefreshToken,access)
    navigate('/login');
  
  };
 
  return (
    <nav className={`  bg-white dark:bg-black shadow-md py-4 `} >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            MetaGenius
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-500 transition-colors">
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-500 transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="hover:text-blue-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-500 transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-500 transition-colors">
                Register
              </Link>
            </>
          )}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleTheme} 
            className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 py-2 shadow-lg">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="py-2 hover:text-blue-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="py-2 hover:text-blue-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-left hover:text-blue-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-2 hover:text-blue-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="py-2 hover:text-blue-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}



const mapStateToProps =  state => ({
  isAuthenticated:state.auth.isAuthenticated,
  
})    
export default connect(mapStateToProps, {CheckAuthenticated,logout,FetchLogout})(Navbar)
