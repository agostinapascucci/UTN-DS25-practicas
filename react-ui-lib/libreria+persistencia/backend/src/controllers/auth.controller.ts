// controllers/auth.controller.ts
import { RequestHandler } from 'express';
import { login as loginService } from '../services/auth.service';
import { LoginRequest } from '../types/auth.types';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const data = await loginService(req.body as LoginRequest);
    // tu service devuelve LoginResponse['data'], lo envolvemos como { data }
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};
