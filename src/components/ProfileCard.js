import React, {useEffect, useState} from 'react';
import {useParams,useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import ProfilePictureWithDefault from "./ProfilePictureWithDefault";
import Input from "./Input";
import {deleteUser, updateUser} from "../Api/ApiCalls";
import {useApiProgress} from "../Shared/ApiProgress";
import {logoutSuccess, updateSucces} from "../Redux/authAction";
import Modal from "./Modal";


const ProfileCard = (props) => {
    const [inEditMode, setInEditMode] = useState( false );
    const [updatedDisplayName, setUpdatedDisplayName] = useState();
    const {username: loggedInUsername} = useSelector( (store) => ({username: store.username}) );
    const routeParams = useParams();
    const pathUsername = routeParams.username; // kullanamak için withRouterle sarmak lazım
    const [user, setUser] = useState( {} );
    const [editable, setEditable] = useState( false );
    const [newImage, setNewImage] = useState();
    const [errors, setErrors] = useState( {} );
    const dispatch = useDispatch();
    const {username, displayName, image} = user;
    const [modalVisible,setModalVisible]=useState(false)
    const history= useHistory();

    useEffect( () => {
        setUser( props.user );   // propsdan gelen  user ı sayfa yüklendiğinde set et
    }, [props.user] );

    useEffect( () => {
        setEditable( pathUsername === loggedInUsername );
    }, [pathUsername, loggedInUsername] );



    useEffect( () => {
        setErrors( (prevState) => ({...prevState, displayName: undefined}) )
    }, [updatedDisplayName] )
    useEffect( () => {
        setErrors( (prevState) => ({...prevState, image: undefined}) )
    }, [newImage] )

    useEffect( () => {
        if (!inEditMode) {
            setUpdatedDisplayName( undefined );
            setNewImage( undefined );
        } else {
            setUpdatedDisplayName( displayName );
        }
    }, [inEditMode, displayName] );

    const onClickCancel=()=>{
        setModalVisible(false);
    }
    const onClickDeleteUser=async ()=>{
        await deleteUser();
        dispatch(logoutSuccess());
        history.push("/");
        setModalVisible(false)
    }

    const onClickSave = async () => {
        let image = undefined
        if (newImage)
            image = newImage.split( ',' )[1];

        const body = {
            displayName: updatedDisplayName,
            image
        }
        try {
            const response = await updateUser( username, body );
            setInEditMode( false );
            setUser( response.data );
            dispatch( updateSucces( response.data ) );

        } catch (error) {
            setErrors( error.response.data.validationErrors );
        }
    }

    const onChangeFile = event => {
        if (event.target.files.length < 1)
            return;
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setNewImage( fileReader.result );
        };
        fileReader.readAsDataURL( file );
    };

    const pendingApiCall = useApiProgress( "put", "/api/users/" + username );
    const pendingApiCallforDelete=useApiProgress("delete","/api/users");

    return (
        <>
            <div className="card text-center">
                <div className="card-header">
                    <ProfilePictureWithDefault className="rounded-circle shadow" image={image} tempimage={newImage}
                                               alt={user.username + "profile picture"} width="200px" height="200px"

                    />
                </div>
                <div className="card-body"><h3>{displayName} <span className="font-weight-lighter">@{username}</span>
                </h3>
                    {(!inEditMode && editable) && <>
                        <button className="btn btn-primary d-inline-flex" onClick={() => setInEditMode( true )}>
                            <i className="material-icons">edit</i>Edit
                        </button>
                        <div></div>
                        <button className="btn btn btn-danger mt-2 d-inline-flex" onClick={()=>setModalVisible(true)}>
                            <i className="material-icons">delete_forever</i> delete my account
                        </button>
                    </>
                    }
                    {inEditMode && <> <Input label="Change your display name" defaultValue={displayName}
                                             error={errors.displayName} onChange={(event) => {
                        setUpdatedDisplayName( event.target.value )
                    }}>

                    </Input>
                        <Input className="form-control-file" type="file" onChange={onChangeFile} error={errors.image}/>

                        <button className="btn btn-primary btn-sm d-inline-flex mr-2"
                                onClick={onClickSave} disabled={pendingApiCall}>
                            {pendingApiCall ? <span className="spinner-border spinner-border-sm d-inline-flex mr-2"/> :
                                <i className="material-icons">done</i>} Save
                        </button>
                        <button className="btn btn-danger btn-sm d-inline-flex"
                                onClick={() => setInEditMode( false )} disabled={pendingApiCall}>
                            <i className="material-icons">close</i>Cancel
                        </button>

                    </>

                    }
                </div>
            </div>
            <Modal visible={modalVisible} onClickCancel={onClickCancel}
                   onClickOk={onClickDeleteUser} modalTittle={`Delete My Account`}
                   message={"Are you sure to delete your account"}
                   pendingApiCall={pendingApiCallforDelete}
            />
        </>
    )
}
//
// const mapDispatchToProps=store=>{        hook dan önce store erişmek için kullanılıyordu
//     return{
//         loggedUsername:store.username
//     }
// }
export default ProfileCard;