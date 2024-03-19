---
title: Why Pixel Forge?
description: Why does Pixel Forge exist? What problems does it solve?
---

## TL;DR:

- Tailored specifically for 2D pixel art RPGs
- built on web technologies with TypeScript and WebGPU
- easy sharing of games with others
- rapid prototyping
- code-focused
- fun and educational

## Let's dive deeper

There are many rendering packages and game engines out there, so why create another one? I set out to create Pixel Forge for my own needs,
after trying many different game engines and rendering packages. I found that none of them really fit my needs.

:::caution
You should try different game engines and rendering packages to find the right tool for your needs. Pixel Forge is not the right tool for every job!
:::

I believe there is a niche for a game engine specifically tailored for 2D pixel art RPGs, and I want to check the following boxes

- easy to use
- easy to share games
- rapid prototyping
- code focus
- fast enough for 2D pixel art RPGs
- easy to use physics, lighting, pathfinding, Tiled support, sound, dialog systems, etc.
- Customizable if needed
- TypeScript or Rust

### Sounds a lot like RPG Maker?

RPG Maker is a good RPG-specific tool that is really easy to use. However, it is not a code-centric tool, and most games created with it look and feel very similar.
It's really hard to create something unique with RPG Maker, and you're limited if you want to break the mold.

On top of that, RPG Maker is closed source. There is no way to fix bugs or change the behavior of the engine if you need to.
You can write plugins, but you're still limited to what the engine provides, e.g. you'll never be able to add free-form movement to RPG Maker or place objects outside the grid.

### What about Unity, Godot, or Unreal?

Unity, Godot, and Unreal are great tools, but they are general-purpose game engines. They are not specifically designed for 2D pixel art RPGs.
You can plug in a ton of assets and plugins to make them work for you, but you have to sift through a ton of stuff before you get to what you need.

On top of that, using one of these engines comes with a ton of overhead. Especially with Unity and Unreal you have to deal with a lot of bloat and performance overhead.
Sure, that's because they both offer a lot of features, but if you don't need them, you're just wasting resources and time.

Another concern is which programming language to use. Unity uses C#, Godot uses GDScript and Unreal uses C++.
You can use other languages for Godot and Unreal, but none are as well supported as the main language.
There are also alternatives like visual scripting, but that gets really messy really fast.

Personally, I prefer TypeScript and Rust, and I would prefer to write my game in those languages as well.
Building a game is a huge undertaking, and I want to use the tools I'm most comfortable with.

There are others like Construct, GameMaker, Cocos and many others, but none of them clicked for me or the process of creating a game with them was not enjoyable.

### What about other rendering packages like PixiJS, Phaser, Babylon.js, or ThreeJS?

Okay, let's rule out ThreeJS and Babylon.js for now. They focus on 3D rendering. You could use them for 2D games, but why not use something focused on 2D games instead?
In those cases, I would also recommend using one of the above game engines instead.

I used PixiJS before working on Pixel Forge, but why didn't I use Phaser? Phaser is solid and has been around for a long time, but it also shows its age.
Many of the examples and tutorials were either broken or outdated, and the documentation was unhelpful for similar reasons.
As of this writing, Phaser 3.80.1 is the latest version, and the examples seem to be fixed, but the website is still a mess to navigate and shows that they are working on a new version.

Many of the APIs still use callbacks where I would prefer to use promises or async/await for setup code. It was also written before ES modules were a thing, so the game code is not easily optimized by tree-shaking.
Pixel Forge will probably borrow some features from Phaser, or at least take inspiration from it, to capture the good parts with a more modern stack.

This leaves us with PixiJS. PixiJS is a great rendering package, but it is not a game engine. It has received many updates and is still actively maintained.
PixiJS just released v8 two weeks ago, adding WebGPU support and a ton of other improvements.

However, PixiJS is still a rendering package, and you will need to add a lot of additional tools to create a game with it.
You need to add a physics engine, a sound engine, a dialog system, lighting support, and so on. There are packages for some of these things, but not for everything.
In particular, lighting support is lacking, and I'd like to have a lighting system that's easy to use and looks good out of the box, but that's out of the scope of PixiJS at the moment.

After exploring other options, I ended up learning WebGPU. This was a fun learning experience and gave me a lot of insight into how rendering works.
It was also the spark that ignited the idea for Pixel Forge.

## How will Pixel Forge be different?

![Just like standards, frameworks proliferate the same way, I guess.](https://imgs.xkcd.com/comics/standards.png)
_Just like standards, frameworks proliferate the same way, I guess._

Pixel Forge will be built on top of TypeScript and WebGPU, with modern web technologies in mind.
The goal is to be as easy to use as RPG Maker, but with the flexibility of Phaser and the power of PixiJS.
You as a developer should be able to create a game with building blocks or even a template project and then modify it to fit your needs.

:::caution
With all this in mind, Pixel Forge is mainly being developed by one person, and I'm working on this project in my spare time. I'm not trying to create the next big thing.
I'm just trying to create something that I would like to use myself to create games and make the development process easier.
:::

The boxes above roughly translate into the following design principles:

### Easy to use

The documentation should be clear and concise, and there should be plenty of examples of how to assemble the various building blocks to create a game.
There will be a CLI to streamline a lot of common tasks like installing, bundling and running a game.

### Easily share games with others

It is crucial that you can easily share your game with others, because feedback and play-testing are crucial to game development.
A lot of the heavy lifting will be done by the web itself, and you should be able to host your game on a static file server or platforms like itch.io.
Ideally, this should be as simple as telling the CLI to share your game, and then you get a link that you can share with others.

### Rapid Prototyping

For web developers, it is almost expected to see changes in the browser immediately when you save a file. Game development should be no different.
Pixel Forge will use a modern bundler to make this possible, and the CLI should be able to start a local web server with live reload.
This should also include some kind of state management to keep the game state between reloads, so you do not have to start from scratch every time.

Another big part is using the existing ecosystem of web and packages, so you do not have to reinvent the wheel for everything.
There should be extensive support for common tools like Tiled, and many of the building blocks should be interchangeable with your own.

### Code focus

This may be a personal preference or even controversial, but I do not want to create an editor UI for Pixel Forge.
This may conflict with the ease-of-use principle, but I believe that the editor is just another abstraction layer that you have to learn.
I'd rather have some development tools to inspect the game state or move around objects, but that can be done without a full-blown editor.

### Fast enough for 2D pixel art RPGs

The engine is built on top of WebGPU, the successor to WebGL. This means that Pixel Forge can use new rendering techniques that are not possible with WebGL, such as compute shaders.
This will be very fast for 2D pixel art RPGs while offering a lot of flexibility and possibilities.

It should be easy to reason about the pipeline, but the early versions will probably not offer much customization at first.
However, it should be possible to replace it with your own if you really need to.

### Easy to use physics, lighting, pathfinding, tiled support, sound, dialog systems, etc.

There should be a lot of building blocks that you can use to create your game. The goal will be that you can mix and match them to suit your needs.
If you want to make a classic RPG, you should have a battery of experience included.

Common tools like Tiled should be supported out of the box, and there should be plenty of examples of how to use them.

### Customizable if needed

If you want to change something, you should be able to. The building blocks should be easy to modify or replace with your own.
This will be a difficult balance to strike. Ease of use will be more important than customizability, but there should be clear ways to change things if you need to.
Obviously, parts like the rendering pipeline will be much harder to replace than, say, the sound engine, but you get the idea.

### TypeScript

Rust won't be possible with the direction and limitations of WASM and access to the web APIs, but TypeScript will be the main language for Pixel Forge.
So expect types with code completion and all the other goodies that TypeScript provides.
