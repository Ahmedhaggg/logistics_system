import { JwtPayload } from './jwtPayload.type';

declare module 'socket.io' {
  interface Socket {
    user?: JwtPayload;
  }
}
