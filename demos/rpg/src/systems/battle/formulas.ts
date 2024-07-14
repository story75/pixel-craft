import { clamp } from '@pixel-craft/math';

const action = (speed: number) => 10000 / speed;

const baseDamage = (power: number, stat: number, extraDamage: number) => power * stat + extraDamage;

const criticalMultiplier = (isCritical: boolean, criticalDamage: number) => (isCritical ? 1 + criticalDamage : 1);

const damageBoost = (elementalBoost: number, genericBoost: number) => 1 + elementalBoost + genericBoost;

const defenseMultiplier = (attackerLevel: number, defense: number, penetration: number) => {
  const appliedDefense = defense * (1 - clamp(penetration, 0, 1));
  return 1 - (appliedDefense / appliedDefense + 200 + 10 * attackerLevel);
};

const resistanceMultiplier = (resistance: number, penetration: number) =>
  1 - clamp(resistance, -2, 2) + clamp(penetration, 0, 1);

const breakMultiplier = (toughness: number) => (toughness > 0 ? 0.8 : 1);

const damage = (
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
  damageReduction *
  breakMultiplier;
