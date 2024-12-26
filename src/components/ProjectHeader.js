import { React, useState, useEffect, useCallback } from "react";
import '../styles/Project.css'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import { getProject } from "../stores/project";
import { deleteCookie } from "../services/cookie-handler";
import { useNavigate } from "react-router-dom";

export default function ProjectHeader(projeto) {

    const [project, setProject] = useState(null);
    const navigate =useNavigate();

    const getProjectById = useCallback(async () => {

        const resp = await getProject(projeto.projectId);

        if (resp?.status === 200) {
            setProject(resp.data);
        } 
        else if (resp.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
        else
            console.error(resp);

    }, [projeto, navigate]);

    useEffect(() => {
        getProjectById();
    }, [getProjectById])

    function shareProject() {

    }

    return (
        <div>
            <header>
                <nav className='navbar navbar-expand-lg'>
                    <div className='container-fluid'>
                        <a className="navbar-brand main-text" href="#">{project?.nome}</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">

                            <button data-bs-toggle="modal" data-bs-target="#shareProjectModal" className="btn btn-outline-secondary main-text">
                                <i className="fa fa-user-plus"></i> Compartilhar</button>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="modal fade" id="shareProjectModal" tabIndex="-1" aria-labelledby="createProjectModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content main-modal">
                        <div className="modal-body">
                            <p>Type the email of the user you want to share.</p>
                            <p>To share with more users, separate the emails with comma</p>
                            <input className="ipt" type='text' placeholder="user email" />
                            <button type="button" className="button-cancel" onClick={shareProject}>Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}