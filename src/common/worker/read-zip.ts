import type { PayloadAction } from '@reduxjs/toolkit';

export type ErrorMessage = {
  type: 'error';
  content: string | Error;
};

export type BasePayloadAction = Omit<
  PayloadAction<unknown, string, any>,
  'meta'
>;

export type ActionMessage<T extends BasePayloadAction = BasePayloadAction> = {
  type: 'action';
  action: T;
};

export type DoneMessage = {
  type: 'done';
  filename: string;
};

export type P2CMessage = never;

export type C2PMessage = ErrorMessage | ActionMessage | DoneMessage;

export function isP2CMessage(message: unknown): message is P2CMessage {
  const acceptedTypes: P2CMessage['type'][] = [];
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    typeof message.type === 'string' &&
    acceptedTypes.includes(message.type as P2CMessage['type'])
  );
}

export function isC2PMessage(message: unknown): message is C2PMessage {
  const acceptedTypes: C2PMessage['type'][] = ['error', 'action', 'done'];
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    typeof message.type === 'string' &&
    acceptedTypes.includes(message.type as C2PMessage['type'])
  );
}
