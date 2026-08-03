import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'usuario@bairral.com.br' })
  @IsEmail({}, { message: 'E-mail informado é inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email!: string;
}
