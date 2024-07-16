import * as formulas from './formulas';
import type { Character, Skill, SkillEffect } from './types';

const damageEffect = (skillEffect: SkillEffect, source: Character, targets: Character[]): void => {
  const baseDamage = formulas.baseDamage(skillEffect.power, source.calculated.stats[skillEffect.stat], 0);

  for (const target of targets) {
    const isCritical = Math.random() < source.calculated.stats.criticalChance;
    const criticalMultiplier = formulas.criticalMultiplier(isCritical, source.calculated.stats.criticalDamage);
    const damageBoost = formulas.damageBoost(
      source.calculated.elementalStats[skillEffect.element].damageBoost,
      source.calculated.stats.damageBoost,
    );
    const defenseMultiplier = formulas.defenseMultiplier(
      source.level,
      target.calculated.stats.defense,
      skillEffect.defensePenetration,
    );
    const resistanceMultiplier = formulas.resistanceMultiplier(
      target.calculated.elementalStats[skillEffect.element].resistance,
      source.calculated.elementalStats[skillEffect.element].penetration,
    );
    const breakMultiplier = formulas.breakMultiplier(target.calculated.stats.toughness);
    const damage = formulas.damage(
      baseDamage,
      criticalMultiplier,
      damageBoost,
      defenseMultiplier,
      resistanceMultiplier,
      source.calculated.stats.damageReduction,
      breakMultiplier,
    );

    target.calculated.stats.currentHp -= damage;
  }
};

const skills: Skill[] = [
  {
    id: 'CORE.ATTACK',
    spCost: 0,
    energyCost: 0,
    effects: [
      {
        id: 'CORE.ATTACK.DAMAGE',
        type: 'damage',
        element: 'physical',
        power: 0.25,
        stat: 'attack',
        target: 'enemy',
        singleTarget: true,
        allowTargetChange: true,
        defensePenetration: 0,
        execute: function (source, targets) {
          damageEffect(this, source, targets);
        },
      },
    ],
  },
  {
    id: 'ULTIMATE.IGNISREX',
    spCost: 0,
    energyCost: 40,
    effects: [
      {
        id: 'ULTIMATE.IGNISREX.DAMAGE',
        type: 'damage',
        element: 'fire',
        power: 2,
        stat: 'attack',
        target: 'enemy',
        singleTarget: false,
        allowTargetChange: false,
        defensePenetration: 1,
        execute: function (source, targets) {
          damageEffect(this, source, targets);
        },
      },
    ],
  },
];

export const skillMap = skills.reduce(
  (map, skill) => {
    map[skill.id] = skill;
    return map;
  },
  {} as Partial<Record<string, Skill>>,
);
