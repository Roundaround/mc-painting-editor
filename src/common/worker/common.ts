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

export type DoneMessage<C> = {
  type: 'done';
} & C;

export function isAcceptedMessages<T extends never | { type: string }>(
  message: unknown,
  acceptedTypes: T['type'][]
): message is T {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    typeof message.type === 'string' &&
    acceptedTypes.includes(message.type as T['type'])
  );
}
