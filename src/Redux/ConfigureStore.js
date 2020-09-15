import {applyMiddleware, createStore} from "redux";
import authReducer from "./authReducer";
import SecureLS from "secure-ls";
import thunk from "redux-thunk";
import {setAuthorizationHeader} from "../Api/ApiCalls";

const SecureLs = new SecureLS();   // browser ın localstorage ından şifreli şekilde veri tutmak için

const getStateFromStorage = () => {
    const authData = SecureLs.get( "auth" );
    let stateInLocalStorage = {
        isLoggedIn: false,
        username: undefined,
        displayName: undefined,
        image: undefined,
        password: undefined
    }
    if (authData)
        stateInLocalStorage = authData
    return stateInLocalStorage;
}
const updateStateInStorage = newState => {
    SecureLs.set( "auth", newState );
}

const configureStore = () => {
    const initialState = getStateFromStorage();
    setAuthorizationHeader( initialState ); // login olan kullanıcının userlist de gözükmemesi için
    const store = createStore( authReducer, initialState, applyMiddleware( thunk ) );
    store.subscribe( () => {
        updateStateInStorage( store.getState() );
        setAuthorizationHeader( store.getState() );  // logout olduğunda Userlist te göster. Store da güncelleme olduğunda ekle
    } )
    return store

}
export default configureStore;
