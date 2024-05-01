import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const FindCompaniesResponseSchema = z.array(z.object({
    id: z.number().int().positive().describe("ID da empresa"),
    name: z.string().max(50).describe("Nome da empresa"),
    email: z.string().email().max(50).describe("E-mail da empresa"),
}))

export class FindCompaniesResponseDTO extends createZodDto(FindCompaniesResponseSchema){}