import { Controller, Get, Body, Param, UseGuards, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DriverApplicationService } from '../services/driver-application.service';
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user_role.entity';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateDriverApplicationDto } from '../dto/driver-application.dto';
import { AcceptDriverApplicationDto } from '../dto/accept-driver.dto';
import { CurrentUser } from '@common/decorators/cuurentUser.decorator';
import { UploadedFile as IUploadedFile, StorageService } from '@shared/storage/storage.service';
import { JwtPayload } from '@common/types/jwtPayload.type';

@ApiTags('Drivers Application')
@ApiBearerAuth()
@Controller('drivers/applications')
export class DriverApplicationController {
  constructor(private readonly driverApplicationService: DriverApplicationService, private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('driverLicense'))
  @ApiConsumes('multipart/form-data')
  async createApplication(
    @Body() createDriverDto: CreateDriverApplicationDto,
    @UploadedFile() file: IUploadedFile,
    @CurrentUser() user: JwtPayload,
  ) {
    console.log("body: ", createDriverDto);
    const driverLicenseUrl = await this.storageService.uploadFile(file);

    return this.driverApplicationService.createApplication(user.userId, {
      birthday: createDriverDto.birthday,
      driverLicenseUrl,
    });
  }

  @Post(':id/accept')
  @Roles(Role.MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
  acceptApplication(
    @Param('id') id: string,
    @Body() acceptDriverDto: AcceptDriverApplicationDto,
  ) {
    return this.driverApplicationService.acceptApplication(id, acceptDriverDto);
  }

  @Post(':id/reject')
  @Roles(Role.MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
  rejectApplication(@Param('id') id: string) {
    return this.driverApplicationService.rejectApplication(id);
  }

  @Get()
  @Roles(Role.MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.driverApplicationService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.driverApplicationService.findOne(id);
  }
}
