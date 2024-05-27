import { application } from './application';
import { Root } from './ui/root';
// import { TitleScreen } from './ui/title-screen/title-screen';
import { Settings } from './ui/title-screen/settings';

const canvas = document.getElementsByTagName('canvas')[0];
application(canvas).catch((e: unknown) => console.error(e));

const root = new Root();
document.body.appendChild(root);

const titleScreen = new Settings();
root.appendChild(titleScreen);
