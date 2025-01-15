import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, InputAdornment, IconButton
} from '@mui/material';
import {
    AccountCircle as AccountCircleIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Lock as LockIcon, VisibilityOff, Visibility,
} from '@mui/icons-material';
import InputMask from "react-input-mask";
import api from "../api.ts";
import AdminRequests from "./AdminRequest.tsx";
import UserCard from "../entities/user/UserCard.tsx";
import {User} from "../entities/user/User.ts";





const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorPhoneMessage, setErrorPhoneMessage] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');


    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    useEffect(() => {
        document.title = 'Профиль';
        userData();
    }, []);

    const userData = async () => {
        try {
            const response =  await api.get(`/users/profile`);
            if (response) {
                setUser(response.data.user);
                setEditedUser(response.data.user);
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
        } catch (error) {
            setErrorMessage("Ошибка при загрузке пользователя!")
        }
    }

    const handleFieldChange = (field: keyof User, value: string) => {
        if (editedUser) {
            setEditedUser({...editedUser, [field]: value});
        }
    };
    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleConfirmPasswordVisibilityToggle = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSaveChanges = async () => {
        if (editedUser) {
            if (editedUser.phoneNumber?.includes("_")) {
                setErrorPhoneMessage("Введите корректный номер телефона");
                return;
            } else {
                setErrorPhoneMessage("");

                try {
                    await api.post("/users/profile/update", editedUser);
                    setUser(editedUser);
                    localStorage.setItem('user', JSON.stringify(editedUser));
                    setErrorMessage("");
                    setIsEditOpen(false);
                } catch (error) {
                    setErrorMessage('Произошла ошибка. Пожалуйста, попробуйте снова.');

                }
            }
        }

    };

    const handlePasswordChange = async () => {
        if (newPassword) {
            if (newPassword.length < 8) {
                setPasswordError('Пароль должен быть не менее 8 символов');
                return;
            }
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Пароли не совпадают!');
            return;
        }

        try {
            await api.put("/profile/set-pswd", {newPassword});

            setNewPassword('');
            setConfirmPassword('');
            setIsPasswordOpen(false);
            setErrorMessage("");
            setPasswordError("");
        } catch (error) {
            setErrorMessage('Произошла ошибка при изменении пароля. Пожалуйста, попробуйте снова.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await api.delete("/users/profile/delete");
            localStorage.clear();
            window.location.href = "/";
            setErrorDeleteMessage("");
        } catch (error) {
            setErrorDeleteMessage("Не удалось удалить учетную запись");
            return;
        }
        setIsDialogOpen(false);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={3}
            gap={2}

        >
            <Box p={3} display="flex" flexDirection="column" alignItems="center" gap={2} width="30vw">
                {/* Иконка пользователя */}
                <AccountCircleIcon style={{fontSize: 100, color: '#888'}}/>

                {/* Информация о пользователе */}
                {user && (
                    <Box width="100%">
                        <UserCard user={user}  />
                        {user.role.length == 0 && (
                            <Typography variant="body1">Активируйте пользователя, для получения ролей! Для этого
                                загляните в свой email, на него отправлено письмо с ссылкой на активацию.</Typography>
                        )}
                    </Box>
                )}

                {/* Кнопка редактирования */}
                <Box display="flex"
                     flexDirection="row"
                     justifyContent="space-between"
                     alignItems="flex-start"
                     gap={2}>

                    <Button
                        startIcon={<EditIcon/>}
                        variant="outlined"
                        onClick={() => setIsEditOpen(true)}
                    >
                        Редактировать
                    </Button>

                    {/* Диалог редактирования */}
                    <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Редактирование профиля</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2} mt={2}>
                                <TextField
                                    label="Имя"
                                    value={editedUser?.name || ''}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Фамилия"
                                    value={editedUser?.surname || ''}
                                    onChange={(e) => handleFieldChange('surname', e.target.value)}
                                    fullWidth
                                    required
                                />

                                <InputMask
                                    mask="+7(999)999-99-99"
                                    value={editedUser?.phoneNumber || ''}
                                    onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                    name="phoneNumber"
                                    maskChar="_"
                                >
                                    {(inputProps: any) => (
                                        <TextField
                                            {...inputProps}
                                            label="Номер телефона"
                                            fullWidth
                                            error={!!errorPhoneMessage}
                                        />
                                    )}
                                </InputMask>
                                <TextField
                                    label="О пользователе"
                                    value={editedUser?.aboutUser || ''}
                                    onChange={(e) => handleFieldChange('aboutUser', e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                                {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsEditOpen(false)} color="error">Отмена</Button>
                            <Button
                                onClick={handleSaveChanges}
                                color="primary"
                                startIcon={<SaveIcon/>}
                            >
                                Сохранить
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Кнопка смены пароля */}
                    <Button
                        startIcon={<LockIcon/>}
                        variant="outlined"
                        color="error"
                        onClick={() => setIsPasswordOpen(true)}
                    >
                        Сменить пароль
                    </Button>
                </Box>

                {/* Кнопка для открытия диалога */}
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleOpenDialog}
                    sx={{mt: 2}}
                >
                    Удалить учетную запись
                </Button>

                {/* Диалог подтверждения */}
                <Dialog
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>Подтверждение удаления</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Вы уверены, что хотите удалить свою учетную запись? Это действие необратимо.
                        </Typography>
                    </DialogContent>
                    {errorDeleteMessage && <Typography color="error" align={"center"}>{errorDeleteMessage}</Typography>}
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Отмена
                        </Button>
                        <Button onClick={handleDeleteAccount} color="error">
                            Удалить
                        </Button>
                    </DialogActions>


                </Dialog>


                {/* Диалог смены пароля */}
                <Dialog open={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} fullWidth maxWidth="xs">
                    <DialogTitle>Смена пароля</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} mt={2}>
                            <TextField
                                label="Новый пароль"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                required
                                type={passwordVisible ? 'text' : 'password'}
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handlePasswordVisibilityToggle}
                                                edge="end"
                                            >
                                                {passwordVisible ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Подтвердите пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                required
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                error={!!passwordError}
                                helperText={passwordError}
                                autoComplete="new-password"
                                onPaste={(e) => e.preventDefault()}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleConfirmPasswordVisibilityToggle}
                                                edge="end"
                                            >
                                                {confirmPasswordVisible ? (
                                                    <VisibilityOff/>
                                                ) : (
                                                    <Visibility/>
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsPasswordOpen(false)} color="error">Отмена</Button>
                        <Button
                            onClick={handlePasswordChange}
                            color="primary"
                            startIcon={<SaveIcon/>}
                        >
                            Сменить
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {user && user.role.length != 0 && (
                <>
                    <Box
                        flex={1}
                        p={2}
                        width={"40vw"}
                        borderRadius="8px"
                        alignSelf="center"

                    >

                        <AdminRequests user={user}/>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default UserProfile;
