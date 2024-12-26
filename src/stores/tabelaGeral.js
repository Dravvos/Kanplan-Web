import { get, put, deletar, post } from "../services/api-handler";

async function getTabelasGerais(TabelaGeralId) {
    try {
        const resposta = await get('TabelaGeral/GetTabelaGeralItems?tabelaGeralId=' + TabelaGeralId);
        return resposta;
    } catch (error) {
        console.log(error)
    }
}

async function getTabelaGeral(name) {
    try {
        const resposta = await get('TabelaGeral/GetTabelaGeral/' + name);
        return resposta;
    } catch (error) {
        console.error(error)
    }
}

async function updateTabelaGeralItem(id, item) {
    try {
        const resposta = await put('TabelaGeral/UpdateTabelaGeralItem/' + id, item);
        return resposta;
    }
    catch (ex) {
        console.error(ex)
    }
}

async function deleteTabelaGeralItem(id) {
    try {
        const resposta = await deletar('TabelaGeral/DeleteTabelaGeralItem/' + id);
        return resposta;
    }
    catch (ex) {
        console.error(ex)
    }
}
async function createTabelaGeral(tg, tgi) {
    try {
        var resposta = await post('TabelaGeral/CreateTabelaGeral', tg)
        if (resposta.status === 200 || resposta.status === 201) {
            console.log(resposta);
            tgi.TabelaGeralId = resposta.data;
            resposta = await post('TabelaGeral/CreateTabelaGeralItem', tgi);
        }
        return resposta
    }
    catch (ex) {
        console.log(ex)
    }
}

async function createTabelaGeralItem(tgi) {
    try {

        const resposta = await post('TabelaGeral/CreateTabelaGeralItem', tgi)
        return resposta
    }
    catch (ex) {
        console.error(ex)
    }
}

export {
    getTabelasGerais, updateTabelaGeralItem, deleteTabelaGeralItem,
    createTabelaGeral, createTabelaGeralItem, getTabelaGeral
}