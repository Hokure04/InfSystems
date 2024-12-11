import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import HomePage from "./home/HomePage.tsx";
import AuthPage from "./auth/AuthPage.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
import Layout from "./Layout.tsx";
import ActivationPage from "./auth/ActivationPage.tsx";


const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>

            <Router>
                <Layout>

                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/activate" element={<ActivationPage/>}/>
                        <Route path="/auth" element={<AuthPage/>}/>



                        {/* Добавьте другие маршруты, если нужно */}
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Layout>

            </Router>
        </ThemeProvider>
    );
};

export default App;
