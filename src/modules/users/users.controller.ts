import { Controller, Post, Body, UseGuards, Delete, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { AuthGuard } from '@common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DeleteUserDto } from './dto/deleteUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Delete('/:id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Body() body: DeleteUserDto) {
    await this.usersService.deleteUserByEmail(body.email);
    return { success: true };
  }

  @ApiBearerAuth()
  @Get('/')
  // @Roles('ADMIN')
  // @UseGuards(AuthGuard, RolesGuard)
  async findAll() {
    const users = await this.usersService.findAll();

    return { users };
  }
}
