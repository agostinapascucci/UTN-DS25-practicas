import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
 import { CreateUserRequest, UpdateUserRequest, UserData } from '../types/user.types';

 export async function getAllUsers(limit: number = 10): Promise<UserData[]> {
   const users = await prisma.user.findMany({
       orderBy: { id: "asc" },
       take: limit,
       omit: { password: true }
   });
   return users;
 }

 export async function getUserById(id: number): Promise<UserData> {
   const user = await prisma.user.findUnique(
      { where: { id }, omit: { password: true }});
   if (!user) {
       const error = new Error('Usuario no encontrado') as any;
       error.statusCode = 404;
       throw error;
   }
   return user;
 }

 export async function createUser(data: CreateUserRequest): Promise<UserData> {
   // 1. Verificar si existe
   const exists = await prisma.user.findUnique({ where: { email: data.email }});
   if (exists) {
       const error = new Error('Email ya registrado') as any;
       error.statusCode = 409;
       throw error;
   }
   // 2. Hashear password
   const hashedPassword = await bcrypt.hash(data.password, 10);
   // 3. Crear usuario
   const user = await prisma.user.create({
       data: {
           ...data,
           password: hashedPassword
       },
       omit: { password: true }
   });
   return user;
 }
 
 export async function updateUser(id: number, data: UpdateUserRequest): Promise<UserData> {
   try {
       const updateData: Partial<UpdateUserRequest> = { ...data };
       if (data.password) {
           updateData.password = await bcrypt.hash(data.password, 10);
       } else {
           delete (updateData as any).password;
       }
       return await prisma.user.update({
           where: { id },
           data: updateData,
           omit: { password: true }
       });
   } catch (e: any) {
       if (e.code === 'P2025') {
           const error = new Error('Usuario no encontrado') as any;
           error.statusCode = 404;
           throw error;
       }
       throw e;
   }
 }

 export async function deleteUser(id: number): Promise<void> {
   try {
       await prisma.user.delete({ where: { id } });
   } catch (e: any) {
       if (e.code === 'P2025') {
           const error = new Error('Usuario no encontrado') as any;
           error.statusCode = 404;
           throw error;
       }
       throw e;
   }
 }
