import { React, useState, useEffect, useCallback, useRef } from "react";
import { getUser, isAuthenticated, updateUser } from '../stores/user'
import MainHeader from '../components/MainHeader'
import '../styles/User.css'
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../services/cookie-handler";
import global from "../stores/global";

export default function User() {

    const [user, setUser] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState('');
    const navigate = useNavigate();
    const fileUploadRef = useRef(null);
    const inputPhotoRef = useRef(null);
    const [passwordChanged, setPasswordChanged] = useState(null);

    const setUserData = useCallback(async () => {
        const userData = await getUser();
        if (userData.status === 200) {
            const res = userData.data;
            console.log('É tu meu patrão: ', res)
            setUser(res);
            setProfilePhoto(res.fotoPerfilBase64)
        }
        else if (userData.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
    }, [navigate]);

    useEffect(() => {
        if (isAuthenticated() === false) {
            deleteCookie('kanplan_token');
            navigate('/Login');
        }
        setUserData();

    }, [setUserData, navigate])

    const handleFileClick = (e) => {
        // Trigger the file input click when the image is clicked
        inputPhotoRef.current.click();
        e.preventDefault();
    };

    const handleFileChange = () => {
        const file = inputPhotoRef.current.files[0];
        var reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        }

        reader.onload = async function (event) {
            const base64File = event.target.result.split(',')[1];
            setProfilePhoto(base64File);
        };
    };

    async function userUpdate() {
        if (global.util.isNullOrEmpty(passwordChanged) === false) {
            setUser({
                id: user.id,
                nome: user.nome,
                email: user.email,
                hash: passwordChanged,
                fotoPerfilBase64: profilePhoto,
                dataInclusao: user.dataInclusao
            })

            const res = await updateUser(user.id, user)
            if (res.status === 200) {
                global.ui.notification.success('Informations updated successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 2800);
            }
            else if (res.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
        else {
            const newUser =
            {
                id: user.id,
                nome: user.nome,
                email: user.email,
                fotoPerfilBase64: profilePhoto,
                dataInclusao: user.dataInclusao
            }
            const res = await updateUser(user.id, newUser)
            if (res.status === 200) {
                global.ui.notification.success('Informations updated successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 2800);
            }
            else if (res.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
        }
    }

    return (
        <div className="main">
            <MainHeader />
            <main className="mt-5">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-3 col-sm-2 col-md-1 text-end">
                            <img ref={fileUploadRef} id='fileUpload' src={"data:image;base64," + profilePhoto} className="border img" alt="" onClick={handleFileClick} />
                            <input id='inputPhoto' type="file" accept="image/*" className="d-none" ref={inputPhotoRef} onChange={handleFileChange} />
                        </div>
                        <div className="col-6 text-start">
                            <p className="main-text fs-3"> {user?.nome}</p>
                            <p className="main-text">{user?.email}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="row justify-content-center">
                        <div className="col-8 col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-3 text-start">
                            <label className="main-text pb-2">Name: </label>
                            <input className="ipt" value={user?.nome} />
                        </div>

                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-8 col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-3 text-start">
                            <label className="main-text pb-2">Change Password </label>
                            <input className="ipt" type="password" value={passwordChanged} onChange={(e) => setPasswordChanged(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={userUpdate} className="button mt-5 btn-block" type='button-lg' >Save</button>
                </div>

            </main>
        </div>
    )
}