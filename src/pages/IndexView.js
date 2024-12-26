import '../App.css';
import { useEffect } from 'react';
import { isAuthenticated } from '../stores/user';
import { useNavigate } from 'react-router-dom';

function Index() {

    const navigate = useNavigate();

    useEffect(()=>{
        if (isAuthenticated() === true) {
            navigate('/Projects');
        }
    },[navigate])

    return (
        <div className='body'>
            <div className="container">
                <header className="header">
                    <h1>Welcome to Your Kanban Board</h1>
                    <p className="tagline">Stay organized and boost your productivity with ease!</p>
                </header>

                <main className="main-content">
                    <p className="description">
                        Manage your tasks effectively with our intuitive Kanban board.
                        Create, update, and track your tasks effortlessly as you move them through different stages.
                    </p>

                    <div className="cta">
                        <a href="/Login" className="cta-button">
                            Get Started
                        </a>

                    </div>
                </main>

                <footer className="footer">
                    <p>&copy; 2024 KanPlan. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}

export default Index
