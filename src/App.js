import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Index from './pages/IndexView';
import Login from './pages/LoginView';
import Projects from './pages/ProjectsView';
import Project from './pages/ProjectView';
import TabelaGeral from './pages/TabelaGeralView';
import User from './pages/UserView';

function App() {

  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/Index" />} />
          <Route path='/Index' element={<Index />} />
          <Route path='/Projects' element={<Projects />} />
          <Route path='/Projects/:id' element={<Project />} />
          <Route path="/Login" element={<Login />} />
          <Route path='/TabelaGeral' element={<TabelaGeral />} />
          <Route path='/User' element={<User />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}
export default App;