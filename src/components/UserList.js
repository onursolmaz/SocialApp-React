import React, {useEffect, useState} from 'react';
import {getUsers} from "../Api/ApiCalls";
import UserListItem from "./UserListItem";
import {useApiProgress} from "../Shared/ApiProgress";
import Spiner from "./Spiner";
//import {useSelector} from "react-redux";

const UserList = () => {
    const [page, setPage] = useState( {
        content: [],                                // api den gelen userlar contect içinde
        size: 3,
        number: 0
    } )
    const [loadFail,setLoadFail]=useState(false);
    const pendingApiCall=useApiProgress("get","/api/users?page");
    useEffect( ()=>{
        loadUser();
    },[]);




    const onClickNext = () => {
        const nextPage = page.number + 1;
        loadUser( nextPage );

    }
    const onClickPrev = () => {
        const prevPage = page.number - 1;
        loadUser( prevPage );
    }

    const loadUser = async (page) => {
        setLoadFail(false);
        try{
            const response=await getUsers( page );
            setPage(response.data)
        }catch(error){
            setLoadFail(true);
        }
    };

    const {content: users, last, first} = page
    let actionDiv=(
        <div>
            {first === false &&
            <button className="btn btn-light btn-sm float-left " onClick={onClickPrev}>Previous </button>}
            {last === false &&
            <button className="btn btn-light btn-sm float-right" onClick={onClickNext}> Next > </button>}
        </div>
    )
    if(pendingApiCall){
       actionDiv=<Spiner/>
    }

    return (
        <div className="card">
            <div className="list-group-flush">
                <h4 className="card-header text-center">User List</h4>
                { !loadFail? users.map( user => (
                    <UserListItem key={user.username} user={user}/>
                ) ): <div className="alert alert-danger m-5 text-center" role="alert">Loading Error !</div>
                }
            </div>
                {actionDiv}
        </div>
    );

}

export default UserList;