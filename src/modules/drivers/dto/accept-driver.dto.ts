import { IsString, Matches, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptDriverApplicationDto {
  @ApiProperty({
    example: '08:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'shiftStartTime must be in HH:MM or HH:MM:SS 24-hour format',
  })
  shiftStartTime: string;

    @ApiProperty({
    example: '08:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'shiftEndTime must be in HH:MM or HH:MM:SS 24-hour format',
  })
  shiftEndTime: string;

  @ApiProperty({
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  salary: number;
}
