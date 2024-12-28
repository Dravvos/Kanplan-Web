import { React, useState, useCallback } from "react";
import '../styles/Project.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { post } from "../services/api-handler";
import global from "../stores/global";
import { createBucket } from "../stores/bucket"
import { getUserEmail } from "../stores/user";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../services/cookie-handler";

export default function Header() {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const createProject = useCallback(async () => {


        try {
            global.ui.showLoading('Creating project ...');
            const resp = await post('Project', {
                Nome: name,
                Descricao: description,
                UsuarioInclusao: getUserEmail(),
            });

            if (resp.status === 201 || resp.status === 200) {

                const response = await createBucket({
                    Nome: 'Pending Tasks',
                    ProjetoId: resp?.data,
                    UsuarioInclusao: getUserEmail(),

                });
                if (response.status === 201 || response.status === 200) {
                    global.ui.notification.success('Project created successfully')
                    global.ui.removeLoading();
                    setTimeout(() => {
                        navigate('/Projects/' + resp?.data);
                    }, 3000);
                }
                else if (response.status === 401) {
                    deleteCookie('kanplan_token')
                    navigate('Login')
                }
            }
            else if (resp.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            global.ui.removeLoading();
        }

    }, [name, description, navigate])

    return (
        <div>
            <header className="border-bottom px-4">
                <nav className="navbar navbar-expand-lg ">
                    <div className="container-fluid">
                        <span className="navbar-brand main-text">Kanplan</span>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active main-text" aria-current="page" href="../">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link main-text" href="../Projects">Projects</a>
                                </li>
                                <li className="nav-item">
                                    <button data-bs-toggle="modal" data-bs-target="#createProjectModal" className="nav-link main-text">Create Project</button>

                                </li>
                            </ul>
                            <a title="Your profile" href="/User" > <i className='fa fa-user main-text'></i></a>

                        </div>
                    </div>
                </nav>
            </header>

            <div className="modal fade" id="createProjectModal" tabIndex="-1" aria-labelledby="createProjectModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content main-modal">
                        <div className="modal-header">
                            <h1 className="modal-title fs-2 main-text" id="createProjectModalLabel">Create project</h1>
                            <button type="button" className="btn-close-white btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="form-group row px-3">
                                    <label htmlFor="txtName" className="form-label fs-4 main-text">Name *</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} id="txtName" name="txtName" required className="ipt" />
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>
                                <div className="form-group row px-3">
                                    <label htmlFor="txtDescription" className="form-label fs-4 main-text">Description</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="txtDescription" name="txtDescription" className="ipt">
                                    </textarea>
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="button-cancel" data-bs-dismiss="modal">Close</button>
                                <button type='button' className='button' onClick={createProject}>Create</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}