import React, {useEffect, useState} from 'react';
import Input from "../components/Input";
import {useApiProgress} from "../Shared/ApiProgress";
import {useDispatch} from "react-redux";
import {loginHandler} from "../Redux/authAction";


const LoginPage = (props) => {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const dispatch=useDispatch()    // hooks la gelen özellik dispatch i hooks dan alıyoruz.

    useEffect(()=>{             // username veya password de bir değişiklik olursa error= undefined yap
        setError(undefined)
    },[username,password])

    const onClickLogin = async event => {
        event.preventDefault();
        const creds = {
            username,
            password
        };

        const {history, } = props;
        const {push} = history;

        setError( undefined )
        try {
            await dispatch( loginHandler( creds ) )
            push( '/' );
        } catch (apiError) {
            setError( apiError.response.data.message )
        }
    };
    const pendingApiCall = useApiProgress("post","/api/auth")
    const buttonEnabled = username && password;
    return (
        <div className="container mt-4">
            <h1 className="text-center">Login</h1>
            <form>
                <Input label="Username" onChange={event => setUsername( event.target.value)}
                />
                <Input label="password" type="password" onChange={event => setPassword( event.target.value )}/>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="text-center">
                    <button className="btn btn-primary" onClick={onClickLogin}
                            disabled={!buttonEnabled || pendingApiCall}>
                        {pendingApiCall && <span className="spinner-border spinner-border-sm"/>} Login
                    </button>
                </div>
            </form>
        </div>
    );

}

export default  LoginPage;

