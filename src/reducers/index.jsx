import {combineReducers} from 'redux'
import auth from './auth'
//combineReduxers creates a single object called 'rootReducer'
export default combineReducers({
    auth,
});