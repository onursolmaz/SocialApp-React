import React, {useEffect, useState} from 'react';
import ProfileCard from "../components/ProfileCard";
import {getUser} from "../Api/ApiCalls";
import {useApiProgress} from "../Shared/ApiProgress";
import Spiner from "../components/Spiner";
import TweetFeed from "../components/TweetFeed";

const UserPage = (props) => {
    const [user, setUser] = useState({}); // ilk başta boş bi array paslıyoruz, props olarak null gitmemesi için
    const [notFound, setNotFound] = useState( false );
    const username = props.match.params.username; // useParams() ile hooks ile de alabilirdik
    const pendingApiCall=useApiProgress("get","/api/users/"+username,true)

    useEffect( () => {
        const loadUser = async () => {
            try {
                const response = await getUser( username )
                setUser( response.data )
                setNotFound( false );
            } catch (e) {
                setNotFound( true )
            }
        };
        loadUser();
    }, [username] )



    if (notFound) {
        return (
            <div className="alert alert-danger text-center m-5">
                <i className="material-icons d-block" style={{fontSize: "45px"}}>error</i>
                User not found !
            </div>
        )
    }
    if(pendingApiCall || user.username!==username){
        return <Spiner/>
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <ProfileCard user={user}></ProfileCard>
                </div>
                <div className="col">
                    <TweetFeed/>
                </div>
            </div>



        </div>
    );


}
export default UserPage;