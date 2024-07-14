import { describe, expect, it } from 'bun:test';
import type {
  Character,
  CharacterStats,
  ElementModification,
  ElementalStats,
  Elements,
  Skill,
  StatModification,
} from './types';

describe('Battle Spec', () => {
  const attack = {
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
  } satisfies Skill;

  const ignisrex = (alligence: Character['alligence']) =>
    ({
      id: 'player-1',
      name: 'Ignisrex',
      alligence,
      level: 100,
      evolutionStage: 'ultimate',
      inital: {
        stats: {
          maxHp: 1873,
          currentHp: 1873,
          maxSp: 254,
          currentSp: 254,
          maxEnergy: 40,
          currentEnergy: 0,
          shield: 0,
          attack: 1053,
          defense: 1173,
          taunt: 125,
          speed: 104,
          action: 100,
          stun: 0,
          toughness: 150,
          criticalChance: 0.195,
          criticalDamage: 1.551,
          breakEffectiveness: 2.094,
          breakResistance: 0,
          healingBoost: 0,
          damageBoost: 0,
          damageReduction: 0,
          effectHitChance: 0,
          effectResistance: 0.18,
        },
        elementalStats: {
          physical: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          fire: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          ice: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          lightning: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          earth: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          wind: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          light: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          dark: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
        },
      },
      calculated: {
        stats: {
          maxHp: 1873,
          currentHp: 1873,
          maxSp: 254,
          currentSp: 254,
          maxEnergy: 40,
          currentEnergy: 0,
          shield: 0,
          attack: 1053,
          defense: 1173,
          taunt: 125,
          speed: 104,
          action: 100,
          stun: 0,
          toughness: 150,
          criticalChance: 0.195,
          criticalDamage: 1.551,
          breakEffectiveness: 2.094,
          breakResistance: 0,
          healingBoost: 0,
          damageBoost: 0,
          damageReduction: 0,
          effectHitChance: 0,
          effectResistance: 0.18,
        },
        elementalStats: {
          physical: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          fire: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          ice: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          lightning: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          earth: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          wind: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          light: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
          dark: {
            damageBoost: 0,
            resistance: 0,
            penetration: 0,
            breakEffectiveness: 0,
            breakResistance: 0,
          },
        },
      },
      effects: [],
      skills: [
        attack,
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
              execute: (source, targets, characters) => {
                for (const target of targets) {
                  // deal damage to target
                }
              },
            },
          ],
        },
      ],
      statModifications: [
        {
          source: 'plugins',
          stat: 'maxHp',
          type: 'add',
          change: 1433,
        },
        {
          source: 'plugins',
          stat: 'attack',
          type: 'add',
          change: 1427,
        },
        {
          source: 'plugins',
          stat: 'defense',
          type: 'add',
          change: 91,
        },
        {
          source: 'plugins',
          stat: 'speed',
          type: 'add',
          change: 51,
        },
      ],
      elementModifications: [],
    }) satisfies Character;

  const characters = [ignisrex('party'), ignisrex('enemy')] satisfies Character[];

  it('should be able to start a battle', () => {
    const applyStatModifications = (character: Character) => {
      const groupedByType = Object.groupBy(character.statModifications, (modification) => modification.type);
      const increase = groupedByType.increase || [];
      const add = groupedByType.add || [];
      const multiply = groupedByType.multiply || [];

      const increaseGroupedByStat = Object.groupBy(increase, (modification) => modification.stat);
      const stats = Object.entries(increaseGroupedByStat) as [keyof CharacterStats, StatModification[]][];

      for (const [stat, modifications] of stats) {
        const increases = modifications.reduce((total, modification) => total + modification.change, 1);
        character.calculated.stats[stat] *= increases;
      }

      for (const modification of add) {
        character.calculated.stats[modification.stat] += modification.change;
      }

      for (const modification of multiply) {
        character.calculated.stats[modification.stat] *= 1 + modification.change;
      }
    };

    const applyElementModifications = (character: Character) => {
      const groupedByElement = Object.groupBy(character.elementModifications, (modification) => modification.element);
      const elements = Object.entries(groupedByElement) as [Elements, ElementModification[]][];

      for (const [element, modifications] of elements) {
        const groupedByType = Object.groupBy(modifications, (modification) => modification.type);
        const increase = groupedByType.increase || [];
        const add = groupedByType.add || [];
        const multiply = groupedByType.multiply || [];

        const increaseGroupedByStat = Object.groupBy(increase, (modification) => modification.stat);
        const stats = Object.entries(increaseGroupedByStat) as [keyof ElementalStats, ElementModification[]][];

        for (const [stat, modifications] of stats) {
          const increases = modifications.reduce((total, modification) => total + modification.change, 1);
          character.calculated.elementalStats[element][stat] *= increases;
        }

        for (const modification of add) {
          character.calculated.elementalStats[element][modification.stat] += modification.change;
        }

        for (const modification of multiply) {
          character.calculated.elementalStats[element][modification.stat] *= 1 + modification.change;
        }
      }
    };

    const action = (speed: number) => 10000 / speed;

    for (const character of characters) {
      character.calculated.stats = JSON.parse(JSON.stringify(character.inital.stats));
      character.calculated.elementalStats = JSON.parse(JSON.stringify(character.inital.elementalStats));
      applyStatModifications(character);
      applyElementModifications(character);

      character.calculated.stats.action = action(character.calculated.stats.speed);
      character.calculated.stats.currentHp = character.calculated.stats.maxHp;
      character.calculated.stats.currentSp = character.calculated.stats.maxSp;
      character.calculated.stats.currentEnergy = 0;
    }

    expect(characters[0].calculated.stats).not.toBe(characters[0].inital.stats);
    expect(characters[0].calculated.stats).toEqual({
      maxHp: 3306,
      currentHp: 3306,
      maxSp: 254,
      currentSp: 254,
      maxEnergy: 40,
      currentEnergy: 0,
      shield: 0,
      attack: 2480,
      defense: 1264,
      taunt: 125,
      speed: 155,
      action: expect.closeTo(64.516),
      stun: 0,
      toughness: 150,
      criticalChance: 0.195,
      criticalDamage: 1.551,
      breakEffectiveness: 2.094,
      breakResistance: 0,
      healingBoost: 0,
      damageBoost: 0,
      damageReduction: 0,
      effectHitChance: 0,
      effectResistance: 0.18,
    });
    expect(characters[0].calculated.elementalStats).not.toBe(characters[0].inital.elementalStats);
    expect(characters[0].calculated.elementalStats).toEqual({
      physical: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      fire: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      ice: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      lightning: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      earth: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      wind: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      light: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      dark: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
    });

    expect(characters[1].calculated.stats).not.toBe(characters[1].inital.stats);
    expect(characters[1].calculated.stats).toEqual({
      maxHp: 3306,
      currentHp: 3306,
      maxSp: 254,
      currentSp: 254,
      maxEnergy: 40,
      currentEnergy: 0,
      shield: 0,
      attack: 2480,
      defense: 1264,
      taunt: 125,
      speed: 155,
      action: expect.closeTo(64.516),
      stun: 0,
      toughness: 150,
      criticalChance: 0.195,
      criticalDamage: 1.551,
      breakEffectiveness: 2.094,
      breakResistance: 0,
      healingBoost: 0,
      damageBoost: 0,
      damageReduction: 0,
      effectHitChance: 0,
      effectResistance: 0.18,
    });
    expect(characters[1].calculated.elementalStats).not.toBe(characters[1].inital.elementalStats);
    expect(characters[1].calculated.elementalStats).toEqual({
      physical: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      fire: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      ice: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      lightning: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      earth: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      wind: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      light: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
      dark: {
        damageBoost: 0,
        resistance: 0,
        penetration: 0,
        breakEffectiveness: 0,
        breakResistance: 0,
      },
    });
  });
});
