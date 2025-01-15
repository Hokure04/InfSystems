import React, {useState, useEffect} from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Typography,
    Box,
    Popover,
} from '@mui/material';
import {
    Home as HomeIcon,
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber: string;
    aboutUser: string;
    role: Role[];
}

const AppMenu: React.FC = () => {
    const [anchorElOptions, setAnchorElOptions] = useState<null | HTMLElement>(null);
    const [anchorElImport, setAnchorElImport] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [user, setUser] = useState<any>(null);
    const [exit, setExit] = useState<boolean>(true);
    const navigate = useNavigate();
    const [firstEnter, setFirstEnter] = useState<boolean>(false);


    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
            setExit(false);
        } else {
            setExit(true);
            navigate('/auth');
        }
    }, [navigate]);

    const handleOptionsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElOptions(event.currentTarget);
    };
    const handleOptionsMenuClose = () => {
        setAnchorElOptions(null);
    };

    const handleImportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElImport(event.currentTarget);
    };
    const handleImportMenuClose = () => {
        setAnchorElImport(null);
    };

    const hasUserRole = (user: User): boolean => {
        return user?.role?.some((role: Role) => role.name === "USER") ?? false;
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setFirstEnter(true);
        setAnchorElUser(event.currentTarget);
    };
    const handleUserMenuClose = () => {
        setFirstEnter(false);
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        setFirstEnter(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setExit(true);
        navigate('/auth');

    };

    const goToProfile = () => {
        navigate(`/profile`);
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{justifyContent: 'space-between'}}>
                {/* Левая часть меню */}
                <Box display="flex" alignItems="center">
                    <IconButton color="inherit" onClick={() => navigate("/")}>
                        <HomeIcon/>
                    </IconButton>
                    <Button color="inherit" onClick={() => navigate("/map")}>
                        Карта
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/expedition")}>
                        Экспедиции
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/create")}>
                        Создать экспедиции
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/rent")}>
                        Аренда
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/certificate")}>
                        Сертификаты
                    </Button>
                    <Button color="inherit" onClick={handleImportMenuOpen}>
                        Импорт
                    </Button>
                    <Menu
                        anchorEl={anchorElImport}
                        open={Boolean(anchorElImport)}
                        onClose={handleImportMenuClose}
                    >
                        <MenuItem onClick={() => navigate("/flat-import")}>
                            Импортировать квартиры
                        </MenuItem>
                        <MenuItem onClick={() => navigate("/flat-import/history")}>
                            История импорта
                        </MenuItem>
                    </Menu>
                    <Button color="inherit" onClick={handleOptionsMenuOpen}>
                        Дополнительные опции
                    </Button>
                    <Menu
                        anchorEl={anchorElOptions}
                        open={Boolean(anchorElOptions)}
                        onClose={handleOptionsMenuClose}

                    >
                        <MenuItem onClick={() => navigate("/average-number-of-rooms")} disabled={!hasUserRole(user)}>
                            Расчет среднего значения комнат

                        </MenuItem>
                        <MenuItem onClick={() => navigate("/flat-with-max-area")} disabled={!hasUserRole(user)}>
                            Найти квартиру с максимальной площадью
                        </MenuItem>
                        <MenuItem onClick={() => navigate("/flats-count-by-is-new")} disabled={!hasUserRole(user)}>
                            Найти количество новых/бу квартир
                        </MenuItem>
                        <MenuItem onClick={() => navigate("/most-expensive-flat-without-balcony")}
                                  disabled={!hasUserRole(user)}>
                            Самая дорогая квартира без балкона
                        </MenuItem>
                        <MenuItem onClick={() => navigate("/most-expensive-flat-from-ids")}
                                  disabled={!hasUserRole(user)}>
                            Выбрать из трёх квартир наиболее дорогую
                        </MenuItem>
                    </Menu>
                </Box>
                {!exit && (
                    <>
                        {/* Правая часть меню */}
                        <Box display="flex" alignItems="center">
                            {/* Имя пользователя */}
                            {user && (
                                <Typography variant="body1" sx={{marginRight: 2}}>
                                    {user.username}
                                </Typography>
                            )}
                            {/* Иконка пользователя */}
                            <IconButton
                                onClick={handleUserMenuOpen}
                                color="inherit"
                            >
                                <AccountCircleIcon/>
                            </IconButton>
                            <Popover
                                open={Boolean(anchorElUser)}
                                anchorEl={anchorElUser}
                                onClose={handleUserMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                {user && firstEnter && (
                                    <Box p={2} width={200}>


                                        <Typography
                                            variant="subtitle1"><strong>{user.name} {user.surname}</strong></Typography>
                                        <Typography variant="body2">{user.email}</Typography>
                                        <Typography variant="body2">{user.phoneNumber}</Typography>
                                        <Typography variant="body2" sx={{mt: 1}}>{user.aboutUser}</Typography>
                                        <Box mt={2} display="flex" flexDirection="column" gap={0}>
                                            <Button
                                                startIcon={<PersonIcon/>}
                                                onClick={goToProfile}
                                                color="primary"
                                                sx={{
                                                    justifyContent: 'flex-start',
                                                    textTransform: 'none',
                                                    backgroundColor: 'transparent',
                                                    color: 'inherit',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                    },
                                                }}
                                            >
                                                Профиль
                                            </Button>
                                            <Button
                                                startIcon={<ExitToAppIcon/>}
                                                onClick={handleLogout}
                                                color="error"
                                                sx={{
                                                    justifyContent: 'flex-start',
                                                    textTransform: 'none',
                                                    backgroundColor: 'transparent',
                                                    color: 'red',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                    },
                                                }}
                                            >
                                                Выйти
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Popover>
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
        ;
};

export default AppMenu;
