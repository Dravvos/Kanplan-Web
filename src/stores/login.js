import { post } from "../services/api-handler";
import { setCookie } from "../services/cookie-handler"


async function login(args) {
    try {
        const resposta = await post("Authentication/Login", args)
        if (resposta.status === 200) {
            const token = resposta.data.split(' ')[1];
            setCookie("kanplan_token", token);
            console.log('Welcome my Friend')
            return true
        }
        return false
    } catch (error) {
        console.error(error)
    }
}

async function signUp(args) {
    try {
        const resposta = await post('Authentication/SignUp', args)
        if (resposta.status === 200 || resposta.status === 201) {
            return resposta
        }
        return false
    } catch (error) {
        console.error(error)
    }
}

export { login, signUp }