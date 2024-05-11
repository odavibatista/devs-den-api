import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateJobBodySchema = z.object({
  title: z.string().min(5).max(100).describe('Título da vaga'),
  description: z.string().min(20).max(500).describe('Descrição da vaga'),
  job_category_id: z.number().int().positive().describe('ID da categoria da vaga'),
  wage: z.number().int().positive().describe('Salário da vaga'),
  modality: z
  .string()
  .min(9)
  .max(9)
  .describe('Modalidade da vaga')
});

export class CreateJobBodyDTO extends createZodDto(
  CreateJobBodySchema,
) {}

export const CreateJobResponseSchema = z.object({
  id: z.number().int().positive().describe('ID da vaga'),
  title: z.string().min(5).max(100).describe('Título da vaga'),
  description: z.string().min(20).max(500).describe('Descrição da vaga'),
  company_id: z.number().int().positive().describe('ID da empresa'),
  job_category_id: z.number().int().positive().describe('ID da categoria da vaga'),
  wage: z.number().int().positive().describe('Salário da vaga'),
  modality: z
  .string()
  .min(9)
  .max(9)
  .describe('Modalidade da vaga')
});

export class CreateJobResponseDTO extends createZodDto(
  CreateJobResponseSchema,
) {}