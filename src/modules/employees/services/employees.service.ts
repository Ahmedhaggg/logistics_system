import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  findAll() {
    return this.employeeRepository.findAll();
  }

  findOne(id: string) {
    return this.employeeRepository.findById(id);
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeRepository.update(id, {
      shiftEndTime: updateEmployeeDto.shiftEndTime,
      shiftStartTime: updateEmployeeDto.shiftStartTime,
      salary: updateEmployeeDto.salary,
    });
  }
}
