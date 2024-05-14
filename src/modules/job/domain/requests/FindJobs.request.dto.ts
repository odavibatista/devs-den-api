import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindJobResponseSchema = z.object({
    job: z.object({
        id_job: z.number().int().positive().describe('ID da vaga'),
        title: z.string().min(5).max(100).describe('Título da vaga'),
        description: z.string().min(20).max(500).describe('Descrição da vaga'),
        wage: z.number().int().positive().describe('Salário da vaga'),
        modality: z
        .string()
        .min(9)
        .max(9)
        .describe('Modalidade da vaga'),
        job_category:  z.object({
            id_category: z.number().int().positive().describe('ID da Categoria da Vaga'),
            name: z.string().min(5).max(100).describe('Nome da Categoria'),
            image_url: z.string().min(20).max(500).describe('URL da imagem da Categoria'),
        }),
    }),
    company: z.object({
        id_company: z.number().int().positive().describe('ID da vaga'),
        name: z.string().min(5).max(100).describe('Nome da empresa'),
    })
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