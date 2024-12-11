// Интерфейс для Request
export interface Request {
    requestId: number;
    username: string;
    description: string | null;
    status: string | null;
    reasonForRefusal: string | null;
}