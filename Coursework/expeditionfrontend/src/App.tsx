import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './auth/RegistrationForm';
import LoginForm from './auth/LoginForm';
import HomePage from "./home/HomePage.tsx";
import AuthPage from "./auth/AuthPage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage/>} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/home" element={<HomePage />} />
                {/* Добавьте другие маршруты, если нужно */}
            </Routes>
        </Router>
    );
};

export default App;
