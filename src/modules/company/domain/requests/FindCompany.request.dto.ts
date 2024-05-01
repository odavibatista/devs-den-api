import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const FindCompanySchema = z.object({
    id: z.number().int().positive().describe("ID da empresa")
})

export class FindCompanyDTO extends createZodDto(FindCompanySchema){}

export const FindCompanyResponseSchema = z.object({
    id: z.number().int().positive().describe("ID da empresa"),
    name: z.string().max(50).describe("Nome da empresa"),
    cnpj: z.string().length(14).describe("CNPJ da empresa"),
    email: z.string().email().max(50).describe("E-mail da empresa"),
})

export class FindCompanyResponseDTO extends createZodDto(FindCompanyResponseSchema){}