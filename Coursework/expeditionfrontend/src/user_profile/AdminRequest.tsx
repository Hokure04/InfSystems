import React, {useEffect, useState} from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Stack,
    Box,
    Paper,
} from "@mui/material";
import api from "../api";
import {Inbox as InboxIcon} from "@mui/icons-material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {User} from "../entities/user/User.ts"


enum RequestStatus {
    SEND = "SEND",
    APPROVED = "APPROVED",
    DENIED = "DENIED",
}

interface AdminRequest {
    id: number;
    userId: number;
    username: string;
    description: string;
    deniedDescription?: string;
    status?: RequestStatus;
}



const AdminRequests: React.FC<{ user: User }> = (user) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [requests, setRequests] = useState<AdminRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<AdminRequest | null>(null);
    const [newRequestDescription, setNewRequestDescription] = useState("");
    const [deniedReason, setDeniedReason] = useState("");
    const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
    const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorRequestMessage, setErrorRequestMessage] = useState("");

    useEffect(() => {
        setIsAdmin(user.user.role?.some((role: any) => role.name === "ADMIN"));

        if (user.user.role?.some((role: any) => role.name === "ADMIN")) {
            fetchRequests();
        } else {
            fetchCurrentRequest();
        }
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get("/users/admin-requests");
            setRequests(response.data.adminRequests);
        } catch (error) {
            setErrorMessage("Ошибка загрузки заявок " + error);
        }
    };

    const fetchCurrentRequest = async () => {
        try {
            const response = await api.get("/users/admin-request");
            setCurrentRequest(response.data.adminRequest);
        } catch (error: any) {
                setCurrentRequest(null);
        }
    };

    const handleSubmitRequest = async () => {
        if (!newRequestDescription.trim()) {
            setErrorMessage("Описание не может быть пустым");
            return;
        }
        try {
            await api.post("/users/admin-requests", newRequestDescription);
            setNewRequestDescription("");
            setErrorMessage("");
            fetchCurrentRequest();
        } catch (error) {
            setErrorMessage("Не удалось отправить заявку, попробуйте снова");
        }
    };

    const handleAcceptRequest = async (requestId: number) => {
        try {
            await api.put(`/users/admin-requests/${requestId}/accept`);
            fetchRequests();
            setErrorRequestMessage("");
        } catch (error) {
            setErrorRequestMessage("Ошибка при принятии заявки");
        }
    };

    const handleDenyRequest = async () => {
        if (!deniedReason.trim()) {
            setErrorMessage("Причина отказа не может быть пустой");
            return;
        }
        try {
            await api.put(`/users/admin-requests/${selectedRequest?.id}/deny`, deniedReason);
            fetchRequests();
            setDeniedReason("");
            setSelectedRequest(null);
            setIsDenyDialogOpen(false);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Не удалось отклонить заявку, попробуйте снова");
        }
    };

    return (
        <Box>
            {!isAdmin ? (
                        currentRequest ? (
                        <Paper elevation={2} sx={{p: 2}}>
                            <Typography variant="h6" gutterBottom>
                                Ваша заявка
                            </Typography>
                            <Typography>
                                <strong>ID заявки:</strong> {currentRequest.id}
                            </Typography>
                            <Typography>
                                <strong>Статус:</strong> {currentRequest.status}
                            </Typography>
                            <Typography>
                                <strong>Описание:</strong> {currentRequest.description}
                            </Typography>
                            {currentRequest.status === RequestStatus.DENIED && (
                                <Typography color="error">
                                    <strong>Причина отказа:</strong> {currentRequest.deniedDescription}
                                </Typography>
                            )}
                        </Paper>
                        ) : (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Подать заявку на администратора
                            </Typography>
                            <TextField
                                label="Расскажите свою мотивацию стать администратором"
                                multiline
                                rows={4}
                                value={newRequestDescription}
                                onChange={(e) => setNewRequestDescription(e.target.value)}
                                fullWidth
                            />
                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitRequest}
                                sx={{mt: 2}}
                            >
                                Отправить заявку
                            </Button>
                        </Box>
                        )
            ) : (
                <Box alignItems={"center"}>
                    <Typography variant="h6" gutterBottom align={"center"}>
                        Заявки на администратора:
                    </Typography>
                    {errorRequestMessage && <Typography align={"center"} color="error">{errorRequestMessage}</Typography>}


                    {requests.length !== 0 ? (
                        <Box width={"100%"} alignItems={"center"}>
                            <Table>

                                <TableHead>
                                    <TableRow>
                                        <TableCell width={"10%"}>ID</TableCell>
                                        <TableCell width={"20%"}>Пользователь</TableCell>
                                        <TableCell sx={{ wordBreak: 'break-word', minWidth: '200px'}} width={"50%"}>Описание</TableCell>
                                        <TableCell width={"20%"}>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((request) => (

                                        <TableRow key={request.id}>
                                            <TableCell>{request.id}</TableCell>
                                            <TableCell>{request.username}</TableCell>
                                            <TableCell sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{request.description}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        color="success"
                                                        onClick={() => handleAcceptRequest(request.id)}
                                                        startIcon={<CheckIcon />}

                                                    />
                                                    <Button

                                                        color="error"
                                                        variant="contained"
                                                        startIcon={<CloseIcon />}
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            setIsDenyDialogOpen(true);
                                                        }}

                                                    />
                                                </Stack>
                                            </TableCell>
                                        </TableRow>


                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" alignItems="center" sx={{mt: 4}}>
                            <InboxIcon sx={{fontSize: 64, color: "gray"}}/>
                            <Typography variant="h6" gutterBottom>
                                Заявок пока что нет...
                            </Typography>
                        </Box>
                    )
                    }


                </Box>
            )}

            {/* Диалог отклонения заявки */}
            <Dialog
                open={isDenyDialogOpen}
                onClose={() => setIsDenyDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle >Отклонение заявки</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Причина отказа"
                        multiline
                        rows={4}
                        value={deniedReason}
                        onChange={(e) => setDeniedReason(e.target.value)}
                        fullWidth
                    />

                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDenyDialogOpen(false)} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleDenyRequest} color="error">
                        Отклонить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminRequests;
