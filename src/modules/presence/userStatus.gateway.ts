import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserStatusService } from './services/userStatus.service';
import { SocketAuthGuard } from '@common/guards/socketAuthGateway.guard';

@WebSocketGateway()
export class UserStatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private socketAuthGuard: SocketAuthGuard,
    private userStatusService: UserStatusService,
  ) {}

  async handleConnection(client: Socket) {
    const user = this.socketAuthGuard.authenticate(client);

    if (!user) return;

    client.user = user;

    await this.userStatusService.setUserStatus(user.userId, 'ONLINE');
  }

  async handleDisconnect(client: Socket) {
    await this.userStatusService.setUserStatus(client.user!.userId, 'OFFLINE');
  }
}
