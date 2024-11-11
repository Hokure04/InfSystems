import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

const AuthPage: React.FC = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);

    return (
        <div>
            <button onClick={() => setIsLoginMode(!isLoginMode)}>
                {isLoginMode ? 'Перейти к регистрации' : 'Перейти к авторизации'}
            </button>
            {isLoginMode ? <LoginForm /> : <RegistrationForm />}
        </div>
    );
};

export default AuthPage;
