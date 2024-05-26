import { application } from './application';
import { Root } from './ui/root';
import { TitleScreen } from './ui/title-screen/title-screen';

const canvas = document.getElementsByTagName('canvas')[0];
application(canvas).catch((e: unknown) => console.error(e));

const root = new Root();
document.body.appendChild(root);

const titleScreen = new TitleScreen();
root.appendChild(titleScreen);
