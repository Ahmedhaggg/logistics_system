import { JwtPayload } from '@common/types/jwtPayload.type';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SocketAuthGuard {
  constructor(private jwtService: JwtService) {}

  authenticate(socket: Socket): JwtPayload | void {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return {
        userId: uuidv4(),
        role: 'GUEST',
      };
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      console.log('jwt verify result ', payload);
      return payload;
    } catch (error) {
      console.log(error);
      socket.disconnect();
    }
  }
}
