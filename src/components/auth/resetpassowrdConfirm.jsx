import React, { useLayoutEffect, useState } from "react";
import '../../App.css'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useForm} from 'react-hook-form'
import {connect, useSelector} from 'react-redux'
import { FaUnlock } from "react-icons/fa";
import Notifier from "../common/notifier";
const ResetPasswordConfirm = ({ match}) => {
    const [requestsent, setrequestsent] = useState(false)
    const {register, handleSubmit, watch, reset, formState} = useForm({
        defaultValues :{
            'new_password':'',
            're_new_password': ''
        },
        mode : 'all'
    })
    const Theme = useSelector((state)=> state.auth.Theme)
    const {errors, isValid, isDirty, isSubmitting} = formState
    const [disableBtns, setDisableBtns] = useState(false)
    const HmEvent  = useSelector((state) => state.auth.notifierType)
   const [IsProcessingRequest,SetIsProcessingRequest] = useState(false)
   const navigate = useNavigate();
    useLayoutEffect(() => {
       
        if(HmEvent != 'LOADING'){
            
            setDisableBtns(false)
        }else if(HmEvent == 'LOADING'){
            setDisableBtns(true)
            
        }
    },[HmEvent])

    function ShowToast(type, message, progress = null) {
            if (type != null && message != null) {
                // If progress is provided (format: "current/total"), add it to the message
                let toastMessage = message;
                if (progress) {
                    const [current, total] = progress.split('/');
                    if (current && total) {
                        toastMessage = `(${current}/${total}) ${message}`;
                    }
                }
        
                const toastOptions = {
                    type: type,
                    theme: Theme,
                    position: 'top-right',
                    // Add progress bar if it's a progress notification
                    ...(progress && {
                        progressStyle: { backgroundColor: type === 'success' ? '#4CAF50' : 
                                        type === 'error' ? '#F44336' :
                                        type === 'warning' ? '#FFC107' : '#2196F3' },
                        autoClose: false // Keep open until manually closed for progress toasts
                    })
                };
        
                // Return the toast ID so you can update or close it later
                return toast(toastMessage, toastOptions);
            }
            return null;
    }

    const reset_passoword_confirm = (uid,token, new_password, re_new_password) => {
      
        const toastid = ShowToast('info','Processing your request. Please hold','1/2')

        const body = JSON.stringify({
            "uid": uid,
            'token' : token,
            //'token': localStorage.getItem('access'),
            'new_password': new_password,
            're_new_password': re_new_password
        });
        //console.log(body)
        function Reset_Responser_Confirm(props) {
            
            const data = props != '' ? JSON.parse(props) : ''
            //console.log(data)
            if(!data ) {
                SetIsProcessingRequest(false)
                reset()
                toast.update(toastid,{
                    render : 'Account password is reset successfuly. You may now log in',
                    type : 'success'
                })
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }else {
                var obj = Object.keys(data)
                var response = obj[0]
                var feeds = data[response]
                SetIsProcessingRequest(false)
                toast.update(toastid,{
                    render : String(feeds),
                    type : 'warning'
                })
            }
    
        }
    
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: body,
                redirect: 'follow'
              };
            //const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/jwt/create/`,config, body );
            fetch(`${import.meta.env.VITE_APP_API_URL}/auth/users/reset_password_confirm/`, requestOptions)
            .then(response => response.text())
            .then(result => Reset_Responser_Confirm(result))
            .catch(error => {
                SetIsProcessingRequest(false)
                toast.update(toastid,{
                    render : 'Seams like there was an issue processing your request. Try again later.',
                    type : 'success'
                })
            });
            
        }catch(err) {
            SetIsProcessingRequest(false)
            toast.update(toastid,{
                render : 'Seams like there was an issue processing your request. Try again later.',
                type : 'success'
            })
    
        }
    }
   
    const { uid, token } = useParams();
    function SubmitResConfirm (dataval) {
        const uidval = uid
        const tokenval = token
        SetIsProcessingRequest(true)
        reset_passoword_confirm(uidval, tokenval, dataval.new_password, dataval.re_new_password)
        setrequestsent(true)
    }
    
    
    return(
        <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
  <div className="z-50 w-full h-fit">
    <Notifier />
  </div>

  <div className="max-w-md mx-auto bg-white dark:bg-black rounded-xl shadow-md overflow-hidden md:max-w-2xl">
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="bg-blue-100 dark:bg-slate-800 p-4 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-gray-100 mb-2">
        Reset Your Password
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
        Please enter your new password below.
      </p>

      <form noValidate className="space-y-6" onSubmit={handleSubmit(SubmitResConfirm)}>
        <div className="space-y-1 w-full">
          <label className="input w-full input-bordered flex items-center gap-2 p-2 rounded-md bg-slate-200 dark:bg-slate-900   border-slate-300 dark:border-slate-600">
            <FaUnlock className="text-lg text-blue-500 dark:text-blue-400" />
            <input
              {...register('new_password', {
                required: 'Password is Required!',
                minLength: {
                  value: 5,
                  message: 'Password must be at least 5 characters',
                },
              })}
              name="new_password"
              id="password"
              className="grow placeholder-slate-400 dark:placeholder-slate-300 w-full text-slate-800 dark:text-slate-200"
              placeholder="New Password"
              type="password"
            />
          </label>
          {errors.new_password && (
            <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
          )}
        </div>

        <div className="space-y-1 w-full">
          <label className="input w-full input-bordered flex items-center gap-2  p-2 rounded-md bg-slate-200 dark:bg-slate-900   border-slate-300 dark:border-slate-600">
            <FaUnlock className="text-lg text-blue-500 dark:text-blue-400" />
            <input
              {...register('re_new_password', {
                required: true,
                validate: (val) => {
                  if (watch('new_password') != val) {
                    return 'Your passwords do not match';
                  }
                },
              })}
              name="re_new_password"
              className="grow placeholder-slate-400 dark:placeholder-slate-300 w-full text-slate-800 dark:text-slate-200"
              placeholder="Confirm New Password"
              type="password"
            />
          </label>
          {errors.re_new_password && (
            <p className="text-red-500 text-sm mt-1">{errors.re_new_password.message}</p>
          )}
        </div>

        <button
          disabled={
            !isDirty ||
            !isValid ||
            isSubmitting ||
            disableBtns ||
            IsProcessingRequest
          }
          type="submit"
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
            !isDirty ||
            !isValid ||
            isSubmitting ||
            disableBtns ||
            IsProcessingRequest
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
        >
          {isSubmitting || IsProcessingRequest ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Remember your password?{' '}
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  </div>
</div>

    )


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated
})    


export default connect(mapStateToProps, null)(ResetPasswordConfirm);