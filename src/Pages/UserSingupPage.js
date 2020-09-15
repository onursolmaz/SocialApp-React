import React, {useState} from 'react';
import Input from "../components/Input";
import {useApiProgress} from "../Shared/ApiProgress";
import {useDispatch} from "react-redux";
import {singupHandler} from "../Redux/authAction";

const UserSingupPage = (props) => {
    const [form, setForm] = useState( {
        username: null,
        displayName: null,
        password: null,
        passwordRepeat: null
    } )
    const [errors, setErrors] = useState( {} )
    const dispatch = useDispatch()     // hooks la gelen özellik. Dispatch i hooksdan alıyoruz

    const onChange = event => {
        const {name, value} = event.target
        setErrors( (prevState) => ({...prevState, [name]: undefined}) )
        setForm( (previousState) => ({...previousState, [name]: value}) )
    };

    const onClickSingUp = async event => {
        event.preventDefault();
        const {history} = props;
        const {push} = history;
        const {username, displayName, password} = form;
        const addedUser = {
            username,
            displayName,
            password
        }
        try {
            await dispatch( singupHandler( addedUser ) );
            push( "/" );
        } catch (error) {
            if (error.response.data.validationErrors) {
                setErrors( error.response.data.validationErrors )
            }
        }
    }


    const pendingApiCallSignup = useApiProgress( "post", "/api/users" );
    const pendingApiCallLogin = useApiProgress( "post", "/api/auth" );
    const pendingApiCall = pendingApiCallSignup && pendingApiCallLogin;
    const {username: usernameError, displayName: displayNameError, password: passwordError} = errors;

    let passwordRepeatError;
    if (form.password !== form.passwordRepeat)
        passwordRepeatError = 'Passwords not match';

    return (
        <div className="container text-center">
            <div className="card">
                <h1 className="card-header text-center">Sing Up</h1>
                <div className="card-body">

                    <Input label="Username" name="username" error={usernameError} onChange={onChange}/>
                    <Input label="Display Name" name="displayName" error={displayNameError} onChange={onChange}/>
                    <Input label="Password" name="password" error={passwordError} onChange={onChange} type="password"/>
                    <Input label="Password Repeat" name="passwordRepeat" error={passwordRepeatError} onChange={onChange}
                           type="password"/>
                    <div className="text-center">
                        <button className="btn btn-primary" onClick={onClickSingUp}
                                disabled={pendingApiCall || passwordRepeatError}>
                            {pendingApiCall && <span className="spinner-border spinner-border-sm"/>} Sing Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
// kendi hooksumuzu oluşturmadan önce böyle yapıyorduk
// const UserSingupPageWithApiProgressForSignup = withApiProgress( UserSingupPage, '/api/users' );
// const UserSingupPageWithApiProgressForLogin = withApiProgress( UserSingupPageWithApiProgressForSignup, '/api/auth' );
export default UserSingupPage;