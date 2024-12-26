import MainHeader from "../components/MainHeader"
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { getUserId, getProjects, isAuthenticated } from "../stores/user"
import DataTable, { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../services/cookie-handler";

export default function Projects() {

    const userId = getUserId();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = useCallback(async () => {
        try {
            const projectsData = await getProjects(userId);
            setProjects(projectsData);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        if (isAuthenticated() === false) {
            deleteCookie('kanplan_token')
            navigate('/Login');
        }
        fetchData();
    }, [fetchData, navigate])

    useMemo(() => {
        createTheme('dark', {
            background: {
                default: 'transparent',
            },
        });
    }, []);

    const columns = useMemo(() => [
        {
            name: "Name",
            selector: (row) => row.nome,
            sortable: true
        },
        {
            name: 'Description',
            selector: (row) => row.descricao,
            sortable: true
        },
        {
            name: "Created Date",
            selector: (row) => new Date(row.dataInclusao).toLocaleDateString(),
            sortable: true
        }
    ], []);

    return (
        <div className="main">
            <MainHeader />
            <main>
                <div>
                    <h1 className="main-text pb-4">Projects</h1>
                    <div className="container">
                        <DataTable
                            columns={columns}
                            data={projects}
                            fixedHeader
                            pagination
                            theme="dark"
                            onRowClicked={(row) => {
                                navigate("/Projects/" + row.id)
                            }}
                            highlightOnHover
                            striped
                            responsive
                            pointerOnHover
                            progressPending={loading}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}