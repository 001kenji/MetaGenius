import { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { showError, showSuccess, ShowToast } from '../../utils/toast';
import { FaGoogle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { login ,CheckAuthenticated,googleAuthenticate} from "../../actions/auth";
function LoginForm({login,isAuthenticated}) {
  const { register,getValues,reset, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all'
  });

  const [rememberMe, setRememberMe] = useState(false);
  const googleButtonRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = watch('email');
  const password = watch('password');
  const isFormValid = email && password && !errors.email && !errors.password;

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const initializeGoogleSignIn = () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      cancel_on_tap_outside: true,
      ux_mode: 'popup',
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: 'standard',
      shape: 'rectangular',
      theme: 'outline',
      text: 'signin_with',
      size: 'large',
      locale: 'en',
      logo_alignment: 'left',
      width: '100%',
    });

    window.google.accounts.id.prompt();
  };

  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      showError('Google sign-in failed. Please try again.');
      return;
    }

    try {
      await dispatch(loginWithGoogle({ credential: response.credential })).unwrap();
      showSuccess('Successfully signed in with Google!');
      navigate('/dashboard');
    } catch (error) {
      showError(error || 'Google sign-in failed. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    
    login(getValues('email'), getValues('password'),ShowToast)
    reset()
    
    // navigate('/dashboard');
   
  };

  const ContinueWithGoogle = async () => {
    try {
      const backendurl = import.meta.env.VITE_API_URL;
      const frontend = import.meta.env.VITE_FRONTEND_URL;
      
      const response = await fetch(`${backendurl}/auth/o/google-oauth2/?redirect_uri=${encodeURIComponent(frontend)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken') || '',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      window.location.replace(data.authorization_url);
    } catch (err) {
      console.error('Google auth error:', err);
      showError('Failed to initiate Google login. Try again later');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Sign in to your account
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please enter a valid email',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 3,
                message: 'Password must be at least 3 characters'
              }
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              !isFormValid || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-3">
          <div ref={googleButtonRef} className="w-full"></div>
          <button 
            onClick={ContinueWithGoogle}  
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-300 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-300 dark:border-gray-600"
          >
            <FaGoogle className="text-blue-500" /> Continue with Google (Alternative)
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}


const mapStateToProps =  state => ({
  isAuthenticated:state.auth.isAuthenticated
})    


export default connect(mapStateToProps, { login,googleAuthenticate})(LoginForm);