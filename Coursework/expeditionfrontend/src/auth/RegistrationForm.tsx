import React, { useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    IconButton,
    InputAdornment, CircularProgress, Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api.ts";

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        surname: "",
        phoneNumber: "",
        vehicleType: "",
        expeditionRole: "",
        skill: "",
        aboutUser: "",
    });

    const [formErrors, setFormErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        surname: "",
        phoneNumber: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validate = () => {
        const errors: any = {};

        if (!formData.username.trim()) {
            errors.username = "Username не может быть пустым";
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Введите корректный email";
        }
        if (formData.password.length < 8) {
            errors.password = "Пароль должен содержать не менее 8 символов";
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Пароли не совпадают";
        }
        if (!formData.name.trim()) {
            errors.name = "Имя не может быть пустым";
        }
        if (!formData.surname.trim()) {
            errors.surname = "Фамилия не может быть пустой";
        }
        if (
            formData.phoneNumber &&
            !/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)
        ) {
            errors.phoneNumber = "Введите корректный номер телефона";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validate()) return;
        setLoading(true);
        setErrorMessage('');
        try {
            await api.post("/register", formData);
            setSuccessMessage(
                `Регистрация успешна! Мы отправили письмо для активации на адрес ${formData.email}.`
            );
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.error || 'Произошла ошибка при регистрации.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRedirectToEmail = () => {
        const emailDomain = formData.email.split('@')[1];
        window.open(`https://${emailDomain}`, '_blank');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setFormErrors({
            ...formErrors,
            [e.target.name]: "",
        });
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: "auto",
                mt: 5,
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" mb={3} textAlign="center">
                Регистрация
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!formErrors.username}
                            helperText={formErrors.username}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Пароль"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Подтвердите пароль"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Имя"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Фамилия"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            error={!!formErrors.surname}
                            helperText={formErrors.surname}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Номер телефона"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={!!formErrors.phoneNumber}
                            helperText={formErrors.phoneNumber}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Тип транспортного средства"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Роль в экспедиции"
                            name="expeditionRole"
                            value={formData.expeditionRole}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Навык"
                            name="skill"
                            value={formData.skill}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="О себе"
                            name="aboutUser"
                            value={formData.aboutUser}
                            onChange={handleChange}
                            multiline
                            rows={4}
                        />
                    </Grid>
                    {successMessage && (
                        <Grid item xs={12}>
                            <Alert severity="success">{successMessage}</Alert>
                            <Button
                                onClick={handleRedirectToEmail}
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                fullWidth
                            >
                                Перейти в почту
                            </Button>
                        </Grid>
                    )}
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Alert severity="error">{errorMessage}</Alert>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default RegistrationForm;
