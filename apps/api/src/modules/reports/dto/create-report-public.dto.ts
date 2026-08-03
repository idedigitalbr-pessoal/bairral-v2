import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ReportTypeDtoEnum {
  DEVIATION = 'DEVIATION',
  HARASSMENT = 'HARASSMENT',
  DISCRIMINATION = 'DISCRIMINATION',
  FRAUD = 'FRAUD',
  CORRUPTION = 'CORRUPTION',
  SAFETY = 'SAFETY',
  PRIVACY = 'PRIVACY',
  OTHER = 'OTHER',
}

export enum SubmissionModeDtoEnum {
  ANONYMOUS = 'ANONYMOUS',
  IDENTIFIED = 'IDENTIFIED',
  CONFIDENTIAL = 'CONFIDENTIAL',
}

export class ReporterIdentityDto {
  @ApiPropertyOptional({ example: 'João da Silva' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '(19) 99999-8888' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiPropertyOptional({ example: 'Colaborador CLT' })
  @IsString()
  @IsOptional()
  relationToCompany?: string;
}

export class PersonInvolvedDto {
  @ApiProperty({ example: 'Marcos Souza' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Coordenador' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 'Manutenção' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'ACCUSED', description: 'ACCUSED, AFFECTED, OTHER' })
  @IsString()
  @IsOptional()
  involvementType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class WitnessDto {
  @ApiProperty({ example: 'Ana Paula' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'ana@email.com' })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateReportPublicDto {
  @ApiProperty({ enum: ReportTypeDtoEnum, example: ReportTypeDtoEnum.DEVIATION })
  @IsEnum(ReportTypeDtoEnum)
  type!: ReportTypeDtoEnum;

  @ApiProperty({ example: 'Relato de irregularidade no setor assistencial' })
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title!: string;

  @ApiProperty({ example: 'Descrição detalhada do fato ocorrido...' })
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description!: string;

  @ApiProperty({ enum: SubmissionModeDtoEnum, example: SubmissionModeDtoEnum.ANONYMOUS })
  @IsEnum(SubmissionModeDtoEnum)
  submissionMode!: SubmissionModeDtoEnum;

  @ApiProperty({ example: 'SenhaForte@123', description: 'Senha criada pelo manifestante para acompanhar o protocolo' })
  @IsString()
  @IsNotEmpty({ message: 'Senha de acompanhamento é obrigatória' })
  @MinLength(6, { message: 'A senha de acompanhamento deve ter no mínimo 6 caracteres' })
  trackingPassword!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unitId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ example: 'Bloco B - 2º Andar' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: '2026-07-28' })
  @IsString()
  @IsOptional()
  occurrenceDate?: string;

  @ApiPropertyOptional({ example: '14:30' })
  @IsString()
  @IsOptional()
  occurrenceTime?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  recurring?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  immediateRisk?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  previousAttempt?: boolean;

  @ApiPropertyOptional({ type: ReporterIdentityDto })
  @ValidateNested()
  @Type(() => ReporterIdentityDto)
  @IsOptional()
  reporterIdentity?: ReporterIdentityDto;

  @ApiPropertyOptional({ type: [PersonInvolvedDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonInvolvedDto)
  @IsOptional()
  peopleInvolved?: PersonInvolvedDto[];

  @ApiPropertyOptional({ type: [WitnessDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WitnessDto)
  @IsOptional()
  witnesses?: WitnessDto[];
}
