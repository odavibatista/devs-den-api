import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const DeleteCompanySchema = z.object({
  id: z.number().int().positive().describe('ID da empresa'),
});

export class DeleteCompanyDTO extends createZodDto(DeleteCompanySchema) {}

export const DeleteCompanyResponseSchema = z.object({
  message: z.string().describe('Empresa deletada com sucesso'),
});

export class DeleteCompanyResponseDTO extends createZodDto(
  DeleteCompanyResponseSchema,
) {}
