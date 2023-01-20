import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';
class WsMessage {
  user: string;
  message: string;
  chatId: string;
  trl: string;
}

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  @SubscribeMessage('msgToServer')
  public async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() wsMessage: WsMessage,
  ) {
    socket.to(wsMessage.chatId).emit('msgToClient', wsMessage);
  }

  @SubscribeMessage('joinChat')
  public joinchatId(
    @ConnectedSocket() socket: Socket,
    @MessageBody('chatId') chatId: string,
  ) {
    socket.join(chatId);
    socket.emit('joinedChat', chatId);
  }

  @SubscribeMessage('leaveChat')
  public leaveChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody('chatId') chatId: string,
  ) {
    socket.leave(chatId);
    socket.emit('leftChat', chatId);
  }

  afterInit(server: Server): void {
    return this.logger.log('Init');
  }
  handleConnection(client: Socket): void {
    return this.logger.log(`client ${client.id} connected`);
  }
  handleDisconnect(client: any): void {
    return this.logger.log(`client ${client.id} disconnected`);
  }
}
