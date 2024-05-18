import type {Component} from 'solid-js';
import {setState, state} from "../state/state";
import {createSignal} from "solid-js";
import {produce} from "solid-js/store";
import {createContext, createTextureLoader, pipeline, RenderPass, Sprite, sprite} from "@pixel-craft/renderer";
import {EntityStore} from "@pixel-craft/store";

export const PainterPage: Component = () => {
    if (!state.spriteSheet || state.spriteFrames.length === 0){
        window.location.hash = "#/";
        return;
    }

    let isMouseDown = false;

    document.addEventListener('mousedown', () => {
        isMouseDown = true;
    });
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    const frames = state.spriteFrames;
    const tileWidth = frames[0].width;
    const tileHeight = frames[0].height;
    const spriteImageURL = URL.createObjectURL(state.spriteSheet);
    const [activeTile, setActiveTile] = createSignal<number>(0);
    const [activeLayer, setActiveLayer] = createSignal<number>(0);

    const currentLayer = () => state.mapOptions.layers[activeLayer()];

    let entityStore: EntityStore<any>;
    let atlas: GPUTexture;
    let renderPass: RenderPass | undefined;

    const renderMap = () => {
        if (!renderPass) {
            return;
        }

        entityStore.clear();

        const tileSize = state.spriteSheetOptions.tileSize;

        const tilesX = state.mapOptions.width;
        const tilesY = state.mapOptions.height;

        for (let layer = 0; layer < state.mapOptions.layers.length; layer++) {
            for (let y = 0; y < tilesY; y++) {
                for (let x = 0; x < tilesX; x++) {
                    const frameIndex = state.mapOptions.layers[layer][x][y];
                    if (frameIndex === undefined) {
                        continue;
                    }

                    entityStore.add(
                        sprite({
                            texture: atlas,
                            x: tileSize * 7 + ((x * tileSize) / 2 + (y * -tileSize) / 2),
                            y: (x * tileSize) / 4 + (y * tileSize) / 4,
                            frame: state.spriteFrames[frameIndex],
                        }),
                    );
                }
            }
        }

        renderPass(entityStore as Sprite[]);
    }

    const onTileClick = (i: number) => {
        setActiveTile(i);
    };

    const onLayerClick = (i: number) => {
        setActiveLayer(i);
    }

    const onWidthChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        // TODO: Extend layers
        setState(s => ({
            ...s,
            mapOptions: {
                ...s.mapOptions,
                width: Number(target.value),
                layers: s.mapOptions.layers.map(() => [...new Array(Number(target.value))].map(() => [...new Array(s.mapOptions.height)])),
            }
        }));
    }

    const onHeightChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        // TODO: Extend layers
        setState(s => ({
            ...s,
            mapOptions: {
                ...s.mapOptions,
                height: Number(target.value),
                layers: s.mapOptions.layers.map(() => [...new Array(s.mapOptions.width)].map(() => [...new Array(Number(target.value))])),
            }
        }));
    }

    const onLayerAdd = () => {
        setState(s => ({
            ...s,
            mapOptions: {
                ...s.mapOptions,
                layers: [
                    ...s.mapOptions.layers,
                    [...new Array(s.mapOptions.width)].map(() => [...new Array(s.mapOptions.height)]),
                ],
            }
        }));
    }

    const onLayerRemove = () => {
        setState(s => ({
            ...s,
            mapOptions: {
                ...s.mapOptions,
                layers: s.mapOptions.layers.slice(0, -1),
            }
        }));
    }

    const onTilePaint = (x: number, y: number, force?: boolean) => {
        if (!isMouseDown && !force) {
            return;
        }
        setState(produce(s => {
            s.mapOptions.layers[activeLayer()][x][y] = activeTile();
        }));

        renderMap();
    }

    const onSave = () => {
        const map = state.mapOptions.layers.map(layer => layer.map(row => row.map(tileIndex => tileIndex ?? -1)));
        console.log(map);
    }

    if (state.mapOptions.layers.length === 0) {
        onLayerAdd();
    }

    const onCanvasMount = async (canvas: HTMLCanvasElement) => {
        const context = await createContext(canvas, {
            width: 960,
            height: 540,
        });
        const textureLoader = createTextureLoader(context.device);
        atlas = await textureLoader(state.spriteSheet!);

        entityStore = new EntityStore();
        renderPass = pipeline(context);

        const scaling = { x: 2, y: 2 };
        context.camera.zoom(scaling);

        renderMap();
    }

    return (
        <div class="m-4">
            <div className="mb-4">
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Map width</span>
                    <input className="input input-bordered w-24 join-item" type="number" value={state.mapOptions.width}
                           on:change={onWidthChange}/>
                </div>
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Map height</span>
                    <input className="input input-bordered w-24 join-item" type="number" value={state.mapOptions.height}
                           on:change={onHeightChange}/>
                </div>
                <div className="join mr-4">
                    <span className="join-item btn no-animation">
                        Active Layer
                    </span>
                    <For each={state.mapOptions.layers}>{(l, i) =>
                        <button classList={{
                            'join-item': true,
                            'btn': true,
                            'btn-primary': activeLayer() === i(),
                        }} on:click={() => onLayerClick(i())}>{i}</button>
                    }</For>
                </div>
                <div className="join mr-4">
                    <button className="join-item btn btn-error" on:click={onLayerRemove}>
                        Remove layer
                    </button>
                    <button className="join-item btn btn-primary" on:click={onLayerAdd}>
                        Add layer
                    </button>
                </div>
                <button className="btn btn-primary" on:click={onSave}>Save map</button>
            </div>
            <div className="flex mb-4">
                <For each={frames}>{(f, i) =>
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
            <div className="flex mb-4">
                <div className="flex flex-col mb-4">
                    <For each={currentLayer()}>{(row, x) =>
                        <div className="flex">
                            <For each={row}>{(tileIndex, y) =>
                                <div on:mousemove={() => onTilePaint(x(), y())} on:click={() => onTilePaint(x(), y(), true)} style={{
                                    cursor: "pointer",
                                    "box-sizing": "border-box",
                                    margin: '2px',
                                    width: `${tileWidth}px`,
                                    height: `${tileHeight}px`,
                                    "image-rendering": "pixelated",
                                    background: tileIndex !== undefined ? `url(${spriteImageURL})` : 'rgba(0, 0, 0, 0.5)',
                                    "background-position": tileIndex !== undefined ? `-${state.spriteFrames[tileIndex].x}px -${state.spriteFrames[tileIndex].y}px` : 'initial',
                                }}></div>
                            }</For>
                        </div>
                    }</For>
                </div>
                <canvas ref={onCanvasMount}></canvas>
            </div>
        </div>
    );
};