import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const RegisterCompanyRequestSchema = z.object({
    /* Dados da empresa */
    company_name: z.string().min(5).max(50).describe("Nome da empresa"),
    cnpj: z.string().min(16).max(16).describe("CNPJ da empresa"),

    /* Credenciais  */
    credentials: z.object({
        email: z.string().email().max(50).describe("E-mail da empresa"),
        password: z.string().min(8).max(250).describe("Senha da empresa"),
        role: z.string().min(7).max(7).describe("Tipo de usuário").default("company"),
    }),

    /* Endereço  */
    address: z.object({
        uf: z.number().describe("ID da UF da empresa."),
        city: z.string().min(3).max(50).describe("Cidade do endereço da empresa."),
        cep: z.string().min(8).max(8).describe("CEP do endereço da empresa."),
        street: z.string().min(3).max(100).describe("Rua do endereço da empresa."),
        number: z.string().min(1).max(10).describe("Número do endereço da empresa."),
        complement: z.string().min(3).max(30).describe("Complemento do endereço da empresa."),
    })
})

export class RegisterCompanyBodyDTO extends createZodDto(RegisterCompanyRequestSchema){}

export const RegisterCompanyResponseSchema = z.object({
    user: z.object({
        id: z.number().int().positive().describe("ID da empresa"),
        name: z.string().min(5).max(50).describe("Nome da empresa"),
        role: z.string().min(9).max(9).describe("Papel do usuário candidato"),
    }),
    token: z.string().min(10).max(255).describe("Token de autenticação do usuário candidato")
})

export class RegisterCompanyResponseDTO extends createZodDto(RegisterCompanyResponseSchema){}