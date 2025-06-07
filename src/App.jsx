import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch, connect } from 'react-redux';
import { MetadataProvider } from './contexts/MetadataContext';
import { CheckAuthenticated, logout,FetchLogout, load_user,GetCSRFToken } from "./actions/auth";
import { AuthProvider } from './contexts/AuthContext';
// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginForm from './components/auth/LoginForm'
import Activate from './components/auth/activate'
import ResetPasswordConfirm from './components/auth/resetpassowrdConfirm'
import ResendActivate from './components/auth/resend_activate'
import RegisterForm from './components/auth/RegisterForm'
import { RealoadUserAuthReducer } from './actions/types';
import NotFoundPage from './pages/404';
// Protected route component using Redux
const ProtectedRoute = ({ children,isAuthenticated }) => {

  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the attempted url
    
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};

function App({logout,FetchLogout ,isAuthenticated,load_user,GetCSRFToken}) {
  const [theme, setTheme] = useState('light');
  const dispatch = useDispatch();
 
  const UserRefreshToken = useSelector((state) => state.auth.refresh)
  const RealoadUserAuth = useSelector((state) => state.auth.RealoadUserAuth)

 
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

 

  useEffect(() => {
      var local_access = String(localStorage.getItem('access'))
      // console.log(local_access)
      // console.log('triggered')
      GetCSRFToken()
      if(UserRefreshToken || RealoadUserAuth == true || (local_access != 'undefined' && local_access != '' && local_access != 'null' && local_access)){
          //console.log('loading')
        
          var toastid = null
          
          
          CheckAuthenticated();
          load_user(toastid,false);
         
          
          dispatch({
              type : RealoadUserAuthReducer,
              payload : false
          })
      }
      
  },[UserRefreshToken,RealoadUserAuth])

  function ToogleLogout () {
    var access  = localStorage.getItem('access')
    logout()
    FetchLogout(UserRefreshToken,access)
} 

  const toggleTheme = () => {
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Router>
      <AuthProvider>
      <MetadataProvider>
        <div className={` ${theme} flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 transition-colors duration-300`}>
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} >
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route exact path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
              <Route exact path='/activate/:uid/:token' element={<Activate />} />
              <Route exact path='/resend_activate' element={<ResendActivate />} />
              <Route path="*" element={<NotFoundPage />} />
            
            </Routes>
          </main>
          <Footer />
        </div>
        
      </MetadataProvider>
      </AuthProvider>
    </Router>
  );
}

// export default App;

const mapStateToProps =  state => ({
  isAuthenticated:state.auth.isAuthenticated,
  
})    
export default connect(mapStateToProps, {CheckAuthenticated,logout,FetchLogout,load_user,GetCSRFToken})(App)
