---
title: Why Pixel Forge?
description: Why does Pixel Forge exist? What problems does it solve?
---

## TL;DR:

- specifically tailored to 2D pixel art RPGs
- built on top of web technologies with TypeScript and WebGPU
- easy to share games with others
- rapid prototyping
- code focused
- fun and learning

## Let's dive deeper

There are many rendering packages and game engines out there, so why create another one? I've set out to create Pixel Forge for my own needs,
after trying out many different game engines and rendering packages. I've found that none of them really fit my needs.

:::caution
You should try out different game engines and rendering packages to find the right tool for your needs. Pixel Forge is not the right tool for every job!
:::

I believe there is a niche for a game engine that is specifically tailored to 2D pixel art RPGs and I want to tick the following boxes:

- easy to use
- easy to share games with others
- rapid prototyping
- code focus
- fast enough for 2D pixel art RPGs
- easy to use physics, lighting, pathfinding, Tiled support, sound, dialog systems, etc.
- customizable if needed
- TypeScript or Rust

### Sounds awfully similar to RPG Maker?

RPG Maker is a good tool specifically tailored to RPGs and really easy to use. However, it is not a code focused tool and most games created with it look and feel very similar.
It is really hard to create something unique with RPG Maker, and you're limited if you want to break out of the mold.

On top of that RPG Maker is closed source. There is no way to fix bugs or change engine behavior if you need to.
You can write plugins, but you're still limited to what the engine provides e.g. you will never be able to add free form movement to RPG Maker or place objects outside the grid.

### Then what about Unity, Godot or Unreal?

Unity, Godot, and Unreal are great tools, but they are general purpose game engines. They are not specifically tailored to 2D pixel art RPGs.
You can pull in a ton of assets and plugins to make them work for you, but you first have to sift through a ton of stuff before landing on what you need.

On top of that employing any of these engines comes with a ton of overhead. Especially with Unity and Unreal, you have to deal with a lot of bloat and performance overhead.
Sure that is because both offer a lot of features, but if you don't need them, you're just wasting resources and time.

Another concern is which programming language to use. Unity uses C#, Godot uses GDScript, and Unreal uses C++.
For Godot and Unreal you can also use other languages, but none are as well-supported as the main language.
There are also alternatives like visual scripting, but that gets really messy really fast.

I personally prefer TypeScript and Rust, and I would prefer to write my game in these languages as well.
Creating a game is huge undertaking, and I want to use the tools that I'm most comfortable with.

There are also others like Construct, GameMaker, Cocos and a lot of others, but none of them clicked for me or the process of creating a game with them was not enjoyable.

### What about other rendering packages like PixiJS, Phaser, Babylon.js, or ThreeJS?

Okay let's rule out ThreeJS and Babylon.js first. They are focused on 3D rendering. You could use them for 2D games, but why not use something focused on 2D games instead?
In those cases I would also instead recommend using a game engine from the ones mentioned above.

Before working on Pixel Forge I've used PixiJS, but why did I not use Phaser? Phaser is solid and has been around for a long time, but the time is also starting to show.
A lot of the examples and tutorials were either broken or outdated, and the documentation was not helpful for similar reasons.
As of writing this right now, Phase 3.80.1 is the latest version, and the examples seem to be fixed, but the website is still a mess to navigate and showing that they are working on a new version.

A lot of the APIs still use callbacks, where I would prefer to use Promises or async/await for setup code. It was also written before ES Modules were a thing, and thus the game code cannot be easily optimized by tree shaking.
Pixel Forge will likely borrow some feature from Phaser or at least take inspiration from it, to capture the good parts with a more modern stack.

This leaves us with PixiJS. PixiJS is a great rendering package, but it is not a game engine. It has received a lot of updates and is still actively maintained.
PixiJS has released v8 just two weeks ago, and implemented WebGPU support and done a ton of other improvements.

