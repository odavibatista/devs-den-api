import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindAddressResponseSchema = z.object({
    id_address: z.number().describe('ID do endereço da empresa.'),
    uf_id: z.number().describe('ID da UF da empresa.'),
    city: z.string().min(3).max(50).describe('Cidade do endereço da empresa.'),
    cep: z.string().min(8).max(8).describe('CEP do endereço da empresa.'),
    street: z.string().min(3).max(100).describe('Rua do endereço da empresa.'),
    number: z
      .string()
      .min(1)
      .max(10)
      .describe('Número do endereço da empresa.'),
    complement: z
      .string()
      .min(3)
      .max(30)
      .describe('Complemento do endereço da empresa.'),
});

export class FindAddressResponseDTO extends createZodDto(
  FindAddressResponseSchema,
) {}