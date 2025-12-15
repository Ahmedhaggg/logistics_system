import { IsString, Matches, IsNumber, Min } from 'class-validator';

export class AcceptDriverApplicationDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'shiftStartTime must be in HH:MM or HH:MM:SS 24-hour format',
  })
  shiftStartTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'shiftEndTime must be in HH:MM or HH:MM:SS 24-hour format',
  })
  shiftEndTime: string;

  @IsNumber()
  @Min(0)
  salary: number;
}
