import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindSkillResponseSchema = z.object({
  id_skill: z.number().int().positive().describe('ID da Skill'),
  name: z.string().max(50).describe('Nome da Skill'),
});

export class FindSkillResponseDTO extends createZodDto(
  FindSkillResponseSchema,
) {}

export const FindSkillsResponseSchema = z.array(FindSkillResponseSchema);

export class FindSkillsResponseDTO extends createZodDto(
  FindSkillsResponseSchema,
) {}
