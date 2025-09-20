import { Role } from "../generated/prisma";

export interface UserData {
    id: number;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
}

export interface CreateUserRequest {
    email: string;
    password: string;
    name: string;
    role: Role;
}

export interface UpdateUserRequest {
    email?: string;
    password?:string;
    name?: string;
    role?: Role;
}

export interface UserResponse {
    message: string;
    user: UserData;
}

export interface UsersListResponse {
    message: string;
    users: UserData[];
    total: number;
}