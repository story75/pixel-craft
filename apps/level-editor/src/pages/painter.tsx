import type {Component} from 'solid-js';
import {setSpriteFrames, spriteFrames, spriteSheet} from "../state/sprite-sheet";
import {createSignal} from "solid-js";
import {
    createContext,
    createTextureLoader,
    pipeline,
    RenderPass,
    Sprite,
    sprite,
    WebGPUContext
} from "@pixel-craft/renderer";
import {EntityStore} from "@pixel-craft/store";
import {composed} from "@pixel-craft/composer";

type Entity = Sprite;

type TimeState = {
    now: number;
    frameTime: number;
    deltaTime: number;
    lastFrame: number;
};
type RendererState = { renderPass: RenderPass; context: WebGPUContext };

export const PainterPage: Component = () => {
    if (!spriteSheet() || spriteFrames().length === 0){
        window.location.hash = "#/";
        return;
    }

    const frames = spriteFrames();
    const spriteImageURL = URL.createObjectURL(spriteSheet());

    const [activeTile, setActiveTile] = createSignal<number>(0);

    const onTileClick = (i: number) => {
        setActiveTile(i);
    };

    const onCanvasMount = async (canvas: HTMLCanvasElement) => {
        const context = await createContext(canvas);
        const textureLoader = createTextureLoader(context.device);

        const [atlas] = await Promise.all([
            textureLoader(spriteSheet()),
        ]);

        const entityStore = new EntityStore<Entity>();
        const spriteQuery = entityStore.with('texture');

        const assertTimeState = (): TimeState => ({
            now: 0,
            frameTime: 0,
            deltaTime: 0,
            lastFrame: 0,
        });

        const assertRendererState = (): RendererState => ({
            renderPass: pipeline(context),
            context,
        });

        const state = composed([assertTimeState(), assertRendererState()]);

        const scaling = { x: 4, y: 4 };
        context.camera.zoom(scaling);
        const tileSize = frames[0].width;

        const tilesX = 10;
        const tilesY = 10;

        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                entityStore.add(
                    sprite({
                        texture: atlas,
                        x: 16 + tileSize * (tilesX / 2 - 0.5) + ((x * tileSize) / 2 + (y * -tileSize) / 2),
                        y: 16 + (x * tileSize) / 4 + (y * tileSize) / 4,
                        frame: frames[0],
                    }),
                );
            }
        }

        const timeSystem = (state: TimeState) => {
            state.frameTime = state.now - state.lastFrame;
            state.deltaTime = state.frameTime * 0.06;
            state.lastFrame = state.now;
        };

        const renderSystem = (state: RendererState) => {
            state.renderPass(spriteQuery);
        };

        const systems = [timeSystem, renderSystem];

        const gameLoop = (now: number) => {
            state.now = now;
            systems.forEach((system) => system(state));

            requestAnimationFrame(gameLoop);
        };

        gameLoop(performance.now());
    }

    return (
        <div class="m-4">
            <div className="mb-4">
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Map width</span>
                    <input className="input input-bordered w-24 join-item" type="number" value="10"/>
                </div>
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Map height</span>
                    <input className="input input-bordered w-24 join-item" type="number" value="10"/>
                </div>
                <button className="btn btn-primary">Save map</button>
            </div>
            <div className="flex mb-4">
                <For each={spriteFrames()}>{(f, i) =>
                    <div className="mr-4" on:click={() => onTileClick(i())} style={{
                        cursor: "pointer",
                        width: `${f.width}px`,
                        height: `${f.height}px`,
                        "image-rendering": "pixelated",
                        background: `url(${spriteImageURL})`,
                        "background-position": `-${f.x}px -${f.y}px`,
                        filter: activeTile() === i() ? 'none' : "grayscale(1)",
                        outline: activeTile() === i() ? "1px solid rgba(255,0,0,0.4)" : "1px solid transparent",
                        "outline-offset": "4px",
                    }}></div>
                }</For>
            </div>
            <canvas ref={onCanvasMount}></canvas>
        </div>
    );
};