import 'reflect-metadata';

// /* Controller Layer */
import { ChattingController } from '../../chatting/chatting.socket.controller';

describe('ChattingController', () => {
  it('emits a hello message when receiving a message event', () => {
    const controller = new ChattingController();
    const socket = {
      emit: jest.fn(),
    };

    controller.message({ text: 'test' }, socket);

    expect(socket.emit).toHaveBeenCalledWith('message', 'Hello!');
  });

  it('emits a read ack when receiving a read event', () => {
    const controller = new ChattingController();
    const socket = {
      emit: jest.fn(),
    };

    controller.readMessage({ id: 1 }, socket);

    expect(socket.emit).toHaveBeenCalledWith('read', { status: 200 });
  });
});