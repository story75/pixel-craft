/* @refresh reload */
import { HashRouter, Route } from '@solidjs/router';
import { render } from 'solid-js/web';
import { App } from './app';
import './index.css';
import { PainterPage } from './pages/painter';
import { SpriteSheetPage } from './pages/sprite-sheet';
import { StartPage } from './pages/start';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <HashRouter root={App}>
      <Route path="/" component={StartPage} />
      <Route path="/sprite-sheet" component={SpriteSheetPage} />
      <Route path="/painter" component={PainterPage} />
    </HashRouter>
  ),
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  root!,
);
