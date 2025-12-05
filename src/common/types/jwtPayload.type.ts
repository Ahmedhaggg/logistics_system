import { UserRole } from '@module/users/entities/user.entity';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
