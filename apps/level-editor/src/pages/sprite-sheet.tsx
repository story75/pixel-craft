import type {Component} from 'solid-js';
import {setSpriteFrames, spriteSheet} from "../state/sprite-sheet";
import {createSignal} from "solid-js";

export const SpriteSheetPage: Component = () => {
    if (!spriteSheet()) {
        window.location.hash = "#/";
        return;
    }

    const [activeTiles, setActiveTiles] = createSignal<string[]>([]);
    const [imageWidth, setImageWidth] = createSignal<number>(0);
    const [imageHeight, setImageHeight] = createSignal<number>(0);
    const onImageLoad = (e: Event) => {
        const target = e.target as HTMLImageElement;
        setImageWidth(target.width);
        setImageHeight(target.height);
    }

    const [zoom, setZoom] = createSignal<number>(4);
    const zooms = [1, 2, 4];
    const onZoomChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setZoom(Number(target.value));
    }

    const [tileSize, setTileSize] = createSignal<number>(16);
    const tileSizes = [16, 32, 48];
    const onTileSizeChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setTileSize(Number(target.value));
        setActiveTiles([]);
    }

    const [margin, setMargin] = createSignal<number>(0);
    const margins = [0, 16, 32];
    const onMarginChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setMargin(Number(target.value));
        setActiveTiles([]);
    }

    const zoomedTileSize = () => tileSize() * zoom();
    const tileCountX = () => Math.floor((imageWidth() - margin() * 2) / tileSize());
    const tileCountY = () => Math.floor((imageHeight() - margin() * 2) / tileSize());

    const tileKey = (x: number, y: number) => `${x}:${y}`;

    const onTileClick = (x: number, y: number) => {
        const key = tileKey(x, y);
        const tiles = activeTiles();
        if (tiles.includes(key)) {
            setActiveTiles(tiles.filter(t => t !== key));
        } else {
            setActiveTiles([...tiles, key]);
        }
    }

    const onSaveTiles = () => {
        if (activeTiles().length === 0) {
            return;
        }

        const frames = activeTiles().map(key => {
            const [x, y] = key.split(":").map(Number);
            return {
                x: margin() + x * tileSize(),
                y: margin() + y * tileSize(),
                width: tileSize(),
                height: tileSize(),
            };
        });
        setSpriteFrames(frames);
        window.location.hash = "#/painter";
    }

    return (
        <div class="m-4">
            <div className="mb-4">
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Zoom</span>
                    <For each={zooms}>{(z) =>
                        <input className="join-item btn" type="radio" name="zoom"
                               checked={zoom() === z} value={z} aria-label={`${z}x`} on:change={onZoomChange}/>
                    }</For>
                </div>
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Tile size</span>
                    <For each={tileSizes}>{(t) =>
                        <input className="join-item btn" type="radio" name="tile-size"
                               checked={tileSize() === t} value={t} aria-label={`${t}px`} on:change={onTileSizeChange}/>
                    }</For>
                </div>
                <div className="join mr-4">
                    <span className="join-item btn no-animation">Margin</span>
                    <For each={margins}>{(m) =>
                        <input className="join-item btn" type="radio" name="margin"
                               checked={margin() === m} value={m} aria-label={`${m}px`} on:change={onMarginChange}/>
                    }</For>
                </div>
                <button className="btn btn-primary" disabled={activeTiles().length === 0} on:click={onSaveTiles}>Save tiles</button>
            </div>
            <div className="mb-4">
                <div className="inline-block">
                    <div className="absolute">
                        <div className="flex flex-col" style={{padding: `${margin() * zoom()}px`}}>
                            <For each={[...new Array(tileCountY())]}>{(_, y) =>
                                <div className="flex">
                                    <For each={[...new Array(tileCountX())]}>{(_, x) =>
                                        <div on:click={() => onTileClick(x(), y())} style={{
                                            cursor: "pointer",
                                            "box-sizing": "border-box",
                                            width: `${zoomedTileSize()}px`,
                                            height: `${zoomedTileSize()}px`,
                                            border: activeTiles().includes(tileKey(x(), y())) ? `${zoom()}px solid rgba(255, 0, 0, 0.4)` : "none",
                                            background: activeTiles().includes(tileKey(x(), y())) ? `rgba(0, 0, 0, 0)` : `rgba(0, 0, 0, 0.4)`,
                                        }}>{x}{y}</div>
                                    }</For>
                                </div>
                            }</For>
                        </div>
                    </div>
                    <div className="checkerboard" style={{
                        "background-size": `${zoomedTileSize()}px ${zoomedTileSize()}px`,
                    }}>
                        <img src={URL.createObjectURL(spriteSheet())} style={{zoom: zoom(), "image-rendering": "pixelated"}}
                             on:load={onImageLoad}/>
                    </div>
                </div>
            </div>
        </div>
    );
};