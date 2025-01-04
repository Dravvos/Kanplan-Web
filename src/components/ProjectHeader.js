import { React, useState, useEffect, useCallback } from "react";
import '../styles/Project.css'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import { assignUserToProject, getProject } from "../stores/project";
import { deleteCookie } from "../services/cookie-handler";
import { useNavigate } from "react-router-dom";
import global from "../stores/global";
import { get } from '../services/api-handler'

export default function ProjectHeader(projeto) {

    const [emails, setEmails] = useState('');
    const [project, setProject] = useState(null);
    const navigate = useNavigate();

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

    async function shareProject() {
        if(emails.includes(',')===false)
        {
            global.ui.notification.warning('The separator character is ","');
            return;
        }
        let userEmails = emails.split(',');
        let userIds = [];
        userEmails.forEach(async (item) => {
            try {
                const resp = await get('User/' + item.trim());
                if (resp.status === 200) {
                    userIds.push(resp.data?.id)
                }
            }
            catch (err) {
                console.error(err);
            }
        });

        for (let i = 0; i < userIds.length; i++) {
            await assignUserToProject(userIds[i], projeto.projectId);
        }

        global.ui.notification.success('User(s) added to project');
    }

    return (
        <div>
            <header>
                <nav className='navbar navbar-expand-lg'>
                    <div className='container-fluid'>
                        <span className="navbar-brand main-text ms-4">{project?.nome}</span>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">

                            <button data-bs-toggle="modal" data-bs-target="#shareProjectModal" className="btn btn-outline-secondary main-text">
                                <i className="fa fa-user-plus"></i> Add users</button>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="modal fade" id="shareProjectModal" tabIndex="-1" aria-labelledby="createProjectModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content main-modal">
                        <div className="modal-body">
                            <p className="main-text">Type the email of the user you want to share.</p>
                            <p className="main-text">To share with more users, separate the emails with comma</p>
                            <input onChange={(e) => setEmails(e.target.value)} className="ipt" type='email' placeholder="user email" />
                            <button type="button" className="button mt-4" onClick={shareProject}>Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}