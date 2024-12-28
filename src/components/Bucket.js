import { React, useCallback, useEffect, useState, useRef } from "react";
import * as bootstrap from 'bootstrap';
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { getTasks, updateTask, deleteTask, getTask } from "../stores/task";
import { deleteBucket, getBucket, getBuckets, updateBucket } from "../stores/bucket";
import 'react-datepicker/dist/react-datepicker.min.css'
import { getTabelaGeral, getTabelasGerais } from "../stores/tabelaGeral";
import { getUserEmail } from "../stores/user";
import '../styles/Bucket.css'
import global from '../stores/global'
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/regular.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import { useNavigate } from "react-router-dom";
import { getUsers } from "../stores/project";
import { deleteCookie } from "../services/cookie-handler";
import $ from 'jquery'
import ModalSaveTask from "./ModalSaveTask";

export default function Bucket({ bucketId }) {

    const [tasks, setTasks] = useState([]);
    const [bucket, setBucket] = useState(null);
    const [selectedBucket, setSelectedBucket] = useState(null);
    const [projectUsers, setProjectusers] = useState([]);
    const [bucketName, setBucketName] = useState('');
    const [status, setStatus] = useState([]); // list of status of task for validation
    const [statusOptions, setStatusOptions] = useState([]); //list of status of task for combobox
    const [selectedPriority, setSelectedPriority] = useState([]);  //selected priority in combobox
    const [bucketOptions, setBucketOptions] = useState([]); //list of buckets for combobox
    const [selectedStatus, setSelectedStatus] = useState([]);  //selected status in combobox
    const [updatedDate, setUpdatedDate] = useState(''); //date when task was modified
    const [editedTask, setEditedTask] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const popoverRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 }); // Div position
    const buttonRefs = useRef([]); // Array de refs para os botões

    const navigate = useNavigate();

    const toggleVisibility = (index) => {
        setIsVisible(!isVisible);
        const buttonRect = buttonRefs.current[index].getBoundingClientRect();
        setPosition({
            top: buttonRect.bottom,
            left: buttonRect.right - 20,
        })
    };

    const fetchBucket = useCallback(async () => {
        const bucketResponse = await getBucket(bucketId);
        if (bucketResponse.status === 200) {
            setBucket(bucketResponse.data);
            setBucketName(bucketResponse.data?.nome);
            setSelectedBucket({ label: bucketResponse.data?.nome, id: bucketResponse.data?.id })
            const resp = await getUsers(bucketResponse.data?.projetoId);

            if (resp.status === 200) {
                setProjectusers(resp.data)
            }
            else if (resp.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }

            const bucketsResponse = await getBuckets(bucketResponse.data?.projetoId);
            if (bucketsResponse.status === 200) {
                var bucketOption = [];
                bucketsResponse.data?.forEach(item => {
                    bucketOption.push({ value: item.id, label: item.nome })
                });
                setBucketOptions(bucketOption);
            }
            else if (bucketsResponse.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
        else if (bucketResponse.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
    }, [navigate, bucketId])

    const fetchTasks = useCallback(async () => {
        try {
            const tasksResponse = await getTasks(bucketId);
            if (tasksResponse.status === 200) {
                setTasks(tasksResponse.data);
                console.log('tasks: ', tasksResponse.data);
            }
            else if (tasksResponse.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }

        } catch (err) {
            console.error(err);
        }
    }, [navigate, bucketId]);

    const fetchStatus = useCallback(async () => {
        try {
            const tgStatusReponse = await getTabelaGeral('Status');
            if (tgStatusReponse?.status === 200) {
                const tgiStatusResponse = await getTabelasGerais(tgStatusReponse?.data.id);
                if (tgiStatusResponse?.status === 200) {

                    var options = [];
                    tgiStatusResponse?.data.forEach(item => {
                        var option = { value: item.id, label: item.descricao };
                        options.push(option);

                    });
                    setStatusOptions(options);
                    setStatus(tgiStatusResponse?.data);
                }
                else if (tgiStatusResponse.status === 401) {
                    deleteCookie('kanplan_token')
                    navigate('Login')
                }
            }
            else if (tgStatusReponse.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
        catch (err) {
            console.error(err);
        }
    }, [navigate]);

    useEffect(() => {

        fetchBucket();
        fetchTasks();
        fetchStatus();

        if (isVisible === true) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        $('#taskModal').on('hidden.bs.modal', async function () {
            await clearFields();
        });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [bucketId, isVisible, fetchBucket, fetchTasks, fetchStatus])

    function handleEditTask(task) {
        setEditedTask(task);
        setSelectedPriority({ value: task.idTgprioridade, label: task.prioridadeDescricao });
        setSelectedStatus({ value: task.idTgstatus, label: task.statusDescricao });

        if (global.util.isNullOrEmpty(task.dataAlteracao) === false)
            setUpdatedDate(new Date(task.dataAlteracao).toLocaleString(navigator.language))
    }

    async function clearFields() {
        await setEditedTask(null);
        await setSelectedPriority(null);
        await setSelectedStatus(null);
        await setUpdatedDate(null);
    }

    async function updateTaskStatus(taskId) {
        global.ui.showLoading('Updating task ');

        const taskResp = await getTask(taskId);
        var task = taskResp.data;

        const statusFinished = status.find(x => x.sigla === "COMP");
        const statusPending = status.find(x => x.sigla === "PEND");

        if (task.idTgstatus === statusFinished.id)
            task.idTgstatus = statusPending.id
        else
            task.idTgstatus = statusFinished.id;

        task.usuarioAlteracao = getUserEmail();

        const resp = await updateTask(taskId, task);

        if (resp.status === 200) {
            await fetchTasks();
            global.ui.notification.success('Task status updated');
        }
        else if (resp.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
        global.ui.removeLoading();
    }

    const handleClickOutside = (event) => {
        if (popoverRef?.current && !popoverRef?.current.contains(event.target)) {
            setIsVisible(false);
        }
    }

    function confirmDeleteTask(taskId) {
        global.ui.confirm('Are you sure you want to delete this task?',
            async () => {
                global.ui.showLoading("Deleting Task ...");
                const resp = await deleteTask(taskId);
                if (resp.status === 200) {
                    global.ui.notification.success("Task deleted successfully");
                    await fetchTasks();
                }
                else if (resp.status === 401) {
                    deleteCookie('kanplan_token')
                    navigate('Login')
                }
                else


                    global.ui.removeLoading();
            }
        )
    }

    function confirmDeleteBucket(bucketId) {
        global.ui.confirm('Are you sure you want to delete this bucket? ',
            async () => {
                global.ui.showLoading('Deleting bucket ');
                try {
                    const resp = await deleteBucket(bucketId);
                    if (resp.status === 200) {
                        global.ui.notification.success('Bucket deleted successfully');
                        await fetchBucket()
                    }
                    else if (resp.status === 401) {
                        deleteCookie('kanplan_token')
                        navigate('Login')
                    }
                    else
                        ;
                }
                catch (err) {
                    console.error(err);
                }
                global.ui.removeLoading();
            }
        )
    }

    async function bucketUpdate(bucketName) {
        const resp = await updateBucket(bucketId, {
            Id: bucketId,
            ProjetoId: bucket?.projetoId,
            Nome: bucketName,
            UsuarioInclusao: getUserEmail()
        });

        if (resp?.status === 200 || resp?.status === 201) {
            global.ui.notification.success('bucket updated succesfully');
            await fetchBucket();
        }
        else if (resp.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
        else
            console.error(resp);

    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            bucketUpdate(event.target.value);
        }
    }

    async function openModalEdit(modalId, task) {
        handleEditTask(task)

        await setShowModal(true);
        var modalElement = $('#' + modalId);
        if (modalElement.length > 0) {
            var modal = new bootstrap.Modal(modalElement[0]);
            modal.show();
        } else {
            console.error('Modal element with id ' + modalId + ' not found.');
        }
    }

    async function openModal(modalId) {

        await setEditedTask(null);
        await setShowModal(true);
        var modalElement = $('#' + modalId);
        if (modalElement.length > 0) {
            var modal = new bootstrap.Modal(modalElement[0]);
            modal.show();
        } else {
            console.error('Modal element with id ' + modalId + ' not found.');
        }
    }

    return (
        <div className='my-5 me-4 col-2'>

            <div className='bucket'>
                <div className='text-start'>
                    <input onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setBucketName(e.target.value)} className='ipt-span' value={bucketName || ''} />
                    <i onClick={() => confirmDeleteBucket(bucket?.id)} role='button' className="fa fa-trash main-text text-end ms-3"></i>
                </div>

                <div className='mt-2'>
                    <button onClick={() => { openModal('taskModal', null, true) }} type="button" className='w-100 btn button-add-task main-text'>
                        <i className='fa fa-plus'></i>
                        Add Task
                    </button>
                </div>
            </div>

            <div className='overflow-y'>
                {tasks?.length ? (
                    tasks.map((task, index) => (

                        <div key={index} className='task'>
                            <div className='task-body'>
                                <div className="d-flex">
                                    {isVisible &&
                                        <div
                                            className="ipt-bg"
                                            id="popover"
                                            ref={popoverRef}
                                            style={{
                                                position: 'absolute',
                                                top: position.top + 'px',  // Positioned below the button
                                                left: position.left + 'px',
                                                marginTop: '5px',
                                                padding: '10px',
                                                border: '1px solid #ccc',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                zIndex: 1000,
                                                width: '150px',
                                            }}
                                        >
                                            <div className="row px-3 justify-content-center">
                                                <button onClick={() => { openModalEdit("taskModal", task) }} className="btn main-bg mb-2 main-text"><i className="fa fa-pen-to-square"></i> Editar</button>
                                                <button onClick={() => confirmDeleteTask(task.id)} className="btn main-bg mt-3 main-text"><i className="fa fa-trash"></i> Excluir</button>
                                            </div>

                                        </div>
                                    }
                                    {task.rotulos ? task.rotulos.map((rotulo, index) => (
                                        <label key={index} className="label mx-1" style={{
                                            color: rotulo.cor.includes('0') ? 'black' : 'white',
                                            backgroundColor: rotulo.cor
                                        }}>{rotulo.nome}</label>
                                    )) : ""}
                                    <i ref={(el) => (buttonRefs.current[index] = el)} role='button' onClick={() => toggleVisibility(index)} className="fa fa-ellipsis main-text ms-2 w-100 text-end"
                                    ></i>

                                </div>
                                <div className="text-start">
                                    <i role='button' onClick={() => updateTaskStatus(task.id)} className={task.statusSigla === "COMP" ? "fa fa-circle-check main-text" : "fa-regular fa-circle main-text"}></i>
                                    <span className='main-text ms-2'>{task.nome}</span>
                                </div>

                                <div className="mt-3 text-start">
                                    {
                                        task.prioridadeSigla === "URGT" ? <i className="fa-solid fa-bell text-danger"></i> :
                                            task.prioridadeSigla === "HIGH" ? <i className="fa fa-exclamation text-danger"></i> : ""
                                    }
                                </div>
                            </div>
                            <div className='task-footer d-flex justify-content-between'>

                                <span className={new Date().toISOString() > new Date(task.dataFim).toISOString() ? 'main-text py-1 px-2 rounded bg-danger' : 'main-text'}>
                                    <i className="fa fa-calendar-days me-2"></i>
                                    {new Date(task.dataFim).toLocaleDateString()}
                                </span>
                                {task.usuariosAtrelados?.length > 0 ?
                                    task.usuariosAtrelados.map((user, index) => {
                                        return <img key={index} style={{
                                            width: 30, height: 30, borderRadius: '100%', borderWidth: 1,
                                            borderStyle: 'solid', borderColor: 'white'
                                        }}
                                            alt='' src={"data:image;base64," + user.fotoPerfilBase64} />
                                    })
                                    : <i className='fa fa-user-plus main-text'></i>}


                            </div>

                        </div>
                    ))
                ) : (
                    <div></div>
                )}

                <ToastContainer />
            </div>

            {showModal &&
                (
                    <ModalSaveTask bucketId={bucketId} bucketComboBoxOptions={bucketOptions}
                        projectUsers={projectUsers} statusComboBoxOptions={statusOptions}
                        bucketSelected={selectedBucket} prioritySelected={selectedPriority}
                        updatedDate={updatedDate} statusSelected={selectedStatus} task={editedTask}
                        onClose={() => {
                            setEditedTask(null);
                            setSelectedPriority(null);
                            setSelectedStatus(null);
                            setUpdatedDate(null);
                        }}
                        callbackSuccess={async () => {
                            await fetchTasks();
                            getTask(editedTask?.id).then(res => {
                                if (res.status === 200)
                                    handleEditTask(res.data)
                            })
                        }} />

                )

            }
        </div>
    )
}