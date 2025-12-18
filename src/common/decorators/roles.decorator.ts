import { SetMetadata } from '@nestjs/common';
import { Role } from '@core/users/entities/user_role.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
