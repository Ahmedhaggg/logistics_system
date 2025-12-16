import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Role } from '@core/users/entities/user_role.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@common/decorators/roles.decorator';
import { DriverService } from '../services/driver.service';

@ApiTags('Drivers')
@ApiBearerAuth()
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @Roles(Role.MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  @Roles(Role.MANAGER, Role.DRIVER)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }
}
