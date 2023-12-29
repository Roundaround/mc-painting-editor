import type {
  ActionMessage,
  DoneMessage,
  ErrorMessage,
} from '$common/worker/common';
import { isAcceptedMessages } from '$common/worker/common';

export type P2CMessage = never;

export type C2PMessage = ErrorMessage | ActionMessage | DoneMessage<{}>;

export function isP2CMessage(message: unknown): message is P2CMessage {
  return isAcceptedMessages(message, []);
}

export function isC2PMessage(message: unknown): message is C2PMessage {
  return isAcceptedMessages(message, ['error', 'action', 'done']);
}
