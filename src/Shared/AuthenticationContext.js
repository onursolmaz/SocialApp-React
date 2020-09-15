import React, {Component} from 'react';
export const Authentication=React.createContext();

class AuthenticationContext extends Component {
    state={
        isLoggedIn:false,
        username:undefined,
        displayName:undefined,
        img:undefined,
        password:undefined
    }
    onLoginSuccess=authState=>{
        this.setState({
            ...authState,   // yeni js kodu: tüm state i authState deki verilerle set et
            isLoggedIn:true
        });
    }
    onLogoutSuccess=()=>{
        this.setState({isLoggedIn:false,username:undefined})
    }


    render() {
        return (
            <Authentication.Provider
                value={{
                    state: { ...this.state },
                    onLoginSuccess: this.onLoginSuccess,
                    onLogoutSuccess: this.onLogoutSuccess
                }}>
                {this.props.children}
            </Authentication.Provider>
        );
    }
}

export default AuthenticationContext;