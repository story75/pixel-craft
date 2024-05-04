---
title: Why Pixel Craft?
description: Why does Pixel Craft exist? What problems does it solve?
---

## TL;DR:

- Tailored specifically for 2D pixel art RPGs
- built on web technologies using TypeScript and WebGPU
- easy sharing of games with others
- rapid prototyping
- code-focused
- Fun and educational for the author

## Background

:::caution
This is very subjective and may not apply to you. I'm just trying to explain why I build Pixel Craft.
This may also contain some generalizations and opinions that may not apply to everyone.

This is also not meant to slander any of the engines or tools mentioned. They are all great in their own way.
:::

I've wanted to make a game for a long time, but I've never really gotten around to it or stuck with it long enough to finish it.
One of the reasons is that I never found the right engine for me. I've tried a lot of different game engines and rendering packages,
but none of them really worked for me.

I would end up spending more time learning the engine than actually making the game, and sometimes even getting frustrated with the limitations of the engine,
or the hoops I had to jump through to get something to work.

For my last attempt, I used Pixi.js and built my own features on top of it. It was a fun learning experience, but also a lot of work.
I tinkered a lot with Unity and Godot, but kept coming back to my janky Pixi.js setup.
In the end, I was looking for something like RPG Maker, to be honest, but with more flexibility and power.

### Why not use RPG Maker?

RPG Maker is a good RPG-specific tool that is really easy to use. However, it is not a code-centric tool, and most games created with it look and feel very similar.
It's really hard to create something unique with RPG Maker, and you're limited if you want to break the mold.

On top of that, RPG Maker is closed source. There is no way to fix bugs or change the behavior of the engine if you need to.
You can write plugins, but you're still limited to what the engine provides, e.g. you'll never be able to add free-form movement to RPG Maker or place objects outside the grid.
Good luck creating some decent lighting effects in there, too.

### What about Unity, Godot, or Unreal?

Unity, Godot, and Unreal are great tools, but they are general-purpose game engines. They are not specifically designed for 2D pixel art RPGs.
You can plug in a ton of assets and plugins to make them work for you, but you have to sift through a ton of stuff before you get to what you need.

On top of that, using one of these engines comes with a ton of overhead. Especially with Unity and Unreal you have to deal with a lot of bloat and performance overhead.
Sure, that's because they both offer a lot of features, but if you don't need them, you're just wasting resources and time.

Also, trying to share a quick prototype with someone is a pain. You have to package the game, upload it somewhere, and then share the link.
If you're making a web game, you can just send someone a link and they can play it right away.

Another issue is the programming language. Unity uses C#, Godot uses GDScript, and Unreal uses C++.
You can use other languages for Godot and Unreal, but none are as well supported as the main language.
There are also alternatives like visual scripting, but that gets really messy really fast.

Personally, I prefer TypeScript and Rust, and I would prefer to write my game in those languages as well.
Building a game is a huge undertaking, and I want to use the tools I'm most comfortable with.

### What about other web -ased solutions like Pixi.js, Phaser, Babylon.js, or ThreeJS?

Okay, let's rule out ThreeJS and Babylon.js for now. They are focused on 3D rendering. You could use them for 2D games, but why not use something focused on 2D games instead?

Phaser is solid and has been around for a long time, but it is also showing its age. Many of the examples and tutorials were either broken or outdated,
and the documentation was unhelpful for similar reasons.
As of this writing, Phaser 3.80.1 is the latest version, and the examples seem to be fixed, but the site is still a mess to navigate and shows that they are working on a new version.

Pixi.js is a great rendering package, but it is not a game engine, and you need to add a lot of additional tools to make a game with it.
You need to add physics, sound, dialog systems, lighting support, and so on. There are packages for some of these things, but not for all of them.
In particular, lighting support is lacking, and I'd like to have a lighting system that's easy to use and looks good out of the box, but that's beyond the scope of Pixi.js at the moment.
Some things like z-indexing and camera movement are also a bit of a pain to get right, and the plugins do not feel good to use compared to the rest of the library.

After exploring other options, I ended up learning WebGPU. When I first started, Pixi.js was still using WebGL and didn't have a WebGPU backend.
This was a fun learning experience and gave me a lot of insight into how rendering works. It was also the spark that ignited the idea for this engine.

## How will Pixel Craft be different?

![Just like standards, frameworks proliferate the same way, I guess.](https://imgs.xkcd.com/comics/standards.png)
_Just like standards, frameworks proliferate the same way, I guess._

Pixel Craft is built on top of TypeScript and WebGPU, with modern web technologies in mind.
The goal is to be as easy to use as RPG Maker, but with the flexibility of Phaser and the speed of Pixi.js.
You as a developer should be able to create a game with building blocks or even a template project and then modify it to fit your needs.

:::caution
With all this in mind, Pixel Craft is mainly being developed by one person, and I'm working on this project in my spare time. I'm not trying to create the next big thing.
I'm just trying to create something that I would like to use myself to create games and make the development process easier.
:::
