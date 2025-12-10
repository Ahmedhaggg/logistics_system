import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleUserInfo } from '../types/googleAuthUser.type';
import { User } from '@core/users/entities/user.entity';
import { UserRepository } from '@core/users/repositories/user.repository';
import { UserRoleRepository } from '@core/users/repositories/user-role.repository';
import { UserRole } from '@core/users/entities/user_role.entity';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly userRepository: UserRepository, private readonly rolesRepository: UserRoleRepository) {}

  async login(googleUser: GoogleUserInfo): Promise<User & { roles: UserRole[] }> {
    const email = googleUser.email;

    if (!email) throw new UnauthorizedException('Missing Google email');

    let user = await this.userRepository.findOne({ email });
    let roles: UserRole[] = [];

    if (!user) {
      user = await this.userRepository.create({
        email,
        imageUrl: googleUser.picture,
        fullName: googleUser.name,
      });
      await this.rolesRepository.create({
        userId: user.id,
        role: 'CUSTOMER',
      });
    } else {
      roles = await this.rolesRepository.findRolesByUserId(user.id);
    }

    return { ...user, roles };
  }
}
