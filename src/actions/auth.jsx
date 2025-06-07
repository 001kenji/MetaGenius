
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    REFRESH_SUCCESS ,
    REFRESH_FAIL,
    csrf_SUCCESS,
    csrf_FAIL,
    LOADING_USER,
    SUCCESS_EVENT,
    FAIL_EVENT,
    GOOGLE_AUTH_FAIL,
    GOOGLE_AUTH_SUCCESS,
    ShowLoginContainerReducer,
    PageToogleReducer,
    WARNING_EVENT
    }from './types'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';



// Helper function to extract error message from Djoser response
function extractErrorMessage(errorData) {
    if (!errorData) return 'Unknown error occurred';
    
    // Djoser typically returns errors in this format
    if (typeof errorData === 'object') {
        // Handle non-field errors
        if (errorData.non_field_errors) {
            return errorData.non_field_errors.join(', ');
        }
        
        // Handle field-specific errors
        const firstErrorKey = Object.keys(errorData)[0];
        if (firstErrorKey) {
            const errorMessages = errorData[firstErrorKey];
            if (Array.isArray(errorMessages)) {
                return `${firstErrorKey}: ${errorMessages.join(', ')}`;
            }
            return `${firstErrorKey}: ${errorMessages}`;
        }
    }
    
    // Fallback for other error formats
    return typeof errorData === 'string' ? errorData : 'Failed to resend verification email';
}

export const GetCSRFToken = () => async dispatch => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/cred/csrfToken/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `JWT ${localStorage.getItem('access')}`
            },
            credentials: "include", // Ensure cookies are sent
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json(); // Ensure JSON parsing
        //console.log("CSRF Response:", res);

        if (res.Success === "CSRF cookie set") {
            Cookies.set("Inject", res.encryptedToken, {
                path: "/",
                secure: false,
                httponly: false,
                sameSite: "Lax",
                domain: 'localhost'
            });
            // Cookies.set("Inject", res.encryptedToken, {
            //     path: "/",
            //     secure: true,
            //     sameSite: "None",
            // });
        }
    } catch (error) {
        console.error("CSRF Fetch Error:", error);
        dispatch({ type: csrf_FAIL });
    }
};
    
export const load_user = (toastid,googleAuth=false) =>  async dispatch => {

    
    
    function LoaderResponse(props) {
        const data = JSON.parse(props)
        // console.log('user data request is', data)
        
       if(data.code){
            if(data.code == 'token_not_valid'){
                dispatch({
                    type : LOGOUT,
                    payload : data
                })
               
            }
       }else {
            dispatch({
                type : USER_LOADED_SUCCESS,
                payload : data
            })
            if(googleAuth && toastid != null) {
                    toast.update(toastid,{
                    render : 'Logged in successfuly',
                    type : 'success'
                })
            }
           
       }      
       
    }
    //console.log(localStorage.getItem('access'), typeof(localStorage.getItem('access')))
    if (localStorage.getItem('access')  != 'undefined'){
            //console.log('making the loaduser request')
       
        try {
           //const res = await axios.get(`${process.env.VITE_API_URL}/auth/users/me/`, config);
            //myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'GET',
                headers: {
                            'Content-Type' : 'application/json',
                            'Authorization' : `JWT ${localStorage.getItem('access')}`,
                            'Accept' : 'application/json'
                        },
            
                redirect: 'follow'
            };
            //const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`,config, body );
            fetch(`${import.meta.env.VITE_API_URL}/auth/users/me/`, requestOptions)
            .then(response => response.text())
            .then(result => LoaderResponse(result))
            .catch(error => {
                //console.error('There has been a problem with your fetch operation:', error);
                dispatch({
                  type: USER_LOADED_FAIL,
                  payload : 'An issue has occur. Try again later'
                });
            });
           

            
        }catch(err) {
            //console.log('error of loaduser is: ' ,err)
            dispatch ({
                type: USER_LOADED_FAIL,
                payload : 'An issue has occur. Try again later'
            })
    
        }
    
    }
    else {
        dispatch ({
            type: USER_LOADED_FAIL,
            payload : 'An issue has occur. Try again later'
        })

    }
    

}
// console.log(Cookies.get('Inject'))

