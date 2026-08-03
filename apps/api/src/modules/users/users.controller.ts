import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Gestão de Usuários & Acessos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('MANAGE_USERS')
  @ApiOperation({ summary: 'Listar todos os usuários cadastrados (Requer MANAGE_USERS)' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermissions('MANAGE_USERS')
  @ApiOperation({ summary: 'Obter detalhes de um usuário pelo ID (Requer MANAGE_USERS)' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @RequirePermissions('MANAGE_USERS')
  @ApiOperation({ summary: 'Cadastrar novo usuário (Requer MANAGE_USERS)' })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    return this.usersService.create(dto, currentUserId);
  }

  @Put(':id')
  @RequirePermissions('MANAGE_USERS')
  @ApiOperation({ summary: 'Atualizar usuário existente (Requer MANAGE_USERS)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    return this.usersService.update(id, dto, currentUserId);
  }

  @Delete(':id')
  @RequirePermissions('MANAGE_USERS')
  @ApiOperation({ summary: 'Excluir usuário cadastrado (Requer MANAGE_USERS)' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('sub') currentUserId: string,
  ) {
    return this.usersService.remove(id, currentUserId);
  }
}
