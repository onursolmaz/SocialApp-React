import React from 'react';

const Spiner = () => {
    return (
        <div className="d-flex justify-content-center">
            <div className="spinner-border text-black-50" >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spiner;