import { JwtPayload } from '@common/types/jwtPayload.type';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class SocketAuthGuard {
  constructor(private jwtService: JwtService) {}

  authenticate(socket: Socket): JwtPayload | void {
    const token = socket.handshake.auth?.token;

    try {
      const payload = this.jwtService.verify<Omit<JwtPayload, 'userId'>>(token);
      console.log('jwt verify result ', payload);
      return { ...payload, userId: payload.sub };
    } catch (error) {
      console.log(error);
      socket.disconnect();
    }
  }
}
