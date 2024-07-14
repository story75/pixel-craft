export type Elements = 'physical' | 'fire' | 'ice' | 'lightning' | 'earth' | 'wind' | 'light' | 'dark';

export type ElementalStats = {
  damageBoost: number;
  resistance: number;
  penetration: number;
  breakEffectiveness: number;
  breakResistance: number;
};

export type StatModification = {
  source: string;
  change: number;
  turns?: number;
} & ({ stat: keyof CharacterStats } | { stat: keyof ElementalStats; element: Elements });

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
      caster: Character | undefined;
      target: Character[];
    },
  ) => void;
};

export type CharacterStats = {
  maxHp: number;
  currentHp: number;
  maxSp: number;
  currentSp: number;
  maxEnergy: number;
  currentEnergy: number;
  maxShield: number;
  currentShield: number;
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
} & { [key in Elements]: ElementalStats };

export type Character = {
  id: string;
  name: string;
  stats: CharacterStats;
  skills: Skill[];
  alligence: 'party' | 'enemy';
  lastTarget: Character | undefined;
};

export type SkillEffect = {
  id: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  element: Elements;
  power: number;
  target: 'party' | 'enemy';
  singleTarget: boolean;
  allowTargetChange: boolean;
  execute: (source: Character, targets: Character[], characters: Character[]) => void;
};

export type Skill = {
  id: string;
  spCost: number;
  energyCost: number;
  effects: SkillEffect[];
};
