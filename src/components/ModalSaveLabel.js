import { React, useState, useEffect } from "react";
import { updateLabel } from "../stores/label";
import { getUserEmail } from "../stores/user";
import global from "../stores/global";
import $ from 'jquery'
import { deleteCookie } from "../services/cookie-handler";
import { useNavigate } from "react-router-dom";

export default function ModalSaveLabel({ callbackSuccess, labelId, nameLabel }) {

    const [labelName, setLabelName] = useState('');
    
    const navigate = useNavigate();

    function closeModal(modalId) {
        var modal = $('#' + modalId);
        modal.hide();
    }

    async function updateLabelText() {
        const res = await updateLabel(labelId, {
            id: labelId,
            nome: labelName,
            usuarioAlteracao: getUserEmail()
        });
        if (res.status === 200) {
            closeModal('labelModal');
            global.ui.notification.success('Label updated successfully');
            if (callbackSuccess)
                callbackSuccess()

        }
        else if (res.status === 401) {
            deleteCookie('kanplan_token');
            navigate('/Login')
        }
        else
            console.error(res);
    }

    useEffect(()=>{
        setLabelName(nameLabel);
    },[nameLabel, labelId])

    return (
        <div className="modal fade" id='labelModal' tabIndex='-1' aria-labelledby="labelModalLabel" aria-hidden='true'>
            <div className="modal-dialog modal-sm">
                <div className="modal-content main-modal">
                    <div className="modal-header">
                        <h1 className="modal-title fs-3 main-text">Edit Label name</h1>

                        <button type="button" className="btn-close-white btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                    </div>
                    <div className="modal-body">
                        <input className="ipt" value={labelName || ''} onChange={(e) => setLabelName(e.target.value)} />
                    </div>
                    <div className="modal-footer d-flex justify-content-between">
                        <button type="button" className="button-cancel text-start" data-bs-dismiss="modal">Close</button>
                        <button onClick={updateLabelText} type='button' className='button text-end'>SAVE</button>
                    </div>
                </div>
            </div>
        </div>
    )
}