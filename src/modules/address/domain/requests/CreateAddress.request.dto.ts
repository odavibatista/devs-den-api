import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateAddressRequestSchema = z.object({
    id_address: z.number().describe('ID do endereço.'),
    uf_id: z.number().describe('ID da UF.'),
    city: z.string().min(3).max(50).describe('Cidade do endereço.'),
    cep: z.string().min(8).max(8).describe('CEP do endereço.'),
    street: z.string().min(3).max(100).describe('Rua do endereço.'),
    number: z
      .string()
      .min(1)
      .max(10)
      .describe('Número do endereço.'),
    complement: z
      .string()
      .min(3)
      .max(30)
      .describe('Complemento do endereço.'),
});

export class CreateAddressRequestDTO extends createZodDto(
  CreateAddressRequestSchema,
) {}