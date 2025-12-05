import { User } from '@module/users/entities/user.entity';
import { UserRepository } from '@module/users/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleUserInfo } from '../types/googleAuthUser.type';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(googleUser: GoogleUserInfo): Promise<User> {
    const email = googleUser.email;

    if (!email) throw new UnauthorizedException('Missing Google email');

    let user = await this.userRepository.findOne({ email });

    if (!user)
      user = await this.userRepository.create({
        email,
        name: googleUser.name,
        role: 'GUEST',
        photo: googleUser.picture,
      });
    else
      await this.userRepository.updateById(user.id, { lastLogin: new Date() });

    return user;
  }
}
