import { Role } from '@core/users/entities/user_role.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  userId: string;
}
