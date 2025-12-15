import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@core/users/repositories/user.repository';
import { Role } from '@core/users/entities/user_role.entity';
import { User } from '@core/users/entities/user.entity';

@Injectable()
export class CustomerService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findByRole(Role.CUSTOMER);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    // Ideally we should check if the user actually has the CUSTOMER role,
    // but for now we assume the ID is correct or the caller handles it.
    // To be safe, we could verify the role here if we had a method for it,
    // or rely on the fact that this service is intended for customers.
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<void> {
    // Ensure user exists
    await this.findOne(id);
    await this.userRepository.updateById(id, updateData);
  }

  async delete(id: string): Promise<void> {
    // Ensure user exists
    await this.findOne(id);
    await this.userRepository.deleteById(id);
  }
}
