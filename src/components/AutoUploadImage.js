import React from 'react';
import "./AutoUploadImage.css"

const AutoUploadImage = ({image, uploading}) => {
    return (
        <div style={{position: "relative"}} className="pl-4 pr-4 mt-2">
            <img src={image} alt="-" className="img-thumbnail "/>
            <div className="overlay" style={{opacity:uploading?1:0}}>
                <div className="d-flex justify-content-center h-100">
                    <div className="spinner-border text-light m-auto">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AutoUploadImage;