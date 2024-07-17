import { describe, expect, it } from 'bun:test';
import { characterTemplateToCharacter } from './character';
import { action, advanceTurn } from './formulas';
import type { Battle, Character, CharacterTemplate } from './types';

describe('Battle Spec', () => {
  const setup = () => {
    const ignisrexTemplate = (alligence: Character['alligence']) =>
      ({
        id: 'player-1',
        name: 'Ignisrex',
        alligence,
        level: 100,
        evolutionStage: 'ultimate',
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
        effects: [],
        skills: ['CORE.ATTACK', 'ULTIMATE.IGNISREX'],
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
      }) satisfies CharacterTemplate;

    const characters = [
      characterTemplateToCharacter(ignisrexTemplate('party')),
      characterTemplateToCharacter(ignisrexTemplate('enemy')),
    ];

    return { characters };
  };

  it('should be possible to convert templates to characters', () => {
    const { characters } = setup();

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

  it('should be possible to advance turn', () => {
    const { characters } = setup();

    const battle = {
      characters,
      turn: 0,
    } satisfies Battle;

    battle.characters[0].id = 'character-a';
    battle.characters[0].calculated.stats.action = 200;

    battle.characters[1].id = 'character-b';
    battle.characters[1].calculated.stats.action = 100;

    advanceTurn(battle.characters);

    expect(battle.characters[0].calculated.stats.action).toBe(0);
    expect(battle.characters[0].id).toBe('character-b');

    expect(battle.characters[1].calculated.stats.action).toBe(100);
    expect(battle.characters[1].id).toBe('character-a');
  });

  it('character-b should be able to attack character-a', () => {
    const { characters } = setup();

    const battle = {
      characters,
      turn: 0,
    } satisfies Battle;

    battle.characters[0].id = 'character-a';
    battle.characters[0].calculated.stats.action = 200;

    battle.characters[1].id = 'character-b';
    battle.characters[1].calculated.stats.action = 100;

    advanceTurn(battle.characters);

    const attackSkill = battle.characters[0].skills.find((skill) => skill.id === 'CORE.ATTACK');
    if (!attackSkill) {
      throw new Error('Attack skill not found!');
    }

    attackSkill.effects[0].execute(battle.characters[0], [battle.characters[1]], battle.characters);

    expect(battle.characters[0].calculated.stats.currentHp).toBeCloseTo(3306); //should stay the same for attacker
    expect(battle.characters[1].calculated.stats.currentHp).toBeCloseTo(3064.44); //should be reduced by 241.5584415584416
  });

  it('character-a should be able to attack character-b', () => {
    const { characters } = setup();

    const battle = {
      characters,
      turn: 0,
    } satisfies Battle;

    const characterA = battle.characters[0];
    characterA.id = 'character-a';
    const characterB = battle.characters[1];
    characterB.id = 'character-b';

    characterA.calculated.stats.action = 200;
    characterB.calculated.stats.action = 100;

    advanceTurn(battle.characters);
    expect(battle.characters[0]).toBe(characterB);
    expect(battle.characters[1]).toBe(characterA);

    let attackSkill = battle.characters[0].skills.find((skill) => skill.id === 'CORE.ATTACK');
    if (!attackSkill) {
      throw new Error('Attack skill not found!');
    }

    attackSkill.effects[0].execute(battle.characters[0], [battle.characters[1]], battle.characters);

    expect(characterB.calculated.stats.currentHp).toBeCloseTo(3306); //should stay the same for attacker
    expect(characterA.calculated.stats.currentHp).toBeCloseTo(3064.44); //should be reduced by 241.5584415584416

    battle.characters[0].calculated.stats.action = 200; // normally it would be action(battle.characters[0].calculated.stats.speed);
    advanceTurn(battle.characters);

    attackSkill = battle.characters[0].skills.find((skill) => skill.id === 'CORE.ATTACK');
    if (!attackSkill) {
      throw new Error('Attack skill not found!');
    }

    attackSkill.effects[0].execute(battle.characters[0], [battle.characters[1]], battle.characters);

    expect(characterB.calculated.stats.currentHp).toBeCloseTo(3064.44); //should be reduced by 241.5584415584416
    expect(characterA.calculated.stats.currentHp).toBeCloseTo(3064.44); //should be stay the same for attacker as last turn
  });
});
