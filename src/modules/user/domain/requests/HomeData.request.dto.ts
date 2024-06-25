import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const HomeDataCandidateResponseSchema = z.object({
  id: z.number().int().positive().describe('ID do usuário'),
  name: z.string().max(50).describe('Nome do usuário'),
  role: z.string().min(7).max(9).describe('Cargo do usuário'),
});

export class HomeDataResponseDTO extends createZodDto(
  HomeDataCandidateResponseSchema,
) {}
