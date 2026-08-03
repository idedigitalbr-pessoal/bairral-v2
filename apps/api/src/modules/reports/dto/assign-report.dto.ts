import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignReportDto {
  @ApiProperty({ example: 'user-id-uuid', description: 'ID do usuário relator/investigador' })
  @IsString()
  @IsNotEmpty({ message: 'ID do usuário responsável é obrigatório' })
  assignedUserId!: string;

  @ApiPropertyOptional({ example: 'INVESTIGATOR', description: 'Papel no caso: INVESTIGATOR, RELATOR, AUDITOR' })
  @IsString()
  @IsOptional()
  roleInCase?: string;

  @ApiPropertyOptional({ example: 'Designado para apuração de fatos no setor assistencial.' })
  @IsString()
  @IsOptional()
  notes?: string;
}
