import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const RegisterCandidateBodySchema = z.object({
  /* Dados pessoais  */
  name: z.string().min(5).max(50).describe('Nome do usuário candidato'),
  gender: z.string().min(4).max(6).describe('Gênero do usuário candidato'),
  birth_date: z.string().describe('Data de nascimento do usuário candidato'),

  /* Credenciais  */
  credentials: z.object({
    email: z
      .string()
      .email()
      .min(8)
      .max(50)
      .describe('E-mail do usuário candidato'),
    password: z.string().min(8).max(50).describe('Senha do usuário candidato')
  }),

  /* Endereço  */
  address: z.object({
    uf: z.number().describe('ID da UF do endereço do usuário.'),
    city: z.string().min(3).max(50).describe('Cidade do endereço do usuário.'),
    cep: z.string().min(8).max(8).describe('CEP do endereço do usuário.'),
    street: z.string().min(3).max(100).describe('Rua do endereço do usuário.'),
    number: z
      .string()
      .min(1)
      .max(10)
      .describe('Número do endereço do usuário.'),
    complement: z
      .string()
      .min(3)
      .max(30)
      .describe('Complemento do endereço do usuário.'),
  }),
});

export class RegisterCandidateBodyDTO extends createZodDto(
  RegisterCandidateBodySchema,
) {}

export const RegisterCandidateResponseSchema = z.object({
  user: z.object({
    id: z.number().int().positive().describe('ID do usuário candidato'),
    name: z.string().min(5).max(50).describe('Nome do usuário candidato'),
    role: z.string().min(9).max(9).describe('Papel do usuário candidato'),
  }),
  token: z
    .string()
    .min(10)
    .max(255)
    .describe('Token de autenticação do usuário candidato'),
});

export class RegisterCandidateResponseDTO extends createZodDto(
  RegisterCandidateResponseSchema,
) {}
