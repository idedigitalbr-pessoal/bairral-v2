import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ReportStatusDtoEnum {
  SUBMITTED = 'SUBMITTED',
  UNDER_TRIAGE = 'UNDER_TRIAGE',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  ACTION_PLAN = 'ACTION_PLAN',
  CONCLUDED = 'CONCLUDED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

export class UpdateStatusDto {
  @ApiProperty({ enum: ReportStatusDtoEnum, example: ReportStatusDtoEnum.UNDER_INVESTIGATION })
  @IsEnum(ReportStatusDtoEnum)
  @IsNotEmpty({ message: 'Status é obrigatório' })
  status!: ReportStatusDtoEnum;

  @ApiPropertyOptional({ example: 'Manifestação admitida na triagem e encaminhada para apuração interna.' })
  @IsString()
  @IsOptional()
  reason?: string;
}
