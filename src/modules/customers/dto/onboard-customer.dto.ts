import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class OnboardCustomerDto {
  @ApiProperty({ example: '0123456789', required: true })
  @IsPhoneNumber('EG', { message: 'Invalid phone number' })
  phoneNumber: string;
}
