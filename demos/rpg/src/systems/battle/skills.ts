import type { Skill } from './types';

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
        execute: (source, targets, characters) => {
          for (const target of targets) {
            // deal damage to target
          }
        },
      },
    ],
  },
];

export const skillMap = Object.groupBy(skills, (skill) => skill.id);
