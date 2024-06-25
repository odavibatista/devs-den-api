import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetJobStatusResponseSchema = z.object({
  id_job: z.number().int().positive().describe('ID da vaga'),
  title: z.string().min(5).max(100).describe('Título da vaga'),
  description: z.string().min(20).max(500).describe('Descrição da vaga'),
  wage: z.number().int().positive().describe('Salário da vaga'),
  modality: z.string().min(9).max(9).describe('Modalidade da vaga'),
  contract: z.string().min(2).max(6).describe('Tipo de contrato'),
  job_category: z.object({
    id_category: z
      .number()
      .int()
      .positive()
      .describe('ID da Categoria da Vaga'),
    name: z.string().min(5).max(100).describe('Nome da Categoria'),
    image_url: z
      .string()
      .min(20)
      .max(500)
      .describe('URL da imagem da Categoria'),
  }),
  applications: z.array(
    z.object({
      id_user: z.number().int().positive().describe('ID do usuário'),
      name: z.string().min(5).max(100).describe('Nome do usuário'),
      active: z.boolean().describe('Status da aplicação'),
    }),
  ),
});

export class GetJobStatusResponseDTO extends createZodDto(
  GetJobStatusResponseSchema,
) {}
