import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindUFsResponseSchema = z.array(
  z.object({
    id_uf: z.number().int().positive().describe('ID da UF'),
    name: z.string().max(50).describe('Nome da UF'),
    acronym: z.string().length(2).describe('Sigla da UF'),
  }),
);

export class FindUFsResponseDTO extends createZodDto(FindUFsResponseSchema) {}