export const googleAuthenticate = (state, code,ShowToast) => async dispatch => {
    if (!(state && code) || localStorage.getItem('access')) return;
    var toastid = ShowToast('info','Processing deatils, please hold.','1/3')

    try {

        
      const formData = new URLSearchParams();
      formData.append('state', state);
      formData.append('code', code);
      console.log(document.cookie);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': Cookies.get('Inject') || '',
            'Cookie' : `sessionid=${Cookies.get('Inject') || ''}`,
            'Accept': 'application/json',
          },
          body: formData,
        }
      );
    //   console.log('got response',response)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OAuth error:', errorData);
        toast.update(toastid,{
            render : 'Seams like there was an issue while processing details. Try agian later',
            type : 'warning'
        })
       
        dispatch({
            type : ShowLoginContainerReducer,
            payload : true
        })
       
      }
      
      const data = await response.json();
      console.log(data)
      // Store tokens
      
      console.log('dispathing gogle')
      dispatch({ 
        type: GOOGLE_AUTH_SUCCESS, 
        payload: {
            access: data.access,
            refresh: data.refresh,
        }
      });
      toast.update(toastid,{
            render : 'Account verified. Loging in please hold. ',
            type : 'info'
        })
    // const toastid = ShowToast('info','Account verified. Loging in please hold.','1/2')  
    //   console.log('dispathing llaod user')
      dispatch(load_user(toastid,true));
  
    } catch (err) {
    //   console.error('Google auth error:', err);
      toast.update(toastid,{
            render : 'There was an issue with authentication. Please try again.',
            type : 'warning'
        })
     
    }
};

export const CheckAuthenticated = () => async dispatch => {
    if(localStorage.getItem('access')) {

        function AuthFunc(data) {
            const res = JSON.parse(data)
           if(res.code != 'token_not_valid'){
               // console.log('authenitcated')
                dispatch ({
                    type: AUTHENTICATED_SUCCESS
                })
                
            
            } else {
                //console.log(' not authenticated')
                dispatch ({
                    type: AUTHENTICATED_FAIL
                })
            }
        }
        

        try{
            var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('Accept', 'application/json')
        myHeaders.append( 'Authorization', `JWT ${localStorage.getItem('access')}`)
        var raw = JSON.stringify({
            "token": String(localStorage.getItem('access'))
          });
          
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          
        //const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`,config, body );
        fetch(`${import.meta.env.VITE_API_URL}/auth/jwt/verify/`, requestOptions)
        .then(response => response.text())
        .then(result => AuthFunc(result))
        .catch(error => {
            //console.error('There has been a problem with your fetch operation:', error);
            dispatch({
              type: AUTHENTICATED_FAIL,
            });
        });
             
         }catch(err) {
             //console.log(err)
             dispatch ({
                 type: AUTHENTICATED_FAIL
             })
     
         }



    }else {
        dispatch({
            type : AUTHENTICATED_FAIL
        })
    }

}

