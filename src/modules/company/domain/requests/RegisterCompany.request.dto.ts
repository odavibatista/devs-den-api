import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const RegisterCompanyResponseSchema = z.object({
    user: z.object({
        id: z.number().int().positive().describe("ID da empresa"),
        name: z.string().min(5).max(50).describe("Nome da empresa"),
        role: z.string().min(9).max(9).describe("Papel do usuário candidato"),
    }),
    token: z.string().min(10).max(255).describe("Token de autenticação do usuário candidato")
})

export class RegisterCompanyResponseDTO extends createZodDto(RegisterCompanyResponseSchema){}