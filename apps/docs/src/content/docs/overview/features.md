---
title: Features
description: What does it offer? What is planned?
---

## Rendering

You can render sprites and text via the provided WebGPU renderer. It uses a deferred rendering pipeline to render anything you throw at it.

The basic building block is a "Sprite" which requires a texture and position to be rendered. Sprites are automatically batched together to reduce draw calls.

Sprites write to a depth buffer and can be sorted by depth to achieve a correct rendering order, so you don't have to worry about the order in which you pass them to the renderer.

The renderer also allows you to specify the frame for the sprite to only display a specific portion of the texture. This is useful for sprite sheets and animations.

You can scale and rotate sprites, and even apply a color tint to them.

A nearest and linear sampler is available for textures, where the nearest sampler is the default and the linear sampler is used for text.

Text rendering is enabled via creating textures through Canvas2D and rendering them as sprites. This allows you to render text which doesn't change often like damage numbers.
Although it's not as efficient as a proper text rendering system, and you might be better off with stamping text into a texture atlas and rendering it as individual sprites.

You can manipulate the viewport to enable camera movement and zooming.

You can use global lighting to light up and tint your scene. You can also use point lights to light up specific areas each with their own position, color, intensity, and radius.

There are also utilities to load textures and fonts from files.

## Animation

The animation support allows you to take a sprite sheet and create animated sprites from it.
You specify the animations by providing the position inside the sprite sheet and define the number of sprites, looping, interruption behaviour and speed.
You can also define which animation to start with and how to transition between animations.

The setup is very similar to Unity's animation system, where you can define states and transitions between them.
What makes this system better is that you do not have to define additional animator variables, but can instead use the state of the actual sprite.

## CLI

The CLI is meant to streamline the process of working with applications. It currently allows you to build them, and run them.

## Collision

You can check collisions between different primitives most notably rectangles (AABBs) and circles. The functions take two primitives and return a boolean if they collide.
This can be used with other building blocks to build triggers and power physics.

## Composer

The composer allows you to define data pipelines in a type-safe way.
Define your initial state and the individual functions that transform the data. TypeScript will ensure that the functions are compatible with the data they are supposed to transform.

## Math

The math package offers functions and classes to work with different types of vectors and matrices.
It also offers types for a rectangle and a circle primitive.

## Observables

For synchronous events you can use the observable package. It allows you to subscribe to events and notify subscribers when the event occurs.
You can easily define the expected data type and the observable will ensure that the data is of the correct type.

## Physics

Physics defines a PhysicsBody type and a collide function to apply physics to two bodies.
This system expected the bodies to be colliding already and will apply the necessary forces to separate them.
It is very bare bones and does not offer any advanced physics, because this is most of the time not required for classic 2D RPGs.

## Input handling

:::caution
This system is slated to be re-written to be more flexible and offer more features.
:::

The current input system tracks the state of the WASD and arrow keys and provides an input vector for movement.

## Time

:::caution
This system is slated to be re-written to be more flexible.
:::

The timer offers delta time, so you can scale all your calculations based on the time passed since the last frame.

## Entity store

The entity store is a data type to store entities and query them by their components. The queries automatically index the entities by their components, so you can quickly access them.
They are optimized for speed and allow easy iteration over the entities, while allowing you to remove entities during iteration.

## Spatial hashing

The spatial hash grid is a data structure to index entities by their position and size.
This is required to make collisions and physics checks faster and efficient.

## Planned features

:::note
The planned features are in no particular order and are subject to change.
:::

- Tweening
- Audio
- Dialog system
- Side view battle system
- Gamepad support
- Triggers
- Save system
- Pathfinding
- Level builder
- Particle system
- Application shell
- Create project command
- Steam integrations
