import { application } from './application';
import { Root } from './ui/components/root';
import { TitleScreen } from './ui/title-screen/title-screen';

const canvas = document.getElementsByTagName('canvas')[0];
application(canvas).catch((e: unknown) => console.error(e));

Object.entries({
  '--color-inverse': 'rgb(255, 255, 255)',
  '--color-primary': 'rgb(0, 225, 255)',
}).forEach(([key, value]) => {
  document.body.style.setProperty(key, value);
});

const root = new Root();
document.body.appendChild(root);

const titleScreen = new TitleScreen();
root.appendChild(titleScreen);
