import React from 'react';

const Modal = (props) => {
    const {visible,onClickCancel,message,onClickOk,pendingApiCall, modalTittle}=props;
    let className="modal fade";

    if(visible) {
        className += " show d-block";
    }

    return (
        <div className={className} style={{backgroundColor:"rgba(0,0,0,0.69)"}}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{modalTittle}</h5>
                    </div>
                    <div className="modal-body">{message}</div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClickCancel} disabled={pendingApiCall}>Cancel</button>
                        <button className="btn btn-primary" onClick={onClickOk} disabled={pendingApiCall}>
                            {pendingApiCall && <span className="spinner-border spinner-border-sm mr-1"/>}
                            {modalTittle}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;