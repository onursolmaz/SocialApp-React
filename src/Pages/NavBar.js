import React, {useEffect, useRef, useState} from 'react';
import logo from "../img/logo.PNG"
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logoutSuccess} from "../Redux/authAction";
import ProfilePictureWithDefault from "../components/ProfilePictureWithDefault";

const NavBar = (props) => {

    const {username, isLoggedIn, displayName, image} = useSelector( (store) => ({
        isLoggedIn: store.isLoggedIn,
        username: store.username,
        displayName: store.displayName,
        image: store.image
    }) )
    const menuArea = useRef( null );
    const [menuVisible, setMenuVisible] = useState( false );

    useEffect( () => {
        document.addEventListener( "click", menuClickTracler );
        return () => {
            document.removeEventListener( "click", menuClickTracler )
        }
    }, [isLoggedIn] )
    const menuClickTracler = (event) => {
        if (menuArea.current === null || !menuArea.current.contains( event.target ))
            setMenuVisible( false );
    }

    const dispatch = useDispatch();

    const onLogoutSuccess = () => {
        dispatch( logoutSuccess() );
    }

    let Links = (
        <ul className="navbar-nav ml-auto">
            <li>
                <Link className="nav-link mr-1 font-weight-bolder" to="/login">
                    <i className="material-icons d-block">login</i>Login</Link>
            </li>
            <li>
                <Link className="nav-link text-center font-weight-bolder" to="/singup">
                    <i className="material-icons d-block"> group_add</i>Sing Up</Link>
            </li>
        </ul>
    );
    if (isLoggedIn) {
        let dropdownClass = "dropdown-menu p-0 shadow"
        if (menuVisible)
            dropdownClass += " show";

        Links = (
            <ul className="navbar-nav ml-auto" ref={menuArea}>
                <li className="nav-item dropdown">
                    <div className="d-flex" style={{cursor: "pointer"}} onClick={() => setMenuVisible( true )}>
                        <ProfilePictureWithDefault className="rounded-circle m-auto" image={image} width="30px" height="30px"/>
                        <span className="nav-link dropdown-toggle">{displayName}</span>
                    </div>
                    <div className={dropdownClass}>

                        <Link className="dropdown-item d-flex p-2" to={"/users/" + username}
                              onClick={() => setMenuVisible( false )}>
                            <i className="material-icons text-info mr-2">person</i>My profile</Link>

                        <Link className="dropdown-item d-flex p-2" to="/" onClick={onLogoutSuccess}>
                            <i className="material-icons text-danger mr-2">power_settings_new</i> Logout</Link>
                    </div>
                </li>

            </ul>
        );
    }

    return (
        <div className="shadow-sm bg-light mb-2">
            <nav className="navbar navbar-light container navbar-expand">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="logo" width="153" height="60" className="mr-3"/>
                </Link>
                {Links}
            </nav>

        </div>

    );
}
//
// const mapStateToProps = store => {            hook la almadan önce kullanılıyordu onun yerine useSelector ve useDispacth
//     return {};
// };
// const mapDispatchToProps = dispatch => {
//     return {
//         onLogoutSuccess: () => dispatch( logoutSuccess() )
//     };
// };

export default NavBar;
