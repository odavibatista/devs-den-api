import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindJobResponseSchema = z.object({
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

export class FindJobResponseDTO extends createZodDto(
    FindJobResponseSchema,
) {}

export const FindJobsResponseSchema = z.array(
    FindJobResponseSchema
);

export class FindJobsResponseDTO extends createZodDto(
    FindJobsResponseSchema,
) {}