import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TrackReportDto {
  @ApiProperty({ example: 'BE-2026-X8K9P2M4', description: 'Número do protocolo recebido no envio' })
  @IsString()
  @IsNotEmpty({ message: 'Protocolo é obrigatório' })
  protocol!: string;

  @ApiProperty({ example: 'SenhaForte@123', description: 'Senha de acompanhamento definida pelo manifestante' })
  @IsString()
  @IsNotEmpty({ message: 'Senha de acompanhamento é obrigatória' })
  trackingPassword!: string;
}
