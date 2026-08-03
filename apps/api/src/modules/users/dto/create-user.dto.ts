import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Dr. Roberto Santos' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @ApiProperty({ example: 'roberto.santos@bairral.com.br' })
  @IsEmail({}, { message: 'E-mail é inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'SenhaInicial@123' })
  @IsString()
  @IsNotEmpty({ message: 'Senha inicial é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password!: string;

  @ApiProperty({ example: 'role-ethics-manager' })
  @IsString()
  @IsNotEmpty({ message: 'Perfil de acesso é obrigatório' })
  roleId!: string;

  @ApiProperty({ example: 'unit-1', required: false })
  @IsString()
  @IsOptional()
  unitId?: string;

  @ApiProperty({ example: 'dept-1', required: false })
  @IsString()
  @IsOptional()
  departmentId?: string;
}
