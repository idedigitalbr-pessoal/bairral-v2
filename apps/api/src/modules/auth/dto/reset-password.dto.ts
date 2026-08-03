import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de recuperação enviado por e-mail' })
  @IsString()
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token!: string;

  @ApiProperty({ example: 'NovaSenha@2026', description: 'Nova senha' })
  @IsString()
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  newPassword!: string;
}
