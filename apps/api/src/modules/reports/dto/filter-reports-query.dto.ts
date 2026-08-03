import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportStatusDtoEnum } from './update-status.dto';
import { RiskLevelDtoEnum, PriorityDtoEnum } from './update-report-admin.dto';

export class FilterReportsQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ enum: ReportStatusDtoEnum })
  @IsEnum(ReportStatusDtoEnum)
  @IsOptional()
  status?: ReportStatusDtoEnum;

  @ApiPropertyOptional({ enum: RiskLevelDtoEnum })
  @IsEnum(RiskLevelDtoEnum)
  @IsOptional()
  riskLevel?: RiskLevelDtoEnum;

  @ApiPropertyOptional({ enum: PriorityDtoEnum })
  @IsEnum(PriorityDtoEnum)
  @IsOptional()
  priority?: PriorityDtoEnum;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unitId?: string;

  @ApiPropertyOptional({ description: 'Busca por termo no protocolo ou título' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'createdAt', description: 'Campo de ordenação (createdAt, status, priority, riskLevel)' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc', description: 'Direção da ordenação (asc ou desc)' })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
