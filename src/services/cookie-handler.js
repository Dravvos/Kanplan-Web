function setCookie(name, val) {
    const date = new Date();
    const value = val;

    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000)); /* expira em 1 dia */

    document.cookie = name+"="+value+"; expires="+date.toUTCString()+"; path=/";
}

function getCookie(cookieName) {
    // Obtém a string de cookies
    const cookieString = document.cookie;

    // Divide a string de cookies em pares chave-valor
    const cookies = cookieString.split(';');

    // Procura pelo cookie desejado
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        
        // Verifica se o cookie começa com o nome desejado
        if (cookie.indexOf(cookieName + '=') === 0) {
            // Retorna o valor do cookie
            try {
                return JSON.parse(cookie.substring(cookieName.length + 1));
            } catch {
                return cookie.substring(cookieName.length + 1)
            }
        }
    }

    // Retorna null se o cookie não for encontrado
    return undefined;
}

function deleteCookie(name) {
    const date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000)); /* põe a data de ontem para invalidar o cookie */
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}

export { setCookie, getCookie, deleteCookie };