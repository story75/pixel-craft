import { clamp } from '@pixel-craft/math';

export const action = (speed: number) => 10000 / speed;

export const baseDamage = (skillPower: number, scalingStat: number, extraDamage: number) =>
  skillPower * scalingStat + extraDamage;

export const criticalMultiplier = (isCritical: boolean, criticalDamage: number) =>
  isCritical ? 1 + criticalDamage : 1;

export const damageBoost = (elementalBoost: number, genericBoost: number) => 1 + elementalBoost + genericBoost;

export const defenseMultiplier = (attackerLevel: number, defense: number, penetration: number) => {
  const appliedDefense = defense * (1 - clamp(penetration, 0, 1));
  return 1 - (appliedDefense / appliedDefense + 200 + 10 * attackerLevel);
};

export const resistanceMultiplier = (resistance: number, penetration: number) =>
  1 - clamp(resistance, -2, 2) + clamp(penetration, 0, 1);

export const breakMultiplier = (toughness: number) => (toughness > 0 ? 0.8 : 1);

export const damage = (
  baseDamage: number,
  criticalMultiplier: number,
  damageBoost: number,
  defenseMultiplier: number,
  resistanceMultiplier: number,
  damageReduction: number,
  breakMultiplier: number,
) =>
  baseDamage *
  criticalMultiplier *
  damageBoost *
  defenseMultiplier *
  resistanceMultiplier *
  (1 - damageReduction) *
  breakMultiplier;
