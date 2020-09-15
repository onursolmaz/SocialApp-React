import React from 'react';
import defaultPicture from "../img/defaultPictureBig.png"

const ProfilePictureWithDefault = (props) => {
    const {image,tempimage} = props

    let imageSource = defaultPicture;

    if (image) {
        imageSource = 'images/profile/' + image;
    }
    return (
        <img src={tempimage || imageSource} {...props} alt="profile-pic"
        onError={(event)=>{
            event.target.src=defaultPicture;
        }}
        >
        </img>
    );
};

export default ProfilePictureWithDefault;