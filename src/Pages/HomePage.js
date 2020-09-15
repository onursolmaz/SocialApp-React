import React from 'react';
import UserList from "../components/UserList";
import TweetSubmit from "../components/TweetSubmit";
import TweetFeed from "../components/TweetFeed";
import {useSelector} from "react-redux";

const HomePage = () => {

    const {isLoggedIn}=useSelector((store)=>({isLoggedIn:store.isLoggedIn}))
    return (
        <div className="container">

            <div className="row">
                <div className="col-6">
                    <div className="mb-2">
                        {isLoggedIn && <TweetSubmit/>}
                    </div>
                        <TweetFeed/>
                </div>
                <div className="col-4 ml-auto">
                    <UserList/>
                </div>


            </div>


        </div>
    );
};

export default HomePage;