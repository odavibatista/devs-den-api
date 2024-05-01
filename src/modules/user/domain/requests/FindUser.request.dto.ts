import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const FindUserSchema = z.object({
    id: z.number().int().positive().describe("ID do usuário")
})

export class FindUserDTO extends createZodDto(FindUserSchema){}

export const FindUserResponseSchema = z.object({
    id: z.number().int().positive().describe("ID do usuário"),
    name: z.string().max(50).describe("Nome do usuário"),
    email: z.string().email().max(50).describe("E-mail do usuário"),
    role: z.string().min(7).max(9).describe("Papel do usuário"),
})

export class FindUserResponseDTO extends createZodDto(FindUserResponseSchema){}