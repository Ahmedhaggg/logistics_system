import { Controller, Get, Body, Param, UseGuards, Post } from '@nestjs/common';
import { DriverService } from '../services/driver.service';
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user_role.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateDriverApplicationDto } from '../dto/driver-application.dto';
import { AcceptDriverApplicationDto } from '../dto/accept-driver.dto';
import { CurrentUser } from '@common/decorators/cuurentUser.decorator';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('application')
  createApplication(
    @Body() createDriverDto: CreateDriverApplicationDto,
    @CurrentUser() userId: string,
  ) {
    return this.driverService.createApplication(userId, createDriverDto);
  }

  @Post('accept/:id')
  @Roles(Role.MANAGER)
  acceptApplication(
    @Param('id') id: string,
    @Body() acceptDriverDto: AcceptDriverApplicationDto,
  ) {
    return this.driverService.acceptApplication(id, acceptDriverDto);
  }

  @Post('reject/:id')
  @Roles(Role.MANAGER)
  rejectApplication(@Param('id') id: string) {
    return this.driverService.rejectApplication(id);
  }

  @Get()
  @Roles(Role.MANAGER)
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  @Roles(Role.MANAGER)
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }
}