export const RefreshRequest = (refreshtoken) => async dispatch => {
    
    dispatch({
        type:LOADING_USER
    })
    if(localStorage.getItem('access')) {

        function AuthFunc(data) {
            const res = JSON.parse(data)
            //console.log(res)
           if(res.code != 'token_not_valid'){
               //console.log('authenitcated')
                dispatch ({
                    type: REFRESH_SUCCESS,
                    payload: res
                })
                
                return true;
            } else {
                var obj = Object.keys(res)
                var response = obj[0]
                var code = obj[1]
                var feeds = res[response]
                var feeds2 = res[code]
                //console.log(feeds,feeds2)
                dispatch({
                    type : REFRESH_FAIL,
                    payload : String(response+ ": "+ String(feeds) )
                })
                

                return false
            }
        }
        

        try{
            var myHeaders = new Headers();
            //console.log(refreshtoken)
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('Accept', 'application/json')
        myHeaders.append( 'Authorization', `JWT ${localStorage.getItem('access')}`)
        var raw = JSON.stringify({
            "refresh": String(refreshtoken)
          });
          
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          
        //const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`,config, body );
        fetch(`${import.meta.env.VITE_API_URL}/auth/jwt/refresh/`, requestOptions)
        .then(response => response.text())
        .then(result => AuthFunc(result))
        .catch(error => {
            //console.error('There has been a problem with your fetch operation:', error);
            dispatch({
              type: REFRESH_FAIL,
            });
        });
             
         }catch(err) {
             //console.log(err)
             dispatch ({
                 type: REFRESH_FAIL
             })
     
         }



    }else {
        dispatch({
            type : AUTHENTICATED_FAIL
        })
    }

}

export const delete_user = (email,password) =>  async dispatch => {
    
    function LoaderResponse(props) {
        const data = JSON.parse(props)
        //console.log('user data request is', data.is_ac)
        
       if(!data.success){
            // dispatch({
            //     type: USER_LOADED_FAIL,
            //     payload : data.error
            // });
            var obj = Object.keys(data)
            var response = obj[0]
            // console.log(...data[response])
            // console.log(typeof(data[response]))
            var feeds = data[response]
            //console.log(feeds)
            dispatch({
                type : FAIL_EVENT,
                payload : String(feeds)
            })
       }else {
            dispatch ({
                type: LOGOUT,
                payload: data.success
            })
            
       }

        
       
        
       
    }
    //console.log(localStorage.getItem('access'), typeof(localStorage.getItem('access')))
    if (localStorage.getItem('access')  != 'undefined'){
            //console.log('making the loaduser request')
        
        try {
            const body = JSON.stringify({
                "current_email": String(email),
                "current_password": String(password)
            });
            var requestOptions = {
                method: 'DELETE',
                headers: {
                            'Content-Type' : 'application/json',
                            'Authorization' : `JWT ${localStorage.getItem('access')}`,
                            'Accept' : 'application/json',
                            "x-CSRFToken" : `${Cookies.get('Inject')}`,
                            'Cookie' : `Inject=${Cookies.get('Inject')}`
                        },
                body : body,
                redirect: 'follow'
            };
            //const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`,config, body );
            fetch(`${import.meta.env.VITE_API_URL}/app/delete_account/`, requestOptions)
            .then(response => response.text())
            .then(result => LoaderResponse(result))
            .catch(error => {
                //console.error('There has been a problem with your fetch operation:', error);
                dispatch({
                  type: FAIL_EVENT,
                  payload : 'An issue has occured. Try again later'
                });
            });
           

            
        }catch(err) {
            //console.log('error of loaduser is: ' ,err)
            dispatch ({
                type: USER_LOADED_FAIL,
                payload : 'An issue has occured. Try again later'
            })
    
        }
    
    }
    else {
        dispatch ({
            type: USER_LOADED_FAIL,
            payload : 'Could not process your request'
        })

    }
    

}


