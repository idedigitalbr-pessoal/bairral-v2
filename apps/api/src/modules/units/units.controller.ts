import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UnitsService } from './units.service';

@ApiTags('Unidades (Público)')
@Controller('public/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar unidades e departamentos para seleção no formulário público' })
  async findAllPublic() {
    return this.unitsService.findAllActiveWithDepartments();
  }
}
