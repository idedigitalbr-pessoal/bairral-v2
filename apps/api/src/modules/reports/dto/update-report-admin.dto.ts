import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum RiskLevelDtoEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum PriorityDtoEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class UpdateReportAdminDto {
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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ example: '2026-08-30T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  dueAt?: string;
}
