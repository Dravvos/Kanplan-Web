import '../styles/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { useState, useEffect } from 'react';
import { login, signUp } from '../stores/login';
import global from '../stores/global';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../stores/user';

function Login() {

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
    const [passwordSignUpAgain, setPasswordSignUpAgain] = useState('');
    const [fadeIn, setFadeIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated() === true) {
            navigate('/Projects');
        }
        setFadeIn(true);

    }, [navigate])

    async function loginUser() {
        global.ui.showLoading('Logging in')
        if (email === null || email === undefined || email === '')
            console.log('Email can not be empty');

        const resp = await login(
            { login: email, password: password }
        )

        if (resp === true) {
            global.ui.removeLoading();
            navigate('/Projects');
        }
        else
            global.ui.notification.error('Login failed');
        
        global.ui.removeLoading();
    }

    async function signUpUser() {

        global.ui.showLoading()
        if (passwordSignUp !== passwordSignUpAgain) {
            global.ui.notification.error('Passowrds are not equal');
            global.ui.removeLoading();
            return false;
        }
        var resp = await signUp({
            Nome: name,
            Email: emailSignUp,
            Hash: passwordSignUp
        })

        console.log("response: ", resp);
        if (resp?.status === 201 || resp?.status === 200) {
            resp = await login(
                { login: email, password: password }
            )
            global.ui.notification.success('Signed Up successfully');
            setTimeout(() => {
                navigate('/Projects');
            }, 3000);
        }
        else
            global.ui.notification.error(resp?.title);

        global.ui.removeLoading();
        return false
    }



    const handleStepChange = (newStep) => {
        setFadeIn(false);
        setTimeout(() => {
            setStep(newStep);
            setFadeIn(true);
        }, 300);

    };

    return (
        <div className='body'>
            {
                step === 1 && (
                    <div className={`${fadeIn ? 'fade-in' : ''}`}>
                        <h1 className='m-5'>Login</h1>
                        <form>
                            <div className="form-group row">
                                <label htmlFor="txtEmail" className="form-label fs-4">Email</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} id="txtEmail" name="txtEmail" type="email" required className="ipt" />
                                <div className="col-10">
                                    <div className="input-group"></div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="txtPassword" className="form-label fs-4">Password</label>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} id="txtPassword" name="txtPassword" type="password" required="required" className="ipt" />
                                <div className="col-10">
                                    <div className="input-group"></div>
                                </div>
                            </div>

                            <div>
                                <button onClick={loginUser} type='button' className='button'>LOGIN</button>
                            </div>
                        </form>
                        <p className="forgot-password">Forgot your password? <button className='link btn' >Click here</button></p>
                        <p className="forgot-password">Don't have an account? <button className='link btn' href='#' onClick={() => handleStepChange(2)}>Sign Up</button></p>
                        <footer className="footer">
                            <p>&copy; 2024 KanPlan. All rights reserved.</p>
                        </footer>

                    </div>
                )}

            {
                step === 2 && (
                    <div className={`${fadeIn ? 'fade-in' : ''}`}>
                        <h1 className='m-5'>Sign Up</h1>
                        <form>
                            <div className="form-group row">
                                <label htmlFor="txtName" className="form-label fs-4">Full Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} id="txtName" name="txtName" type="text" required className="ipt" />
                                <div className="col-10">
                                    <div className="input-group"></div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="txtEmail" className="form-label fs-4">Email</label>
                                <input value={emailSignUp} onChange={(e) => setEmailSignUp(e.target.value)} id="txtEmail" name="txtEmail" type="text" required className="ipt" />
                                <div className="col-10">
                                    <div className="input-group"></div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="txtPassword" className="form-label fs-4">Password</label>
                                <input value={passwordSignUp} onChange={(e) => setPasswordSignUp(e.target.value)} id="txtPassword" name="txtPassword" type="password" required className="ipt" />
                                <div className="col-10">
                                    <div className="input-group"></div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="txtPasswordRepeat" className="form-label fs-4">Repeat Password</label>
                                <input value={passwordSignUpAgain} onChange={(e) => setPasswordSignUpAgain(e.target.value)} id="txtPasswordRepeat" name="txtPasswordRepeat" type="password" required className="ipt" />
                                <div className="col-10">
                                    <div className="input-group"></div>
                                </div>
                            </div>

                            <div>
                                <button onClick={signUpUser} type='button' className='button'>SIGNUP</button>
                            </div>
                        </form>
                        <p className="forgot-password">Already have an account? <button className='link btn' onClick={() => handleStepChange(1)}>Log in</button></p>
                        <footer className="footer">
                            <p>&copy; 2024 KanPlan. All rights reserved.</p>
                        </footer>

                    </div>
                )}
            <ToastContainer />
        </div>
    )
}

export default Login