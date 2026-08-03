import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    try {
      const categories = await this.prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      if (categories.length > 0) return categories;
    } catch {
      // Fallback
    }
    return [
      { id: 'cat-1', code: 'MORAL_HARASSMENT', name: 'Assédio Moral', description: 'Condutas abusivas frequentes no ambiente de trabalho', slaDays: 15 },
      { id: 'cat-2', code: 'SEXUAL_HARASSMENT', name: 'Assédio Sexual', description: 'Insinuações, propostas não solicitadas ou constrangimento sexual', slaDays: 10 },
      { id: 'cat-3', code: 'DISCRIMINATION', name: 'Discriminação e Diversidade', description: 'Tratamento diferencial por raça, gênero, religião ou orientação', slaDays: 15 },
      { id: 'cat-4', code: 'ETHICAL_DEVIATION', name: 'Desvio de Conduta Ética', description: 'Inobservância do Código de Conduta do Grupo Bairral', slaDays: 15 },
    ];
  }
}
