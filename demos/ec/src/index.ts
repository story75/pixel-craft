import { application } from './application';

const canvas = document.getElementsByTagName('canvas')[0];
// eslint-disable-next-line no-console
application(canvas).catch((e: unknown) => console.error(e));
