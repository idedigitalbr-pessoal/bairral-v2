import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Gestor de Ética' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'ETHICS_MANAGER' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'Gestão completa do canal e apuração de manifestações' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ['VIEW_CASES', 'CHANGE_STATUS', 'ASSIGN_CASES'] })
  @IsArray()
  @IsString({ each: true })
  permissionCodes!: string[];
}
