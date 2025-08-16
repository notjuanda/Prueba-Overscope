export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName?: string | null;
    createdAt: Date;
    updatedAt: Date;
}