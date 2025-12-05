import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async deleteUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new NotFoundException();

    if (user.role == 'ADMIN') throw new ForbiddenException();

    await this.userRepository.deleteById(user.id);
  }

  async findAll() {
    const users = await this.userRepository.find();

    return users;
  }
}
