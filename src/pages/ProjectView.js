import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import { React, useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/Project.css'
import ProjectHeader from '../components/ProjectHeader'
import { createBucket, getBuckets } from '../stores/bucket'
import global from '../stores/global'
import { getUserEmail, isAuthenticated } from '../stores/user'
import MainHeader from '../components/MainHeader'
import Bucket from '../components/Bucket'
import { useNavigate } from "react-router-dom";
import { deleteCookie } from '../services/cookie-handler'

export default function Project() {

    const { id } = useParams();
    const [buckets, setBuckets] = useState([]);
    const memoizedGetBuckets = useMemo(() => () => getBuckets(id), [id]);

    const navigate = useNavigate();

    const fetchBuckets = useCallback(async () => {
        const bukets = await memoizedGetBuckets(id);
        setBuckets(bukets?.data);

    }, [id, memoizedGetBuckets]);

    useEffect(() => {
        if (isAuthenticated() === false) {
            deleteCookie('kanplan_token');
            navigate('/Login');
        }
        fetchBuckets();
    }, [navigate, memoizedGetBuckets, id, fetchBuckets]);

    async function bucketCreate(bucketName) {
        global.ui.showLoading('Creating bucket ');
        const resp = await createBucket({
            ProjetoId: id,
            Nome: bucketName,
            UsuarioInclusao: getUserEmail()
        });

        if (resp?.status === 200 || resp?.status === 201) {
            global.ui.removeLoading();
            global.ui.notification.success('bucket created succesfully');
            setTimeout(() => {
                window.location.reload();
            }, 2800);

        }
        else if (resp.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
        else
            global.ui.notification.error(resp?.data);

        global.ui.removeLoading();
    }

    const Input = () => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                bucketCreate(event.target.value);
            }
        }

        return <input type="text" onFocus={(e) => e.target.value = ''}
            className='ipt-span col-11' onChange={handleKeyDown} placeholder='Add new bucket'
            onBlur={(e) => {
                if (global.util.isNullOrEmpty(e.target.value) === false) {
                    bucketCreate(e.target.value)
                }
            }} />

    }

    return (
        <div className='main px-5'>
            <MainHeader />
            <ProjectHeader projectId={id} />
           
            <div className='row overflow-x'>

                {buckets.map((bucket, index) => {

                    return (<Bucket key={index} bucketId={bucket.id} />)
                })}

                <div className='my-5 me-4 col-2'>
                    <div className='bucket'>
                        <div className='text-start'>
                            <Input />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}