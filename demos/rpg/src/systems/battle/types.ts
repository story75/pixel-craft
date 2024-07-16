export type Elements = 'physical' | 'fire' | 'ice' | 'lightning' | 'earth' | 'wind' | 'light' | 'dark';

export type ElementalStats = {
  damageBoost: number;
  resistance: number;
  penetration: number;
  breakEffectiveness: number;
  breakResistance: number;
};

type Modification = {
  source: string;
  type: 'add' | 'increase' | 'multiply';
  change: number;
  turns?: number;
};

export type StatModification = Modification & {
  stat: keyof CharacterStats;
};

export type ElementModification = Modification & {
  stat: keyof ElementalStats;
  element: Elements;
};

export type EffectTrigger =
  | 'startOfTurn'
  | 'endOfTurn'
  | 'startOfBattle'
  | 'endOfBattle'
  | 'onAttack'
  | 'onDamage'
  | 'onHeal'
  | 'onShield'
  | 'onCritical'
  | 'onBreak'
  | 'onDeath';

export type CharacterEffect = {
  id: string;
  source: string;
  turns?: number;
  trigger: EffectTrigger;
  execute: (
    source: Character,
    characters: Character[],
    trigger: {
      trigger: EffectTrigger;
    } & ({ source?: undefined } | { source: Character; target: Character[]; skillEffect: SkillEffect }),
  ) => void;
};

export type CharacterStats = {
  maxHp: number;
  currentHp: number;
  maxSp: number;
  currentSp: number;
  maxEnergy: number;
  currentEnergy: number;
  shield: number;
  taunt: number;
  attack: number;
  defense: number;
  speed: number;
  action: number;
  stun: number;
  toughness: number;
  criticalChance: number;
  criticalDamage: number;
  breakEffectiveness: number;
  breakResistance: number;
  damageBoost: number;
  damageReduction: number;
  healingBoost: number;
  effectHitChance: number;
  effectResistance: number;
};

export type EvolutionStage = 'baby' | 'novice' | 'champion' | 'master' | 'ultimate';

export type Character = {
  id: string;
  name: string;
  level: number;
  evolutionStage: EvolutionStage;
  inital: {
    stats: CharacterStats;
    elementalStats: {
      [element in Elements]: ElementalStats;
    };
  };
  calculated: {
    stats: CharacterStats;
    elementalStats: {
      [element in Elements]: ElementalStats;
    };
  };
  skills: Skill[];
  alligence: 'party' | 'enemy';
  lastTarget?: Character;
  statModifications: StatModification[];
  elementModifications: ElementModification[];
  effects: CharacterEffect[];
};

export type SkillEffect = {
  id: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  element: Elements;
  power: number;
  stat: keyof CharacterStats;
  target: 'party' | 'enemy';
  singleTarget: boolean;
  allowTargetChange: boolean;
  defensePenetration: number;
  execute: (source: Character, targets: Character[], characters: Character[]) => void;
};

export type Skill = {
  id: string;
  spCost: number;
  energyCost: number;
  effects: SkillEffect[];
};

export type Battle = {
  characters: Character[];
  turn: number;
};

export type CharacterTemplate = Pick<
  Character,
  'id' | 'name' | 'alligence' | 'level' | 'evolutionStage' | 'statModifications' | 'elementModifications'
> & {
  stats: CharacterStats;
  elementalStats: {
    [element in Elements]: ElementalStats;
  };
  skills: string[];
  effects: string[];
};
