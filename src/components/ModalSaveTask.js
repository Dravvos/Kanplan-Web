import { React, useState, useCallback, useEffect } from "react";
import global from "../stores/global"
import { deleteComment, createComment } from "../stores/comment";
import { unassignLabelFromTask, getProjectLabels, assignLabelToTask } from "../stores/label";
import {
    createTask, updateTask, unassignUserFromTask,
    assignTaskToUser
} from "../stores/task";
import { deleteCookie } from "../services/cookie-handler";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { createAttach } from "../stores/attach";
import { getUserEmail } from "../stores/user";
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import { getTabelaGeral, getTabelasGerais } from "../stores/tabelaGeral";
import { getBucket } from "../stores/bucket";
import ModalSaveLabel from "./ModalSaveLabel";



export default function ModalSaveTask({ bucketId, statusComboBoxOptions,
    bucketComboBoxOptions, projectUsers, updatedDate, bucketSelected,
    prioritySelected, statusSelected, task,
    callbackSuccess, callbackFail, onClose
}) {

    //#region useState

    const [selectedPriority, setSelectedPriority] = useState(null);  //selected priority in combobox
    const [selectedStatus, setSelectedStatus] = useState(null);  //selected status in combobox
    const [editedTask, setEditedTask] = useState(null);
    const [prioritiesOptions, setPrioritiesOptions] = useState([]);//list of priorities of task for combobox
    const [startDate, setStartDate] = useState(new Date()); //start date of task
    const [endDate, setEndDate] = useState(new Date()); //end date of task
    const [selectedBucket, setSelectedBucket] = useState(null);
    const [labelId, setLabelId] = useState(null); //Label to be edited
    const [isVisible2, setIsVisible2] = useState(false);
    const [labelName, setLabelName] = useState(null); //Label to be edited
    const [labels, setLabels] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);

    //#endregion

    //#region functions

    function openModal(modalId) {
        var modal = new bootstrap.Modal($('#' + modalId)[0]);
        modal.show();
    }

    const toggleDropdownVisibility = useCallback(() => {
        setDropdownVisible(!dropdownVisible);
    }, [setDropdownVisible, dropdownVisible]);

    const addComment = async () => {

        if (global.util.isNullOrEmpty($('#txtComment').val())) {
            global.ui.notification.error('Comment is empty');
            return;
        }

        const res = await createComment({
            texto: $('#txtComment').val(),
            usuarioInclusao: getUserEmail(),
            taskId: editedTask.id
        });
        if (res.status === 200) {
            $('#txtComment').val('');
            if (callbackSuccess)
                callbackSuccess();
        }
        else if (res.staus === 401) {
            deleteCookie('kanplan_token');
            navigate('/Login')
        }
        else {
            console.error(res);
            global.ui.notification.error(res);
        }
    }

    async function removeLabelFromTask(labelId) {
        const resp = await unassignLabelFromTask(editedTask?.id, labelId)
        if (resp.status === 200) {
            if (callbackSuccess) {
                await fetchLabels();
                callbackSuccess();
            }
        }
        else if (resp.status === 401) {
            deleteCookie('kanplan_cookie');
            navigate('/Login');
        }
    }

    function handleOpenFile(item) {
        var base64String = item.arquivoBase64;
        var newWindow = window.open();
        if (item.nomeArquivo.includes('.png') || item.nomeArquivo.includes('.jpg')) {
            newWindow.document.write('<img style=" position: absolute;' +
                'top: 0; left: 0; bottom: 0; right: 0; margin: auto;"' +
                'src= "data:image;base64,' + base64String + '"/>');
        }
        else if (item.nomeArquivo.includes('.mp4')) {
            newWindow.document.write('<video ' +
                'style=" position: absolute; top: 0; left: 0;' +
                'bottom: 0; right: 0; margin: auto;" controls autoplay>'
                + ' <source type="video/mp4" src= "data:video/mp4;base64,' +
                base64String + '">  Your browser does not support the video tag.</video>');
        }
    }

    function removeComment(commentId) {
        global.ui.confirm('Are you sure you want to delete this comment?',
            async () => {
                const res = await deleteComment(commentId);
                if (res.status === 200) {
                    if (callbackSuccess)
                        callbackSuccess();
                }
                else if (res.status === 401) {
                    deleteCookie('kanplan_token')
                    navigate('Login')
                }
                else
                    console.error(res);
            }
        )
    }

    function setTaskName(name) {

        if (global.util.isNullOrEmpty(editedTask) === false) {
            setEditedTask({
                anexos: editedTask.anexos, bucket: editedTask.bucket,
                comentarios: editedTask.comentarios, DataInicio: editedTask.dataInicio,
                DataFim: editedTask.dataFim, dataAlteracao: editedTask.dataAlteracao,
                dataInclusao: editedTask.dataInclusao, descricao: editedTask.descricao,
                id: editedTask.id, idTgprioridade: editedTask.idTgprioridade,
                idTgstatus: editedTask.idTgstatus, nome: name,
                prioridadeDescricao: editedTask.prioridadeDescricao,
                prioridadeSigla: editedTask.prioridadeSigla, rotulos: editedTask.rotulos,
                statusDescricao: editedTask.statusDescricao, statusSigla: editedTask.statusSigla,
                usuarioInclusao: editedTask.usuarioInclusao, usuarioAlteracao: editedTask.usuarioAlteracao,
                usuariosAtrelados: editedTask.usuariosAtrelados, usuariosAtreladosIds: editedTask.usuariosAtreladosIds
            })
        }
        else {
            setEditedTask({
                descricao: editedTask?.descricao, nome: name,
            })
        }
    }

    function setTaskDescription(description) {
        if (global.util.isNullOrEmpty(editedTask) === false) {
            setEditedTask({
                anexos: editedTask.anexos, bucket: editedTask.bucket, comentarios: editedTask.comentarios,
                dataAlteracao: editedTask.dataAlteracao, dataInclusao: editedTask.dataInclusao,
                descricao: description, id: editedTask.id, idTgprioridade: editedTask.idTgprioridade,
                idTgstatus: editedTask.idTgstatus, nome: editedTask.nome, prioridadeDescricao: editedTask.prioridadeDescricao,
                prioridadeSigla: editedTask.prioridadeSigla, rotulos: editedTask.rotulos,
                statusDescricao: editedTask.statusDescricao, statusSigla: editedTask.statusSigla,
                usuarioInclusao: editedTask.usuarioInclusao, usuarioAlteracao: editedTask.usuarioAlteracao,
                usuariosAtrelados: editedTask.usuariosAtrelados, usuariosAtreladosIds: editedTask.usuariosAtreladosIds
            })
        }
        else {
            setEditedTask({
                descricao: description, nome: editedTask?.nome,
            })
        }
    }

    async function taskCreate() {
        global.ui.showLoading('Creating task ...');
        const resp = await createTask({
            Id: null, Nome: editedTask?.nome, Descricao: editedTask?.descricao,
            BucketId: bucketId, UsuarioInclusao: getUserEmail(), DataInicio: startDate,
            DataFim: endDate, IdTgprioridade: selectedPriority.value, IdTgstatus: selectedStatus.value,

        });
        if (resp?.status === 200 || resp?.status === 201) {
            global.ui.notification.success('Task created successfully');
            if (callbackSuccess)
                callbackSuccess();
        }
        else if (resp.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
        else {

            console.log('error task: ', resp);
            if (callbackFail)
                callbackFail();
        }
        setTimeout(() => {
            global.ui.removeLoading();
            const taskModal = $('#taskModal')[0];
            const modal = new bootstrap.Modal(taskModal);
            modal.hide();
            modal.dispose();
        }, 800);

    }

    async function taskUpdate() {
        global.ui.showLoading('Updating task');
        const resp = await updateTask(editedTask?.id, {
            Id: editedTask?.id, Nome: editedTask?.nome, Descricao: editedTask?.descricao,
            BucketId: bucketId, UsuarioAlteracao: getUserEmail(), DataInicio: startDate,
            DataFim: endDate, IdTgprioridade: selectedPriority.value, IdTgstatus: selectedStatus.value,

        });
        if (resp?.status === 200 || resp?.status === 201) {
            global.ui.notification.success('Task updated successfully');
            if (callbackSuccess)
                callbackSuccess();
        }
        else if (resp.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
        else {

            console.log('error task: ', resp);
        }
        setTimeout(() => {
            global.ui.removeLoading();
        }, 800);
    }

    function addAttach(files) {
        if (global.util.isNullOrEmpty(editedTask?.id) === false) {

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.fileName = file.name;

                reader.onload = async function (event) {
                    const base64File = event.target.result.split(',')[1];
                    const resp = await createAttach({
                        id: null, arquivoBase64: base64File, taskId: editedTask?.id,
                        usuarioInclusao: getUserEmail(), nomeArquivo: event.target.fileName
                    });
                    if (resp?.status === 200 || resp?.status === 201)
                        global.ui.notification.success('Attach added successfully');
                    else if (resp.status === 401) {
                        deleteCookie('kanplan_token')
                        navigate('Login')
                    }
                    else
                        console.error(resp);
                }
            }

            if (callbackSuccess)
                callbackSuccess();
        }
        else {

        }

    }

    async function addUserToTask(userId, taskId) {
        try {
            const res = await assignTaskToUser(taskId, userId);

            if (res.status === 200) {
                if (callbackSuccess)
                    callbackSuccess();
            }
            else if (res.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    async function removeUserFromTask(taskId, userId) {
        try {
            const response = await unassignUserFromTask(taskId, userId)
            if (response.status === 200) {
                if (callbackSuccess)
                    callbackSuccess();
            }
            else if (response.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const fetchPriorities = useCallback(async () => {
        try {
            const tgPriorityReponse = await getTabelaGeral('Priority');
            if (tgPriorityReponse?.status === 200) {
                const tgiPriorityResponse = await getTabelasGerais(tgPriorityReponse?.data.id);
                if (tgiPriorityResponse?.status === 200) {

                    var options = [];
                    tgiPriorityResponse?.data.forEach(item => {
                        var option = { value: item.id, label: item.descricao };
                        options.push(option);
                    });
                    setPrioritiesOptions(options);
                }
                else if (tgiPriorityResponse?.status === 401) {
                    deleteCookie('kanplan_token');
                    navigate('/Login');
                }
            }
            else if (tgPriorityReponse.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
        catch (err) {
            console.error(err);
        }
    }, [navigate]);

    const fetchLabels = useCallback(async () => {
        try {
            const res = await getBucket(bucketId);

            const response = await getProjectLabels(res.data.projetoId);
            if (response.status === 200) {
                setLabels(response.data);
            }
            else if (response.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
        catch (err) {
            console.error(err);
        }
    }, [navigate, bucketId])

    const handleClickDropdown = useCallback(async (event) => {

        if (event.target.id === "dropdownLabels" && dropdownVisible === true) {
            const firstChild = $("#" + event.target.id).children().last();
            const ul = $(firstChild).children().last();
            toggleDropdownVisibility()
            $(ul).addClass('show');
            setIsVisible2(true)
        }
        else if (event.target.id === "dropdownLabels" && dropdownVisible === false) {
            const firstChild = $("#" + event.target.id).children().last();
            const ul = $(firstChild).children().last();
            toggleDropdownVisibility()
            $(ul).removeClass('show');
            setIsVisible2(false)
        }
        else if (event.target.nodeName === "SPAN" && global.util.guidIsNullOrEmpty(event.target?.id) === false) {
            if (editedTask?.id) {
                const resp = await assignLabelToTask(editedTask.id, event.target.id);
                if (resp.status === 200) {
                    if (callbackSuccess)
                        callbackSuccess()
                }
                else if (resp.status === 401) {
                    deleteCookie('kanplan_token');
                    navigate('/Login');
                }
                else if (resp.status === 400)
                    console.error('error assigning label to task: ', resp);
                setIsVisible2(false)
            }
        }
        else if (event.target.className?.includes('labelName')) {
            if (editedTask?.id) {
                const resp = await assignLabelToTask(editedTask.id, event.target.children[0].id);
                if (resp.status === 200) {
                    if (callbackSuccess)
                        callbackSuccess()
                }
                else if (resp.status === 401) {
                    deleteCookie('kanplan_token');
                    navigate('/Login');
                }
                else if (resp.status === 400)
                    console.error('error assigning label to task: ', resp);
                setIsVisible2(false)
            }
        }
        else if (event.target.nodeName === "UL") {
            //makes nothing
        }
        else if (event.target.parentElement.nodeName === "BUTTON") {
            //makes nothing
        }
        else {
            const firstChild = $("#dropdownLabels").children().last();
            const ul = $(firstChild).children().last();
            toggleDropdownVisibility();
            $(ul).removeClass('show');
            setIsVisible2(false)
        }
    }, [navigate, callbackSuccess, dropdownVisible, editedTask?.id, toggleDropdownVisibility]);

    //#endregion

    useEffect(() => {
        fetchPriorities();
        fetchLabels();
        document.addEventListener('mousedown', handleClickDropdown);
        return () => {
            document.removeEventListener('mousedown', handleClickDropdown);
        }
    }, [fetchPriorities, fetchLabels, handleClickDropdown])

    useEffect(() => {
        setEditMode(false);
        if (task) {
            setEditedTask(task);
            setStartDate(task.dataInicio);
            setEndDate(task.dataFim);
            setEditMode(true);
        }
        else setEditedTask(null);

        if (!bucketSelected) setSelectedBucket(null);
        else setSelectedBucket(bucketSelected);

        if (prioritySelected) setSelectedPriority(prioritySelected);
        else setSelectedPriority(null);

        if (statusSelected) setSelectedStatus(statusSelected);
        else setSelectedStatus(null);
    }, [task, bucketSelected, prioritySelected, statusSelected])

    return (
        <>
            <div className='modal fade' id="taskModal" data-bs-backdrop="static" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content main-modal">
                        <div className="modal-header">
                            <h1 className="modal-title fs-2 main-text" id="taskModalLabel">Save Task</h1>

                            <button onClick={() => onClose()} type="button" className="btn-close-white btn-close" data-bs-dismiss="modal"></button>

                        </div>
                        {editMode && <span className="main-text text-start ms-4">Last modification made at {updatedDate}</span>}
                        <form>
                            <div className="modal-body">
                                <div className="form-group row px-3">
                                    <div className="col-12 text-start">
                                        <label className="form-label fs-4 main-text">Task Name *</label>
                                        <input value={editedTask?.nome || ''} onChange={(e) => setTaskName(e.target.value)} required className="ipt" />
                                    </div>
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>

                                {editMode && (
                                    <>
                                        <div id='listOfUsers' className="form-group row px-3">
                                            <div className="col-12 text-start dropdown">

                                                <button id="dropdownUsers" type="button" className="dropdown-toggle btn main-bg col-12 text-start"
                                                    data-bs-toggle="dropdown" aria-expanded="false"
                                                    data-bs-offset="25,5"  >
                                                    <i id='btnAddUser' className="fa fa-user-plus main-text me-3"></i>
                                                    {
                                                        editedTask?.usuariosAtrelados?.length > 0 ?
                                                            editedTask.usuariosAtrelados.map((item, index) => {
                                                                return <span className="main-text" key={index}>{item.nome}
                                                                    <i role="button" onClick={() => removeUserFromTask(editedTask?.id, item.id)} className="ms-2 fa fa-xmark"></i>
                                                                </span>
                                                            }) : <span className="main-text">Assign</span>}

                                                </button>
                                                <ul aria-labelledby="dropdownUsers" className="dropdown-menu main-dropdown main-text">
                                                    {projectUsers.map((item, index) => {
                                                        return <li onClick={() => addUserToTask(item.id, editedTask?.id)} key={index}><button className="main-dropdown-item btn main-text">
                                                            <img style={{
                                                                width: 40, height: 40, borderRadius: '100%', borderWidth: 1,
                                                                borderStyle: 'solid', borderColor: 'white'
                                                            }}
                                                                alt='' src={"data:image;base64," + item.fotoPerfilBase64} />  {item.nome}</button></li>
                                                    })}
                                                </ul>
                                            </div>
                                        </div>

                                        <div role='group' className="form-group pt-3 row px-3 me-4" >
                                            <div className="btn-group col-12 text-start ms-4 label-list" role='button' id="dropdownLabels" onClick={() => setIsVisible2(!isVisible2)} aria-expanded="false">
                                                <div className="dropdown" id='listOfLabels'>
                                                    <i className="fa fa-tag main-text me-2"></i>
                                                    {editedTask?.rotulos?.length > 0 ? editedTask?.rotulos?.map((label, index) => {
                                                        return <label className="label mx-1" key={index}
                                                            style={{
                                                                background: label.cor, fontSize: 14,
                                                                color: label.cor.includes('0') ? 'black' : 'white'
                                                            }}>
                                                            {label.nome}
                                                            <i role="button"
                                                                onClick={() => removeLabelFromTask(label.id)}
                                                                className="fa fa-xmark text-white ms-2"></i>
                                                        </label>
                                                    }) : ''}

                                                    <ul className="dropdown-menu main-dropdown overflow-y-small" aria-labelledby="dropdownLabels">
                                                        {labels.map((item, index) => {
                                                            return (
                                                                <li key={index}>
                                                                    <div className="main-dropdown-item d-flex">
                                                                        <div className="col-10 labelName">
                                                                            <span className="px-2 py-1 rounded-1 ms-2" id={item.id} style={{ color: item.cor.includes('0') ? 'black' : 'white', background: item.cor }} >
                                                                                {item.nome}
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-2">
                                                                            <button style={{ background: 'transparent', border: 0, outline: 0 }} type="button"
                                                                                className="main-text"
                                                                                onClick={() => {
                                                                                    setLabelName(item.nome)
                                                                                    setLabelId(item.id);
                                                                                    openModal('labelModal')
                                                                                }} >
                                                                                <i className="fa fa-pen main-text" >
                                                                                </i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>

                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="form-group row px-3 mt-4">
                                    <div className="col-12 text-start">
                                        <label htmlFor="txtTaskDescription" className="form-label fs-4 main-text">Task Description</label>
                                        <textarea style={{ minHeight: 150 }} value={editedTask?.descricao || ''} onChange={(e) => setTaskDescription(e.target.value)} className="ipt"></textarea>
                                    </div>
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>

                                <div className="form-group row px-3 mt-2">
                                    <div className="col-4 text-start">
                                        <label className="form-label fs-4 main-text">Bucket</label>
                                        <Select
                                            value={selectedBucket}
                                            onChange={setSelectedBucket}
                                            options={bucketComboBoxOptions}
                                            classNamePrefix="ipt-bg"
                                            defaultValue={selectedBucket}
                                        />
                                    </div>
                                    <div className="col-4 text-start">
                                        <label className="form-label fs-4 main-text">Priority *</label>
                                        <Select
                                            value={selectedPriority}
                                            defaultValue={selectedPriority}
                                            onChange={setSelectedPriority}
                                            options={prioritiesOptions}
                                            classNamePrefix="ipt-bg"
                                            isClearable={true}

                                        />
                                    </div>
                                    <div className="col-4 text-start">
                                        <label className="form-label fs-4 main-text">Status *</label>
                                        <Select
                                            value={selectedStatus}
                                            defaultValue={selectedStatus}
                                            onChange={setSelectedStatus}
                                            options={statusComboBoxOptions}
                                            isClearable={true}
                                            classNamePrefix="ipt-bg"
                                        />
                                    </div>
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>

                                <div className="form-group row px-3">
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4 text-start">
                                        <label htmlFor="txtDescription" className="form-label fs-4 main-text col-12">Start Date</label>
                                        <DatePicker
                                            showIcon
                                            className="main-text ipt-bg rounded border-0"
                                            locale={navigator.language}
                                            isClearable
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4 text-start">
                                        <label htmlFor="txtDescription" className="form-label fs-4 main-text col-12">End Date</label>
                                        <DatePicker
                                            showIcon
                                            className="main-text ipt-bg rounded border-0"
                                            locale={navigator.language}
                                            isClearable
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}

                                        />
                                    </div>
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>
                                {editMode && (<>
                                    <div className="form-group row px-3 pb-3 mt-3">
                                        <div className="col-12 text-start">
                                            <label className="main-text fw-bold fs-5">Attaches</label>
                                        </div>
                                    </div>

                                    <div className="form-group row px-3">
                                        <div className="text-start col-12">
                                            <label className="ipt-file" htmlFor="fileAttach">Add attach</label>
                                        </div>
                                        <input className="d-none" id='fileAttach' onChange={(e) => addAttach(e.target.files)} type="file" />
                                    </div>

                                    <div className="form-group row px-3">

                                        {editedTask?.anexos?.map((item, index) => {
                                            return <div key={index} role="button" onClick={() => { handleOpenFile(item) }}
                                                className="text-start mt-3">

                                                {
                                                    item.nomeArquivo.includes('.png') || item.nomeArquivo.includes('.jpg') ?
                                                        <img id={'attach' + item.id} alt='' style={{
                                                            width: 60, height: 40,
                                                        }} src={"data:image;base64," + item.arquivoBase64}
                                                        /> : <i className="fa fa-play main-text mx-4"></i>
                                                }

                                                <span className="ms-2 main-text">{item.nomeArquivo}</span>
                                            </div>
                                        }
                                        )}
                                    </div>

                                    <div className="form-group row px-3 pb-3 mt-5">
                                        <div className="col-12 text-start">
                                            <label className="main-text fs-5 fw-bold">Comments</label>
                                        </div>
                                    </div>

                                    <div className="form-group row px-3">

                                        <textarea className="ipt mb-4" id='txtComment'></textarea>
                                        <div className="px-3 text-end">
                                            <button style={{ width: 'fit-content' }}
                                                type='button' onClick={addComment}
                                                className="button-cancel-outline ">Add comment</button>
                                        </div>
                                        {editedTask?.comentarios?.map((item, index) => {
                                            return <div key={index} className="my-3 row pt-4">
                                                <span className="main-text col-3 text-start"> {item.usuarioNome}</span>
                                                <span className="main-text col-3 text-start"> {new Date(item.dataInclusao).toLocaleString()}</span>
                                                <i onClick={() => removeComment(item.id)} role="button" className="fa fa-trash col-6 text-danger text-end"></i>
                                                <span className="ipt mt-2 text-start" style={{ minHeight: 50 }} >
                                                    {item.texto}
                                                </span>
                                            </div>
                                        })}


                                    </div>
                                </>)}
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button onClick={() => onClose()} type="button" className="button-cancel text-start" data-bs-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" onClick={() => { global.util.isNullOrEmpty(editedTask?.id) ? taskCreate() : taskUpdate() }}
                                    type='button' className='button text-end'>SAVE</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ModalSaveLabel labelId={labelId} nameLabel={labelName}
            />
        </>
    )
}
