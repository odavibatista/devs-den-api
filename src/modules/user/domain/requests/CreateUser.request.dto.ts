import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateUserRequestSchema = z.object({
  email: z.string().email().min(10).max(50).describe('E-mail do usuário'),
  password: z.string().min(8).max(50).describe('Senha do usuário'),
  role: z.string().min(7).max(9).describe('Papel do usuário'),
});

export class CreateUserRequestDTO extends createZodDto(
  CreateUserRequestSchema,
) {}

export const CreateUserResponseSchema = z.object({
  user: z.object({
    email: z.string().email().min(10).max(50).describe('E-mail do usuário'),
    role: z.string().min(7).max(9).describe('Papel do usuário'),
  }),
  id: z.number().int().positive().describe('ID do usuário'),
});

export class CreateUserResponseDTO extends createZodDto(
  CreateUserResponseSchema,
) {}
