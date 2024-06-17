import { application } from './application';
import { Editor } from './ui/editor';

(async () => {
  const canvas = document.getElementsByTagName('canvas')[0];
  await application(canvas);

  const editor = new Editor();
  document.body.appendChild(editor);
})().catch((e: unknown) => console.error(e));
