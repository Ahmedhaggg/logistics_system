import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { JwtPayload } from '@common/types/jwtPayload.type';
import { Role } from '@core/users/entities/user_role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No role restrictions on this route
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;
    console.log(user);    
    if (!user || !user.roles || !requiredRoles.some(role => user.roles.includes(role))) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
