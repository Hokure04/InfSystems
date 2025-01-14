import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './home/HomePage.tsx';
import AuthPage from './auth/AuthPage.tsx';
import { createTheme, ThemeProvider } from '@mui/material';
import Layout from './Layout.tsx';
import ActivationPage from './auth/ActivationPage.tsx';
import ExRoute from './examples/ExRoute.tsx';
import ExPermit from './examples/ExPermit.tsx';
import ExReport from './examples/ExReport.tsx';
import ExSupplies from './examples/ExSupplies.tsx';
import ExVehicle from './examples/ExVehicle.tsx';
import MapSettings from './map/MapSettings.tsx';
import MapPage from './map/MapPage.tsx';
import ExpeditionPage from '../src/pages/ExpeditionPage.tsx';
import RentPage from '../src/pages/RentPage.tsx'
import CreateExpeditionPage from '../src/pages/CreateExpeditionPage.tsx'


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
                        <Route path="/" element={<HomePage />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/activate" element={<ActivationPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/map-settings" element={<MapSettings />} />

                        {/* Examples */}
                        <Route path="/route" element={<ExRoute />} />
                        <Route path="/permit" element={<ExPermit />} />
                        <Route path="/report" element={<ExReport />} />
                        <Route path="/supplies" element={<ExSupplies />} />
                        <Route path="/vehicle" element={<ExVehicle />} />
                        <Route path="/expedition" element={<ExpeditionPage />} />
                        <Route path="/rent" element={<RentPage />} />
                        <Route path="/create" element={<CreateExpeditionPage />} />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
};

export default App;