However, PixiJS is still a rendering package, and you will need to add a lot of additional tooling to create a game with it.
You will need to add a physics engine, a sound engine, a dialog system, lighting support, etc. There are packages for some of these, but not for everything.
Especially the lighting support is lacking, and I would like to have a lighting system that is easy to use and looks good out of the box, but that's out of scope for PixiJS as of right now.

After exploring other options I ultimately ended up learning WebGPU. This was a fun learning experience and offered a lot of insights into how rendering works.
In the end that was also the spark that ignited the idea for Pixel Forge.

## How will Pixel Forge be different?

![Just like standards, frameworks proliferate the same way I guess.](https://imgs.xkcd.com/comics/standards.png)
_Just like standards, frameworks proliferate the same way I guess._

Pixel Forge will be built on top of TypeScript and WebGPU, with modern web technologies in mind.
The goal should be to be as easy to use as RPG Maker, but with the flexibility of Phaser and the performance of PixiJS.
You as a developer should be able to create a game with building blocks or even a template project, and then change them to fit your needs.

:::caution
With all that in mind, Pixel Forge will mainly be developed by one person, and I'm working on this project in my free-time. I'm not trying to create the next big thing.
I'm just trying to create something that I would enjoy using myself to create games and ease the development process.
:::

The boxes above roughly translate to the following design principles:

### Easy to use

The documentation should be clear and concise, and there should be a lot of examples on how to assemble the different building blocks to create a game.
There will be a CLI to streamline a lot of common tasks, like installation, bundling, and running a game.

### Easy to share games with others

It is crucial that you can easily share your game with others, because feedback and play-testing is crucial for game development.
A lot of the heavy lifting will be done by the web itself, and you should be able to host your game on a static file server or platforms like itch.io.
Ideally, this should be as simple as telling the CLI to share your game, and then you get a link that you can share with others.

### Rapid prototyping

For web developers it is almost expected to instantly see changes in the browser when you save a file. This should be no different for game development.
Pixel Forge will use a modern bundler to make this possible, and the CLI should be able to start a local web server with live reload.
This should also feature some kind of state management to keep the game state between reloads, so you do not have to start from scratch every time.

Another big part is leveraging the existing ecosystem of the web and packages, so you do not have to reinvent the wheel for everything.
There should be comprehensive support for common tools like Tiled, and a lot of the building blocks should be interchangeable with your own.

### Code focus

This may be a personal preference or even controversial, but I want to refrain from creating an editor UI for Pixel Forge.
This may collide with the easy to use principle, but I believe that the editor is just another abstraction layer that you have to learn.
I'd rather have some dev tools to inspect the game state or move around objects, but that can be done without a full-blown editor.

### Fast enough for 2D pixel art RPGs

The engine will be built on top of WebGPU, which is the successor to WebGL. This means that Pixel Forge can employ new rendering techniques that are not possible with WebGL, like compute shaders for example.
This will be plenty fast for 2D pixel art RPGs while offering a lot of flexibility and possibilities.

It should be easy to reason about the pipeline, but the early versions will likely not offer a lot of customization at the beginning.
Though it should be possible to replace it with your own if you really need to.

### Easy to use physics, lighting, pathfinding, Tiled support, sound, dialog systems, etc.

There should be a lot of building blocks that you can use to create your game. The goal will be that you can mix and match them to fit your needs.
When you want to create a classic RPG, you should have a batteries included experience.

Common tools like Tiled should be supported out of the box, and there should be a lot of examples on how to use them.

### Customizable if needed

If you want to change something, you should be able to do so. The building blocks should be easy to change or replace with your own.
This will be a tough balance to strike. Ease of use will be more important than customizability, but there should be clear ways to change things if you need to.
Obviously, parts like the rendering pipeline will be a lot harder to replace, than for example the sound engine, but you get the idea.

### TypeScript

Rust won't be possible with the direction and limitations of WASM and access to the web APIs, but TypeScript will be the main language for Pixel Forge.
So expect to have types with code completion and all the other goodies that TypeScript provides.
