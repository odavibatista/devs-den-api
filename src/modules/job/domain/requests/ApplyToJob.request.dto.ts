import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const ApplyToJobSchema = z.object({
  job_id: z.number().describe('ID da vaga'),
  candidate_id: z.number().describe('ID do candidato aplicando à vaga.'),
});

export class ApplyToJobDTO extends createZodDto(
    ApplyToJobSchema,
) {}