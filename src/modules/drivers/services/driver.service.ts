import { Injectable } from "@nestjs/common";
import { DriverRepository } from "../repositories/driver.repository";

@Injectable()
export class DriverService {
    constructor(private readonly driverRepository: DriverRepository) {}

    async findAll() {
        return this.driverRepository.findAll();
    }

    async findOne(id: string) {
        return this.driverRepository.findById(id);
    }
}