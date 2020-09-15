import * as ACTIONS from "./Constants";
import {login,singUp} from "../Api/ApiCalls";


export const logoutSuccess=()=>{
    return {
        type:ACTIONS.LOGOUT_SUCCESS
    }
}
export const loginSuccess=authState=>{
    return {
        type:ACTIONS.LOGIN_SUCCESS,
        payload:authState
    }
}

export const updateSucces=({displayName,image})=>{
    return{
        type:ACTIONS.UPDATE_SUCCESS,
        payload:{
            displayName,
            image
        }
    }
}

export const loginHandler=(credentials)=>{
    return async function (dispatch) {
        const response = await login(credentials);
        const authState = {
            ...response.data,
            password:credentials.password
        };
        dispatch(loginSuccess(authState))
        return response;
    }
}

export const singupHandler=(user)=>{
    return async function(dispatch){
        const response= await singUp(user);
        await dispatch(loginHandler(user))
        return response;
    }
}