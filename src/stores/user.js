import { get, put } from '../services/api-handler'
import { getCookie } from '../services/cookie-handler';
import { jwtDecode } from 'jwt-decode';
import global from './global';

function isAuthenticated() {
    try {
        const cookie = getCookie("kanplan_token");
        if (global.util.isNullOrEmpty(cookie) === false) {
            const userData = getUserData();
            if (+(new Date().getTime() / 1000) >= +userData.exp)
                return false
            return true;
        }
        return false;
    } catch {
        return false;
    }
}


function getUserData() {
    return jwtDecode(getCookie("kanplan_token"));
}


const getUserEmail = () => getUserData().email

const getUserId = () => getUserData().UsuarioId;


async function getProjects() {
    const userId = getUserId();

    const resp = await get('Project/GetProjects/' + userId);

    if (resp?.status === 200)
        return resp?.data;

}

async function getUser() {
    try {
        const resp = await get('User/' + getUserId());
        return resp;
    }
    catch (err) {
        console.error(err);
    }
}

async function updateUser(userId, user) {
    try {
        const resp = await put('User/' + userId, user);
        return resp;
    }
    catch (err) {
        console.error(err);
    }
}

export { getUser, isAuthenticated, getUserData, getProjects, getUserEmail, getUserId, updateUser }