export const login = (email, password,ShowToast) =>  async dispatch => {
    //const [responsedata, setresponsedata] = useState()
    const toastid = ShowToast('info','Processing your request, please hold.','1/2')
    
    const body = JSON.stringify({
        "email": String(email),
        "password": String(password)
    });
   
    function Responser(props) {
        const data = props != '' ? JSON.parse(props) : ''
       //console.log('data :',data,'props:',props)
        if(data.refresh ) {
            //console.log('running success')
            toast.update(toastid,{
                render : 'Your successfuly logged in.',
                type : 'success'
            })
            dispatch({
                type : LOGIN_SUCCESS,
                payload : JSON.parse(props)
            })

        }else {
           // console.log('running fail')
            var obj = Object.keys(data)
            var response = obj[0]
            var message_val = data[response]
            var feeds = data[response]
            //console.log(feeds)
            toast.update(toastid,{
                render : String(message_val),
                type : 'warning'
            })
            dispatch({
                type : LOGIN_FAIL,
                payload : String(feeds)
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
        //const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`,config, body );
        fetch(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`, requestOptions)
        .then(response => response.text())
        .then(result => Responser(result)) 
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            toast.update(toastid,{
                render : 'Seams like there was an issue when processing your request. Try again later',
                type : 'warning'
            })
            
        });
        
    }catch(err) {
        //console.log('error is:',err)
        toast.update(toastid,{
            render : 'Seams like there was an issue when processing your request. Try again later',
            type : 'warning'
        })

    }

}

export const reset_password = (email,ShowToast) => async dispatch => {
    const toastid = ShowToast('info','Processing your request, please hold.','1/2')

   
    const body = JSON.stringify({
        "email": String(email)
    });

    function Reset_Responser(props) {
       
        const data = props != '' ? JSON.parse(props) : ''
        if(!data ) {
            toast.update(toastid,{
                render : 'Check your email to change password',
                type : 'success'
            })

        }else {
            var obj = Object.keys(data)
            var response = obj[0]
            // console.log(...data[response])
            // console.log(typeof(data[response]))
            var feeds = data[response]
            //console.log(feeds)
           
            toast.update(toastid,{
                render : String(  feeds || 'Request fail to change password'),
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
        //const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`,config, body );
        fetch(`${import.meta.env.VITE_API_URL}/auth/users/reset_password/`, requestOptions)
        .then(response => response.text())
        .then(result => Reset_Responser(result))
        .catch(error => {
            //console.error('There has been a problem with your fetch operation:', error);
            toast.update(toastid,{
                render : 'There was an issue while processing your request. Try again later.',
                type : 'warning'
            })
           
        });
        
    }catch(err) {
        //console.log(err)
        toast.update(toastid,{
            render : 'There was an issue while processing your request. Try again later.',
            type : 'warning'
        })

    }
}

export const logout = () => dispatch => {
    dispatch ({
        type: LOGOUT,
        payload : 'Logged-out'
    })   
    
}


export const signupAuth = (name, email, password,re_password,ShowToast) =>  async dispatch => {
   
    const toastid = ShowToast('info','Processing request, please hold','1/2')
   
    const body = JSON.stringify({
        "email": String(email),
        'name': String(name),
        "password": String(password),
        're_password': String(re_password)
    });

    function SingupResponse(props) {
        //console.log('data to payload: ', JSON.parse(data))
        const data = JSON.parse(props)
       
        if(data.id) {
            toast.update(toastid,{
                render : 'Check your email to activate account.',
                type : 'success'
            })
           

        }else {
            var obj = Object.keys(data)
            var response = obj[0]
            //console.log(...data[response])
            var feeds = String(...data[response])
            toast.update(toastid,{
                render : String( response + ':' + feeds),
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
        //const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`,config, body );
        fetch(`${import.meta.env.VITE_API_URL}/auth/users/`, requestOptions)
        .then(response => response.text())
        .then(result => SingupResponse(result))
        .catch(error => {
            //console.error('There has been a problem with your fetch operation:', error);
            toast.update(toastid,{
                render : 'Seams like there is an issue when processing your request. Try again later.',
                type : 'warning'
            })
          
        });
        
    }catch(err) {
        //console.log(err)
        toast.update(toastid,{
            render : 'Seams like there is an issue when processing your request. Try again later.',
            type : 'warning'
        })
       

    }

}

export const verify = (uid, token,navigate,ShowToast) => async dispatch => {
    const toastid = ShowToast('info','Activating your account. Please wait.','1/2')

    function VerifyResponse(props) {
       //console.log(props)
       const data = props != '' ? JSON.parse(props) : ''
       
        if(!data ) {
            toast.update(toastid,{
                render : 'Account Successfuly verified. Login to proceed.',
                type : 'success'
            })
            
            setTimeout(() => {
                navigate('/');
            }, 3000);

        }else {

            var obj = Object.keys(data)
            var response = obj[0]
            // console.log(...data[response])
            // console.log(typeof(data[response]))
            var feeds = data[response]
            console.log(feeds)
            if(feeds == 'Stale token for given user.'){
                
                toast.update(toastid,{
                    render : 'This account is already activated. You may now login',
                    type : 'warning'
                })
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }else {
                toast.update(toastid,{
                    render : String(feeds),
                    type : 'warning'
                })
                
            }
            
        }


    }

    try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
        "uid": String(uid),
        "token": String(token)
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };

        fetch(`${import.meta.env.VITE_API_URL}/auth/users/activation/`, requestOptions)
        .then((response) => response.text())
        .then((result) => VerifyResponse(result))
        .catch(error => {
            console.log(error)
            toast.update(toastid,{
                render : 'Seams like there was an issue processing your request. Try again later.',
                type : 'warning'
            })
            
        });
        //.catch((error) => console.error(error));

    }catch(err) {
        console.log(err)
        toast.update(toastid,{
            render : 'Seams like there was an issue processing your request. Try again later.',
            type : 'warning'
        })

    }
}

export const resend_verification = (email, navigate,ShowToast) => async dispatch => {
    const toastid = ShowToast('info','Processing your request. Please wait','1/2')

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({ email });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/users/resend_activation/`, 
            requestOptions
        );

        // Handle 204 No Content response
        if (response.status === 204) {
            
            toast.update(toastid,{
                render : 'Verification email resent successfully check your email.',
                type : 'success'
            })
            // if (navigate) navigate('/');
            return;
        }

        // Handle 400 Bad Request response
        if (response.status === 400) {
            const errorData = await response.json();
            const errorMessage = extractErrorMessage(errorData);
            
            toast.update(toastid,{
                render :'Failed to resend verification email. This account is probably activated or does not exist.',
                type : 'warning'
            })
            return;
        }

        // Handle other successful responses (200 range)
        if (response.ok) {
            const result = await response.text();
            toast.update(toastid,{
                render : 'Verification email resent successfully check your email.',
                type : 'success'
            })
            // if (navigate) navigate('/');
            return;
        }

        // Handle other error responses
        const errorData = await response.json().catch(() => ({}));
        toast.update(toastid,{
            render : 'Failed to resend verification email. This account is probably activated or does not exist.',
            type : 'warning'
        })
       

    } catch (err) {
        
        toast.update(toastid,{
            render : 'Network error. Please try again later.',
            type : 'warning'
        })
    }
};


export const FetchLogout = (refresh_token,access) => async dispatch =>  {
    
    function LoaderResponse(data){
        //logout()
    }
    const user = {
        'refresh_token' : refresh_token
    }
    try{
        var requestOptions = {
            method: 'POST',
            headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `JWT ${access}`,
                        'Accept' : 'application/json'
                    },
            body : JSON.stringify(user),
            redirect: 'follow'
        };
        //const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`,config, body );
        fetch(`${import.meta.env.VITE_API_URL}/app/logout/`, requestOptions)
        .then(response => response.text())
        .then(result => LoaderResponse(result))
        .catch(error => {
            //console.error('There has been a problem with your fetch operation:', error);
            dispatch({
              type: FAIL_EVENT,
              payload : 'An issue has occured. Try again later'
            });
        });
        
    }catch(err) {
        //console.log('error of loaduser is: ' ,err)
        dispatch ({
            type: FAIL_EVENT,
            payload : 'An issue has occured. Try again later'
        })

    }

}