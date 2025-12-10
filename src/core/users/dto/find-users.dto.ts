import { IsEnum, IsNumber, IsString } from "class-validator";

export class FindUserDto {
    @IsNumber()
    page?: number;

    @IsString()
    search?: string;

    @IsString()
    @IsEnum(["CUSTOMER", "DRIVER", "WAREHOUSE_STAFF", "MANAGER"])
    role?: string;
}