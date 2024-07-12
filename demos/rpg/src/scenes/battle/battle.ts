// import type { Singletons } from '../../singletons';
// import { BattleHUD } from './ui/hud';
//
// export async function battle(singletons: Singletons) {
//   const { textureLoader, canvas, root, audioMixer, inputManager, timer, translator, store, state } = singletons;
//
//   const bgm = await audioMixer.load(
//     'assets/interstellar-edm-metal-music-pack/DavidKBD - InterstellarPack - 07 - Electric Firework.ogg',
//   );
//   bgm.loop = true;
//   audioMixer.play(bgm, 'bgm');
//
//   const battleHUD = new BattleHUD();
//   battleHUD.inputManager = inputManager;
//   battleHUD.translator = translator;
//
//   root.appendChild(battleHUD);
//
//   return (now: number) => {};
// }
