export type Elements = 'physical' | 'fire' | 'ice' | 'lightning' | 'earth' | 'wind' | 'light' | 'dark';

export type ElementalStats = {
  [key in Elements]: {
    damageBoost: number;
    resistance: number;
    penetration: number;
  };
};

export type StatModification = {
  source: string;
  stat: keyof CharacterStats;
  change: number;
  turns?: number;
};

export type CharacterEffect = {
  id: string;
  source: string;
  turns?: number;
  execute: (source: CharacterStats) => void;
};

export type CharacterStats = {
  maxHp: number;
  currentHp: number;
  maxSp: number;
  currentSp: number;
  attack: number;
  defense: number;
  speed: number;
  action: number;
  toughness: number;
  criticalChance: number;
  criticalDamage: number;
  breakEffectiveness: number;
  breakResistance: number;
  healingBoost: number;
  effectHitChance: number;
  effectResistance: number;
  statModifications: StatModification[];
  effects: CharacterEffect[];
} & ElementalStats;

export type SkillEffect = {
  id: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  element: Elements;
  power: number;
  target: 'party' | 'enemy';
  singleTarget: boolean;
  allowTargetChange: boolean;
  execute: (source: CharacterStats, targets: CharacterStats[]) => void;
};

export type Skill = {
  id: string;
  spCost: number;
  effects: SkillEffect[];
};
