import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user_role.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/cuurentUser.decorator';
import { JwtPayload } from '@common/types/jwtPayload.type';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @Roles(Role.MANAGER)
  findAll() {
    return this.customerService.findAll();
  }

  @Get('profile')
  @Roles(Role.CUSTOMER)
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.customerService.findOne(user.userId);
  }

  @Get(':id')
  @Roles(Role.MANAGER)
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  remove(@Param('id') id: string) {
    console.log('id', id);
    return this.customerService.delete(id);
  }
}
