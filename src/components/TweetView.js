import React, {useState} from 'react';
import ProfilePictureWithDefault from "./ProfilePictureWithDefault";
import {Link} from "react-router-dom";
import {format} from "timeago.js";
import {useSelector} from "react-redux";
import {deleteTweet} from "../Api/ApiCalls";
import Modal from "./Modal";
import {useApiProgress} from "../Shared/ApiProgress";

const TweetView = (props) => {
    const loggedInUser = useSelector( store => store.username )
    const {tweet, onDeleteTweet} = props;
    const {user, content, date, fileAttachment, id} = tweet
    const {username, displayName, image} = user
    const [modalVisible,setModalVisible]=useState(false);

    const pendingApiCall=useApiProgress("delete","/api/tweets/"+id,true);

    const isOwned =loggedInUser===username;
    const onClikdelete = async () => {
        await deleteTweet( id );
        onDeleteTweet( id );
    }
    const onClickCancel=()=>{
        setModalVisible(false)
    }


    const formetted = format( date )
    return (<>
            <div className="card p-1 mb-2">
                <div className="d-flex">
                    <ProfilePictureWithDefault image={image} width="38" height="38" className="rounded-circle m-1"/>
                    <div className="flex-fill m-auto pl-2">
                        <Link to={`/users/${username}`} className="text-decoration-none text-dark">
                            <h6 className="d-inline">{displayName} @{username}</h6> -
                            <span>{formetted}</span>
                        </Link>
                    </div>
                    {isOwned && <button className="btn btn-sm btn-delete-link" onClick={()=>setModalVisible(true)}>
                        <i className="material-icons">delete_outline</i>
                    </button>}
                </div>
                <div className="pl-5">{content}</div>
                {fileAttachment && (
                    <div className="pl-5">
                        <img className="img-fluid" src={"images/attachments/" + fileAttachment.name} alt="--"/>
                    </div>
                )}
            </div>
            <Modal visible={modalVisible} onClickCancel={onClickCancel} onClickOk={onClikdelete} pendingApiCall={pendingApiCall}
                   message={
                <div>
                    <div><strong>Are you sure to delete tweet?</strong></div>
                    <span>{content}</span>
                </div>
            } modalTittle={"Delete Tweet"}/>
        </>
    );
};

export default TweetView;