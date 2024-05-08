import { IsString, Length } from 'class-validator';

export class CompanyDTO {
  @IsString()
  @Length(5, 50)
  readonly name: string;

  @IsString()
  @Length(16, 16)
  readonly cnpj: string;
}
