/* @refresh reload */
import {render} from 'solid-js/web';
import {HashRouter, Route} from "@solidjs/router";
import {App} from "./app";
import "./index.css";
import {StartPage} from "./pages/start";
import {SpriteSheetPage} from "./pages/sprite-sheet";
import {PainterPage} from "./pages/painter";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

render(() => (
    <HashRouter root={App}>
        <Route path="/" component={StartPage}/>
        <Route path="/sprite-sheet" component={SpriteSheetPage}/>
        <Route path="/painter" component={PainterPage}/>
    </HashRouter>
), root!);