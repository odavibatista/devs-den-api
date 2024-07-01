import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetCandidateProfileDataResponseSchema = z.object({
    id: z.number().int().positive().describe('ID do usuário'),
    name: z.string().max(50).describe('Nome do usuário'),
    email: z.string().email().max(50).describe('E-mail do usuário'),
    role: z.string().min(7).max(9).describe('Papel do usuário'),
    birth_date: z.string().length(10).describe('Data de nascimento do usuário')
})

export class GetCandidateProfileDataResponseDTO extends createZodDto(
    GetCandidateProfileDataResponseSchema
) {}

export const GetCompanyProfileDataResponseSchema = z.object({
    id: z.number().int().positive().describe('ID do usuário'),
    company_name: z.string().max(50).describe('Nome da empresa'),
    email: z.string().email().max(50).describe('E-mail do usuário'),
    role: z.string().min(7).max(9).describe('Papel do usuário'),
    cnpj: z.string().length(16).describe('CNPJ da empresa'),
})

export class GetCompanyProfileDataResponseDTO extends createZodDto(
    GetCompanyProfileDataResponseSchema
) {}