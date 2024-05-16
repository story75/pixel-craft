import type {Component} from 'solid-js';
import {setSpriteSheet} from "../state/sprite-sheet";

export const StartPage: Component = () => {
    const onSpriteSheetChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) {
            return;
        }

        setSpriteSheet(file);
        window.location.hash = "#/sprite-sheet";
    }

    return (
        <>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Hello there</h1>
                        <p className="py-6">Start by selecting a sprite sheet to define your tiles and then move on to
                            the editor. <br/> You can jump back anytime to update to your tiles.</p>
                        <input type="file" accept=".png" on:change={onSpriteSheetChange}
                               className="file-input file-input-bordered file-input-primary w-full max-w-xs"/>
                    </div>
                </div>
            </div>
        </>
    );
};