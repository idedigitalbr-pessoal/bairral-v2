import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FirstAccessDto {
  @ApiProperty({ description: 'Senha temporária informada no primeiro acesso' })
  @IsString()
  @IsNotEmpty({ message: 'Senha temporária é obrigatória' })
  temporaryPassword!: string;

  @ApiProperty({ example: 'SenhaDefinitiva@2026', description: 'Nova senha definitiva' })
  @IsString()
  @IsNotEmpty({ message: 'Nova senha definitiva é obrigatória' })
  @MinLength(8, { message: 'A nova senha deve possuir no mínimo 8 caracteres' })
  newPassword!: string;
}
