import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categorias (Público)')
@Controller('public/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorias ativas para registro de manifestações' })
  async findAllPublic() {
    return this.categoriesService.findAllActive();
  }
}
