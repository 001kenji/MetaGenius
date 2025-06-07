import { useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { showError, showSuccess, ShowToast } from '../../utils/toast';
import { FaGoogle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { signupAuth,CheckAuthenticated ,googleAuthenticate} from "../../actions/auth";
const  RegisterForm = ({isAuthenticated,signupAuth}) => {
  const {register,handleSubmit, getValues,formState: { errors, isSubmitting },    watch   } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    },
    mode: 'onChange'
  });

  const googleButtonRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const password = watch('password');
  const isFormValid = watch('name') && watch('email') && password && 
                     watch('confirmPassword') === password && 
                     watch('agreeTerms') && 
                     !errors.name && !errors.email && !errors.password;

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
      text: 'signup_with',
      size: 'large',
      locale: 'en',
      logo_alignment: 'left',
      width: '100%',
    });
  };

  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      showError('Google sign-up failed. Please try again.');
      return;
    }

    try {
      // await dispatch(loginWithGoogle({ credential: response.credential })).unwrap();
      showSuccess('Successfully signed up with Google!');
      navigate('/dashboard');
    } catch (error) {
      showError(error || 'Google sign-up failed. Please try again.');
    }
  };

  const onSubmit = async (data) => {
   
    signupAuth(getValues('name'),getValues('email'),getValues('password'), getValues('confirmPassword'),ShowToast);

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
        Create your account
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
            Full name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            className="w-full px-4 py-2  bg-slate-50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600  bg-slate-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600  bg-slate-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Create a password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => 
                value === password || 'Passwords do not match'
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600  bg-slate-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        
        <div className="flex items-start">
          <input
            id="agreeTerms"
            type="checkbox"
            {...register('agreeTerms', {
              required: 'You must agree to the terms to register'
            })}
            className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600  bg-slate-50 dark:bg-gray-700"
          />
          <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            I agree to the{' '}
            <Link to="/terms" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms.message}</p>}
        
        <div>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              !isFormValid || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
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
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const mapStateToProps =  state => ({
  isAuthenticated:state.auth.isAuthenticated
})    


export default connect(mapStateToProps, { signupAuth, googleAuthenticate})(RegisterForm);