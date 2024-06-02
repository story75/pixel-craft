import { application } from './application';
import { Editor } from './ui/editor/editor';

const canvas = document.getElementsByTagName('canvas')[0];
application(canvas).catch((e: unknown) => console.error(e));

const editor = new Editor();
document.body.appendChild(editor);
