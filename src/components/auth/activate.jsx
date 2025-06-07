import React, { useLayoutEffect, useState } from "react";

import { Navigate, useNavigate } from "react-router-dom";
import {connect, useDispatch, useSelector} from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { verify,resend_verification,CheckAuthenticated } from "../../actions/auth";
import { AiOutlineMail } from "react-icons/ai";
import Notifier from  "../common/notifier";
import { useForm } from "react-hook-form";
import {toast} from 'react-toastify'
import { FaUnlock, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { LOADING_USER } from "../../actions/types";
const Activate = ({verify,isAuthenticated,resend_verification}) => {
    const [verified, setverified] = useState(false)
    const {register, formState, handleSubmit, getValues, setValue,watch,reset} = useForm({
            defaultValues :{
                'email': ""
             },
             mode :'all'
        })
    const dispatch = useDispatch()
    const {errors, isValid,isDirty, isSubmitting, isSubmitted} = formState
    const { uid, token } = useParams();
    const [disableBtns, setDisableBtns] = useState(false)
    const HmEvent  = useSelector((state) => state.auth.notifierType)
    const [emailvalue,Setemailvalue] = useState('')
    const [Scope,SetScope] = useState('verify')
     const Theme = localStorage.getItem('theme') 
    const [SubmittingRequest,SetSubmittingRequest] = useState(false)
    const navigate = useNavigate();

    useLayoutEffect(() => {
       
        if(HmEvent != 'LOADING'){
         
            setDisableBtns(false)
        }else if(HmEvent == 'LOADING'){
            setDisableBtns(true)
          
        }
    },[HmEvent])
  
    // isauthenticated ? redirect to home page
    if (verified) {
        console.log('your are authenticated in the login sect')

        return <Navigate to="/login" replace />;
    } 
    function ToongleResend() {
        SetScope('resend')
    }
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
    const VerifyAccount = e => {
        const uidval = uid
        const tokenval = token
        verify(uidval, tokenval,navigate,ShowToast)
        SetSubmittingRequest(true)
        // setverified(true)
    }
    const onSubmitResendVerification = () => {
        const emailval = getValues('email')
        if(emailval != '' && emailval != null){
            // console.log(emailval)
            SetSubmittingRequest(true)
            ShowToast('info','Processing your request. Please wait')
            resend_verification(emailval,navigate,ShowToast)
        }
        
    };
   
    
    return (
        <div
        className="min-h-screen bg-transparent   py-12 px-4 sm:px-6 lg:px-8"
        >
        <div className="z-50 w-full h-fit">
            <Notifier />
        </div>

            <div className="max-w-md mx-auto bg-white dark:bg-black rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className={`${Scope == 'verify' ? '' : 'hidden'} p-8`}>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    </div>
                </div>

                <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Verify Your Account
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    We've sent a verification link to your email address. Please click the link to verify your account.
                </p>

                <div className="mb-6">
                    <Notifier />
                </div>

                <div className="flex flex-col space-y-4">
                    <button
                    disabled={disableBtns}
                    onClick={VerifyAccount}
                    className={`w-full flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                        disableBtns ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    >
                    {SubmittingRequest ? 'Processing...' : 'Verify Account'}
                    </button>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Didn't receive the email?
                    <button
                        className="ml-1 text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                        onClick={ToongleResend}
                    >
                        Resend verification
                    </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    If you're having trouble verifying your account, please contact our{' '}
                    <a href="/support" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                        support team
                    </a>
                    .
                    </p>
                </div>
                </div>

                <div className={`${Scope == 'resend' ? '' : 'hidden'} p-8`}>
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                    </div>
                </div>

                <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Resend Verification Email
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Enter your email address below and we'll send you a new verification link.
                </p>

                <form className="space-y-6">
                    <div className="space-y-1 w-full">
                    <label className="input w-full input-bordered flex items-center gap-2 bg-slate-200 dark:bg-slate-900 p-2 rounded-md border-slate-300 dark:border-slate-600">
                        <AiOutlineMail className="text-lg text-emerald-500" />
                        <input
                        id="LoginEmail"
                        {...register('email', {
                            required: 'Email is Required!',
                            pattern: {
                            value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Please enter a valid email',
                            },
                        })}
                        name="email"
                        className="grow placeholder-slate-400 dark:placeholder-slate-300 w-full text-slate-800  dark:text-slate-200"
                        placeholder="Email"
                        type="email"
                        />
                    </label>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>}
                    </div>

                    <div>
                    <button
                        type="button"
                        onClick={onSubmitResendVerification}
                        disabled={isSubmitting}
                        className={`w-full flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {SubmittingRequest ? (
                        <>
                            <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                            </svg>
                            Sending...
                        </>
                        ) : (
                        'Resend Verification Email'
                        )}
                    </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Already verified?{' '}
                    <a href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
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
    isAuthenticated:state.auth.isAuthenticated,
    
})    

export default connect(mapStateToProps, {verify,resend_verification})(Activate);