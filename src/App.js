import React from "react";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import {HashRouter as Router, Route, Switch,Redirect} from 'react-router-dom';
import UserSingupPage from "./Pages/UserSingupPage";
import NavBar from "./Pages/NavBar";
import UserPage from "./Pages/UserPage";
import {useSelector} from "react-redux";

function App()  {
        const {isLoggedIn}=useSelector((store)=>({isLoggedIn:store.isLoggedIn}))

        return (
            <Router>  {/*ROUTER BACKEND E OTOMATİK REQUEST ATTIĞI İÇİN HASTROUTER KULLANDIK*/}
                <NavBar/>
                <Switch>
                    {!isLoggedIn &&  <Route path="/login" component={LoginPage}/>}

                    <Route exact path="/" component={HomePage}/>
                    <Route path="/singup" component={UserSingupPage}/>
                    <Route path="/users/:username" component={UserPage}/>
                    <Redirect to="/" />
                </Switch>
            </Router>
        );


}
//
// const mapStateToProps=(store)=>{    Hook s dan önce isLoggedIn bilgisi almak için kullanıyordu
//     return{
//         isLoggedIn:store.isLoggedIn
//     }
// }
export default App;
