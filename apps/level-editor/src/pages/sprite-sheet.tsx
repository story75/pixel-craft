import type {Component} from 'solid-js';
import {createSignal} from "solid-js";
import {setState, state} from "../state/state";

export const SpriteSheetPage: Component = () => {
    if (!state.spriteSheet) {
        window.location.hash = "#/";
        return;
    }

    const [imageWidth, setImageWidth] = createSignal<number>(0);
    const [imageHeight, setImageHeight] = createSignal<number>(0);
    const onImageLoad = (e: Event) => {
        const target = e.target as HTMLImageElement;
        setImageWidth(target.width);
        setImageHeight(target.height);
    }

    const zooms = [1, 2, 4];
    const onZoomChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setState(s => ({
            ...s,
            spriteSheetOptions: {
                ...s.spriteSheetOptions,
                zoom: Number(target.value),
            }
        }));
    }

    const tileSizes = [16, 32, 48];
    const onTileSizeChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setState(s => ({
            ...s,
            spriteSheetOptions: {
                ...s.spriteSheetOptions,
                tileSize: Number(target.value),
                activeTiles: [],
            }
        }));
    }

    const margins = [0, 16, 32];
    const onMarginChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setState(s => ({
            ...s,
            spriteSheetOptions: {
                ...s.spriteSheetOptions,
                margin: Number(target.value),
                activeTiles: [],
            }
        }));
    }

    const zoomedTileSize = () => state.spriteSheetOptions.tileSize * state.spriteSheetOptions.zoom;
    const activeTilesLength = () => state.spriteSheetOptions.activeTiles.length;
    const tileCountX = () => Math.floor((imageWidth() - state.spriteSheetOptions.margin * 2) / state.spriteSheetOptions.tileSize);
    const tileCountY = () => Math.floor((imageHeight() - state.spriteSheetOptions.margin * 2) / state.spriteSheetOptions.tileSize);

    const tileKey = (x: number, y: number) => `${x}:${y}`;

    const onTileClick = (x: number, y: number) => {
        const key = tileKey(x, y);
        const tiles = state.spriteSheetOptions.activeTiles;
        if (tiles.includes(key)) {
            setState(s => ({
                ...s,
                spriteSheetOptions: {
                    ...s.spriteSheetOptions,
                    activeTiles: tiles.filter(t => t !== key),
                }
            }));
        } else {
            setState(s => ({
                ...s,
                spriteSheetOptions: {
                    ...s.spriteSheetOptions,
                    activeTiles: [...tiles, key],
                }
            }));
        }
    }

    const onSaveTiles = () => {
        if (state.spriteSheetOptions.activeTiles.length === 0) {
            return;
        }

        const frames = state.spriteSheetOptions.activeTiles.map(key => {
            const [x, y] = key.split(":").map(Number);
            const tileSize = state.spriteSheetOptions.tileSize;
            return {
                x: state.spriteSheetOptions.margin + x * tileSize,
                y: state.spriteSheetOptions.margin + y * tileSize,
                width: tileSize,
                height: tileSize,
            };
        });
        setState(s => ({
            ...s,
            spriteFrames: frames,
        }));
        window.location.hash = "#/painter";
    }

    return (
        <div class="m-4">
            <div className="mb-4">
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Zoom</span>
                    <For each={zooms}>{(z) =>
                        <input className="join-item btn" type="radio" name="zoom"
                               checked={state.spriteSheetOptions.zoom === z} value={z} aria-label={`${z}x`} on:change={onZoomChange}/>
                    }</For>
                </div>
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Tile size</span>
                    <For each={tileSizes}>{(t) =>
                        <input className="join-item btn" type="radio" name="tile-size"
                               checked={state.spriteSheetOptions.tileSize === t} value={t} aria-label={`${t}px`} on:change={onTileSizeChange}/>
                    }</For>
                </div>
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Margin</span>
                    <For each={margins}>{(m) =>
                        <input className="join-item btn" type="radio" name="margin"
                               checked={state.spriteSheetOptions.margin === m} value={m} aria-label={`${m}px`} on:change={onMarginChange}/>
                    }</For>
                </div>
                <button className="btn btn-primary" disabled={activeTilesLength() === 0} on:click={onSaveTiles}>Save
                    tiles
                </button>
            </div>
            <div className="mb-4">
                <div className="inline-block">
                    <div className="absolute">
                        <div className="flex flex-col" style={{padding: `${state.spriteSheetOptions.margin * state.spriteSheetOptions.zoom}px`}}>
                            <For each={[...new Array(tileCountY())]}>{(_, y) =>
                                <div className="flex">
                                    <For each={[...new Array(tileCountX())]}>{(_, x) =>
                                        <div on:click={() => onTileClick(x(), y())} style={{
                                            cursor: "pointer",
                                            "box-sizing": "border-box",
                                            width: `${zoomedTileSize()}px`,
                                            height: `${zoomedTileSize()}px`,
                                            border: state.spriteSheetOptions.activeTiles.includes(tileKey(x(), y())) ? `${state.spriteSheetOptions.zoom}px solid rgba(255, 0, 0, 0.4)` : "none",
                                            background: state.spriteSheetOptions.activeTiles.includes(tileKey(x(), y())) ? `rgba(0, 0, 0, 0)` : `rgba(0, 0, 0, 0.4)`,
                                        }}>{x}{y}</div>
                                    }</For>
                                </div>
                            }</For>
                        </div>
                    </div>
                    <div className="checkerboard" style={{
                        "background-size": `${zoomedTileSize()}px ${zoomedTileSize()}px`,
                    }}>
                        <img src={URL.createObjectURL(state.spriteSheet)}
                             style={{zoom: state.spriteSheetOptions.zoom, "image-rendering": "pixelated"}}
                             on:load={onImageLoad}/>
                    </div>
                </div>
            </div>
        </div>
    );
};