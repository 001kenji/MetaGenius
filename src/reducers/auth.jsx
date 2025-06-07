import {
LOGIN_SUCCESS,
LOGIN_FAIL,
USER_LOADED_SUCCESS,
USER_LOADED_FAIL,
AUTHENTICATED_FAIL,
AUTHENTICATED_SUCCESS,
LOGOUT,
ACTIVATION_SUCCESS,
ACTIVATION_FAIL,
REFRESH_SUCCESS,
REFRESH_FAIL,
csrf_SUCCESS,
csrf_FAIL,
LOADING_USER,
SUCCESS_EVENT,
FAIL_EVENT,
NOTIFIER_STATUS,
INTERCEPTER,
ToogleTheme,
ShowLoginContainerReducer,
PageToogleReducer,
SubscriptionPaymentStatusReducer,
RealoadUserAuthReducer,
IsloadingPricingPaymentReducer,
GOOGLE_AUTH_SUCCESS,
GOOGLE_AUTH_FAIL,
WARNING_EVENT
}from '../actions/types'


const date = new Date()
const min = date.getMinutes()
const initialState = {
    access:  localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    RealoadUserAuth : false,
    isAuthenticated:null,
    user : null,
    Expire : null,
    notifierType : 'null',
    notifierMessage : 'null',
    nofifierStatus :true,
    Theme : 'dark',
    Page : '',
    ShowLoginContainer : true,
    SubscriptionPaymentStatus : {},
    IsloadingPricingPayment : false

};
//console.log(min)
// the function bellow can be imported from any file using any name since we have exported it as default and we have not assigned a name to it

export default function (state = initialState, action) {

  
    const { type, payload} = action;
        // {<Notifier   />}
       
    const currentTime = new Date();
        const minutesToAdd = 1;
        const newTime = new Date(currentTime);
        newTime.setMinutes(currentTime.getMinutes() + minutesToAdd);

        //console.log('fired')
    switch (type) {
        
        case LOGIN_SUCCESS: 
        localStorage.setItem('access', payload.access)
        
        //console.log('written data - access:', localStorage.getItem('access'))
        //console.log('data writen refresh :',payload.refresh)
            return {
                ...state,
                isAuthenticated : true,
                access :payload.access,
                refresh :payload.refresh,
                Expire : newTime.toLocaleTimeString(),
            }
        case REFRESH_SUCCESS:
            localStorage.setItem('access', payload.access)
            return{
                ...state,
                access: payload.access,
                Expire: newTime.toLocaleTimeString(),                
                notifierType : 'SUCCESS',
                notifierMessage : 'SUCCESS'
            }
        case SubscriptionPaymentStatusReducer :
                return {
                    ...state,
                    SubscriptionPaymentStatus : payload
                }
        case USER_LOADED_SUCCESS:
            //{<home profile={initialState}   />}
            //console.log('data manager:', payload.is_active)
            
            return {
                ...state,
                user: payload,
            }
        
        case AUTHENTICATED_SUCCESS :
            return {
                ...state,
                isAuthenticated : true
            }
        case RealoadUserAuthReducer :
                return {
                    ...state,
                    RealoadUserAuth : payload
                }
        case AUTHENTICATED_FAIL :
            return {
                ...state,
                isAuthenticated : false
            }
        case IsloadingPricingPaymentReducer :
                return {
                    ...state,
                    IsloadingPricingPayment : payload
                }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null

            }
        case ShowLoginContainerReducer:
            return {
                ...state,
                ShowLoginContainer : payload
            }
        case LOGIN_FAIL:
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state,
                isAuthenticated: null,
                refresh: null,
                access:null,
                user: null,
            }
        case ToogleTheme:
            return {
                ...state,
                Theme : payload
            }
        
        case GOOGLE_AUTH_FAIL:
        case LOGOUT:
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state,
                isAuthenticated: null,
                refresh: null,
                access:null,
                user: null,
                Expire : null,
                notifierType : 'SUCCESS',
                notifierMessage :  payload ? payload : 'FAIL'

            }
        case GOOGLE_AUTH_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated : true,
                access: payload.access,
                refresh: payload.refresh
            }
      
        case LOADING_USER : 
            return {
                ...state,
                notifierType : 'LOADING',
                notifierMessage : payload ? payload : 'Loading ...',
                nofifierStatus : false
            }
        case NOTIFIER_STATUS:
            
            return {
                ...state,
                nofifierStatus : payload
            }
        case REFRESH_FAIL:
            return {
                ...state,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'FAIL'
            }
        case SUCCESS_EVENT:
            
            return {
                ...state,
                notifierType : 'SUCCESS',
                notifierMessage : payload ? payload : 'SUCCESS'
            }
        case WARNING_EVENT:
            
            return {
                ...state,
                notifierType : 'WARNING',
                notifierMessage : payload ? payload : ''
            }
        case FAIL_EVENT:
            return {
                ...state,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'FAIL'
            }
       
        
        case ACTIVATION_SUCCESS:
            return {
                ...state,
                notifierType : 'SUCCESS',
                notifierMessage : payload ? payload : 'ACTIVATION SUCCESS'
            }
        
        case INTERCEPTER:
            return {
                ...state,
               
            }
        case csrf_SUCCESS:
            return {
                ...state,
                notifierType : state.notifierType == 'LOADING' ? 'LOADING' :'INTERCEPT',
                notifierMessage : state.notifierMessage == 'LOADING' ? 'LOADING' :'null'
            }
        case csrf_FAIL:
            return {
                ...state,
                notifierType : state.notifierType == 'LOADING' ? 'LOADING' :'INTERCEPT',
                notifierMessage : state.notifierMessage == 'LOADING' ? 'LOADING' :'null'
            }
        case PageToogleReducer:
            return {
                ...state,
                Page : payload
            }
       
        default:
            return state
    }

   
}