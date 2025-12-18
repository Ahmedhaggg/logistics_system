import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateDriverApplicationDto {
  @Transform(({ value }) => new Date(value))
  @ApiProperty()
  birthday: Date;

  @ApiProperty({ type: 'string', format: 'binary' })
  driverLicense: any;
}
