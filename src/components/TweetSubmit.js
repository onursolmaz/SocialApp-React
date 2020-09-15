import React, {useEffect, useState} from 'react';
import ProfilePictureWithDefault from "./ProfilePictureWithDefault";
import {useSelector} from "react-redux";
import {postTweet, postTweetAttachment} from "../Api/ApiCalls";
import {useApiProgress} from "../Shared/ApiProgress";
import Input from "./Input";
import AutoUploadImage from "./AutoUploadImage";

const TweetSubmit = () => {

    const {image} = useSelector( store => ({image: store.image}) )
    const [focused, setFocused] = useState( false )
    const [tweet, setTweet] = useState( "" )
    const [errors, setErrors] = useState( {} );
    const [newImage, setNewImage] = useState();
    const [attachmentId, setAttachmentId] = useState();
    const pendingApiCall = useApiProgress( "post", "/api/tweets", true );
    const pendingFileUpload = useApiProgress( "post", "/api/tweet-attachments", true );

    useEffect( () => {
        if (!focused) {
            setTweet( "" );
            setErrors( {} );
            setNewImage();
            setAttachmentId();
        }
    }, [focused] )

    useEffect( () => {
        setErrors( {} )
    }, [tweet] )




    const onClikcTweet = async () => {
        const body = {
            content: tweet,
            attachmentId: attachmentId
        }
        try {
            await postTweet( body )
            setFocused( false );
        } catch (error) {
            if (error.response.data.validationErrors) {
                setErrors( error.response.data.validationErrors )
            }
        }
    }
    const onChangeFile = event => {
        if (event.target.files.length < 1)
            return;
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setNewImage( fileReader.result );
            uploadFile( file )
        };
        fileReader.readAsDataURL( file );
    };

    const uploadFile = async (file) => {
        const attachment = new FormData();
        attachment.append( "file", file );
        const response = await postTweetAttachment( attachment );
        setAttachmentId( response.data.id )
    }


    let textAreaClass = "form-control"
    if (errors.content)
        textAreaClass += " is-invalid"

    return (
        <div className="card p-2">
            <div className="d-flex flex-row mt-2">
                <ProfilePictureWithDefault className="rounded-circle mr-2" width="32px" height="32px" image={image}/>
                <div className="flex-fill">
                    <textarea className={textAreaClass} onFocus={() => setFocused( true )} rows={focused ? "3" : "1"}
                              value={tweet}
                              onChange={(event) => setTweet( event.target.value )}
                    />
                    <div className="invalid-feedback">{errors.content}</div>
                </div>
            </div>
            {focused && (<>
                {!newImage && <Input type="file" onChange={onChangeFile}/>}
                {newImage && <AutoUploadImage image={newImage} uploading={pendingFileUpload}/>}
                <div className="text-right mt-1">
                    <button className="btn btn-primary m-2 d-inline-flex btn-sm" onClick={onClikcTweet}
                            disabled={pendingApiCall || pendingFileUpload}>
                        {pendingApiCall && <span className="spinner-border spinner-border-sm mr-1"/>}
                        <i className="material-icons mr-1" style={{fontSize: "21px"}}>send</i>Submit
                    </button>
                    <button className="btn btn-danger btn-sm d-inline-flex"
                            onClick={() => setFocused( false )}
                            disabled={pendingApiCall || pendingFileUpload}>
                        <i className="material-icons">close</i>Cancel
                    </button>

                </div>
            </>)}
        </div>
    );
};

export default TweetSubmit;