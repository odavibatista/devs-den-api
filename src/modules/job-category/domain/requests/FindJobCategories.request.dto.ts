import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindJobCategorySchema = z.object({
    id_category: z.number().int().positive().describe('ID da Categoria de Emprego'),
    name: z.string().max(50).describe('Nome da Categoria de Emprego'),
    image_url: z.string().max(300).describe('URL da imagem da Categoria de Emprego'),
});

export class FindJobCategoryDTO extends createZodDto(FindJobCategorySchema) {}

export const FindJobCategoriesResponseSchema = z.array(
  z.object({
    id_category: z.number().int().positive().describe('ID da Categoria de Emprego'),
    name: z.string().max(50).describe('Nome da Categoria de Emprego'),
    image_url: z.string().max(300).describe('URL da imagem da Categoria de Emprego'),
  }),
);

export class FindJobCategoriesResponseDTO extends createZodDto(
  FindJobCategoriesResponseSchema,
) {}

export const FindJobCategoryResponseSchema = z.object({
    id_category: z.number().int().positive().describe('ID da Categoria de Emprego'),
    name: z.string().max(50).describe('Nome da Categoria de Emprego'),
    image_url: z.string().max(300).describe('URL da imagem da Categoria de Emprego'),
});

export class FindJobCategoryResponseDTO extends createZodDto(
  FindJobCategoryResponseSchema,
) {}
