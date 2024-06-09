import { Editor } from './ui/editor';

const canvas = document.getElementsByTagName('canvas')[0];

const editor = new Editor();
editor.canvas = canvas;
document.body.appendChild(editor);
