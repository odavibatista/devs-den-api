import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindCandidateUserResponseSchema = z.object({
  id: z.number().int().positive().describe('ID do usuário'),
  name: z.string().max(50).describe('Nome do usuário'),
  email: z.string().email().max(50).describe('E-mail do usuário'),
  role: z.string().min(7).max(9).describe('Papel do usuário'),
});

export class FindCandidateUserResponseDTO extends createZodDto(FindCandidateUserResponseSchema) {}

export const FindCompanyUserResponseSchema = z.object({
  id: z.number().int().positive().describe('ID do usuário'),
  name: z.string().max(50).describe('Nome do usuário'),
  email: z.string().email().max(50).describe('E-mail do usuário'),
  role: z.string().min(7).max(9).describe('Papel do usuário'),
  cnpj: z.string().length(16).describe('CNPJ da empresa'),
});

export class FindCompanyUserResponseDTO extends createZodDto(FindCompanyUserResponseSchema) {}