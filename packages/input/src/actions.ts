export const Actions = {
  Up: 'up',
  Down: 'down',
  Left: 'left',
  Right: 'right',
  Menu: 'menu',
  Accept: 'accept',
  Cancel: 'cancel',
} as const;

export type Actions = (typeof Actions)[keyof typeof Actions];
