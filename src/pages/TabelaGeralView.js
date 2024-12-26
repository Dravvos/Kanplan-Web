import { React, useCallback, useEffect, useState } from "react";
import {
    getTabelasGerais,
    createTabelaGeral, updateTabelaGeralItem,
    createTabelaGeralItem, deleteTabelaGeralItem
} from "../stores/tabelaGeral";
import DataTable, { createTheme } from "react-data-table-component";
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { getUserEmail, isAuthenticated } from "../stores/user";
import global from "../stores/global"
import MainHeader from "../components/MainHeader"
import 'react-toastify/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../services/cookie-handler";

export default function TabelaGeral() {

    createTheme('dark', {
        background: {
            default: 'transparent',
        },
    });

    function handleEdit(row) {
        setTgId(row.tabelaGeral.id);
        setTgNome(row.tabelaGeral.nome);
        setTgDescricao(row.tabelaGeral.descricao);
        setTgiId(row.id);
        setTgiSigla(row.sigla);
        setTgiDescricao(row.descricao);
    }

    function handleCreate(row) {
        setTgId(row.tabelaGeral.id);
        setTgNome(row.tabelaGeral.nome);
        setTgDescricao(row.tabelaGeral.descricao);
    }

    const [tabelasGerais, setTabelasGerais] = useState([]);
    const [tgiSigla, setTgiSigla] = useState('');
    const [tgiDescricao, setTgiDescricao] = useState('');
    const [tgNome, setTgNome] = useState('');
    const [tgDescricao, setTgDescricao] = useState('')
    const [tgiId, setTgiId] = useState('');
    const [tgId, setTgId] = useState('')
    const navigate = useNavigate();

    const fetchTabelasGerais = useCallback(async () => {
        const res = await getTabelasGerais('');
        if (res.status === 200) {
            setTabelasGerais(res.data);
        }
        else if (res.status === 401) {
            deleteCookie('kanplan_token')
            navigate('Login')
        }
    }, [navigate])

    useEffect(() => {
        if (isAuthenticated() === false) {
            deleteCookie('kanplan_token');
            navigate('/Login');
        } else {
            fetchTabelasGerais();
        }
    }, [navigate, fetchTabelasGerais])


    function clearFields() {
        setTgiSigla('');
        setTgiId('');
        setTgiDescricao('');
        setTgId('');
        setTgNome('');
        setTgDescricao('');
    }

    async function salvarTabelaGeral() {
        global.ui.showLoading('Salvando Tabela Geral');
        var resp;
        if (global.util.isNullOrEmpty(tgId) && global.util.isNullOrEmpty(tgiId)) {
            resp = await createTabelaGeral({
                Id: null,
                Nome: tgNome,
                Descricao: tgDescricao,
                UsuarioInclusao: getUserEmail()
            }, {
                Id: null,
                TabelaGeralId: tgId,
                Sigla: tgiSigla,
                Descricao: tgiDescricao,
                UsuarioInclusao: getUserEmail()
            })

            if (resp?.status === 200 || resp?.status === 201) {
                global.ui.removeLoading();
                global.ui.notification.success('Tabela Geral criada com sucesso');
                await fetchTabelasGerais()
            }
            else if (resp.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
            else
                global.ui.notification.error(resp?.data)
        }
        else if (global.util.isNullOrEmpty(tgId) === false && global.util.isNullOrEmpty(tgiId)) {
            resp = await createTabelaGeralItem({
                Id: null,
                Sigla: tgiSigla,
                Descricao: tgiDescricao,
                TabelaGeralId: tgId,
                UsuarioInclusao: getUserEmail()
            });
            if (resp?.status === 200 || resp?.status === 201) {                
                global.ui.removeLoading();
                global.ui.notification.success('Item da tabela geral criado com sucesso');
                await fetchTabelasGerais()
            }
            else if (resp.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
            else
                global.ui.notification.error(resp?.data)
        }
        else if (global.util.isNullOrEmpty(tgId) === false && global.util.isNullOrEmpty(tgiId) === false) {
            resp = await updateTabelaGeralItem(tgiId, {
                Id: tgiId,
                TabelaGeralId: tgId,
                Sigla: tgiSigla,
                Descricao: tgiDescricao,
                UsuarioAlteracao: getUserEmail()
            });
            if (resp?.status === 200 || resp?.status === 201) {
                global.ui.removeLoading();        
                global.ui.notification.success('Item da tabela geral atualizado com sucesso');
                await fetchTabelasGerais()
            }
            else if (resp.status === 401) {
                deleteCookie('kanplan_token')
                navigate('Login')
            }
            else
                global.ui.notification.error(resp?.data)
        }

        global.ui.removeLoading();

    }

    function confirmDeleteTabelaGeralItem(tabelaGeralItemId) {
        global.ui.confirm('Are you sure you want to delete this item? ',
            async () => {
                global.ui.showLoading('Deleting Item ');
                try {
                    const resp = await deleteTabelaGeralItem(tabelaGeralItemId);
                    if (resp.status === 200) {
                        global.ui.removeLoading();
                        global.ui.notification.success('Item deleted successfully');
                        await fetchTabelasGerais();
                    }
                    else if (resp.status === 401) {
                        deleteCookie('kanplan_token')
                        navigate('Login')
                    }
                    else
                        global.ui.notification.error(resp.title);
                }
                catch (err) {
                    console.error(err);
                }
                global.ui.removeLoading();
            }
        )
    }

    const columns = [
        {
            name: "Nome",
            selector: (row) => row.tabelaGeral.nome,
            sortable: true,

        },
        {
            name: 'Tabela Geral',
            selector: (row) => row.tabelaGeral.descricao,
            sortable: true,

        },
        {
            name: "Sigla",
            selector: (row) => row.sigla,
            sortable: true,

        },
        {
            name: "Descrição",
            selector: (row) => row.descricao,
            sortable: true,

        },
        {
            name: "Ações",
            cell: row => (
                <div className="d-flex">
                    <div className="mx-1">
                        <button className="button-outline" data-bs-toggle="modal" data-bs-target="#tabelaGeralModal" onClick={() => handleCreate(row)}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                    <div className="mx-1">
                        <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#tabelaGeralModal" onClick={() => handleEdit(row)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                    </div>
                    <div className="mx-1">
                        <button className="btn btn-outline-danger" onClick={() => confirmDeleteTabelaGeralItem(row.id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>

                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '150px'
        }
    ]

    return (
        <div className="main">
            <MainHeader />
            <div className="container-fluid w-75 text-start pt-5">
                <button type='button' data-bs-toggle="modal" data-bs-target="#tabelaGeralModal" className="button">Nova Tabela Geral</button>
                <DataTable
                    columns={columns}
                    data={tabelasGerais}
                    fixedHeader
                    pagination
                    theme="dark"
                    highlightOnHover
                    striped
                    responsive
                />
            </div>

            <div className="modal fade" id="tabelaGeralModal" tabIndex="-1" aria-labelledby="tabelaGeralModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content main-modal">
                        <div className="modal-header">
                            <h1 className="modal-title fs-2 main-text" id="tabelaGeralModalLabel">Criar Tabela Geral</h1>
                            <button type="button" className="btn-close-white btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="form-group row px-3">
                                    <label htmlFor="txtNome" className="form-label fs-4 main-text">Nome *</label>
                                    <input value={tgNome} onChange={(evt) => setTgNome(evt.target.value)} id="txtNome" name="txtNome" required className="ipt" />
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>
                                <div className="form-group row px-3">
                                    <label htmlFor="txtDescricao" className="form-label fs-4 main-text">Descrição</label>
                                    <textarea value={tgDescricao} onChange={(evt) => setTgDescricao(evt.target.value)} id="txtDescricao" name="txtDescricao" className="ipt">
                                    </textarea>
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>
                                <hr style={{ color: '#ffffff', backgroundColor: '#ffffff', height: 3 }} />
                                <h3 className="main-text text-start">Item</h3>
                                <div className="form-group row px-3">
                                    <label htmlFor="txtSigla" className="form-label fs-4 main-text">Sigla</label>
                                    <input value={tgiSigla} onKeyUp={(e) => { e.target.value = e.target.value.toUpperCase() }} onChange={(evt) => setTgiSigla(evt.target.value.toUpperCase())} id="txtSigla" name="txtSigla" className="ipt" />
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>
                                <div className="form-group row px-3">
                                    <label htmlFor="txtValor" className="form-label fs-4 main-text">Valor</label>
                                    <input value={tgiDescricao} onChange={(evt) => setTgiDescricao(evt.target.value)} id="txtValor" name="txtValor" className="ipt" />
                                    <div className="col-10">
                                        <div className="input-group"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={clearFields} className="button-cancel" data-bs-dismiss="modal">CANCELAR</button>
                                <button type='button' onClick={salvarTabelaGeral} className='button'>SALVAR</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}