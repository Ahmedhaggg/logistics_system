import { IsString, IsOptional, Matches, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDriverDto {
  @ApiPropertyOptional({ example: '09:00' })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'shiftStartTime must be in HH:MM format',
  })
  shiftStartTime?: string;

  @ApiPropertyOptional({ example: '17:00' })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'shiftEndTime must be in HH:MM format',
  })
  shiftEndTime?: string;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  salary?: number;
}
