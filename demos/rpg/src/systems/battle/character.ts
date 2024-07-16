import { action } from './formulas';
import { skillMap } from './skills';
import type {
  Character,
  CharacterStats,
  CharacterTemplate,
  ElementModification,
  ElementalStats,
  Elements,
  StatModification,
} from './types';

export const applyStatModifications = (character: Character) => {
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

export const applyElementModifications = (character: Character) => {
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

export const characterTemplateToCharacter = (template: CharacterTemplate): Character => {
  const character: Character = {
    id: template.id,
    name: template.name,
    level: template.level,
    evolutionStage: template.evolutionStage,
    inital: {
      stats: template.stats,
      elementalStats: template.elementalStats,
    },
    calculated: {
      stats: JSON.parse(JSON.stringify(template.stats)),
      elementalStats: JSON.parse(JSON.stringify(template.elementalStats)),
    },
    skills: template.skills.map((id) => skillMap[id]).filter((s) => !!s),
    alligence: 'party',
    statModifications: template.statModifications,
    elementModifications: template.elementModifications,
    effects: [], // TODO: Implement effects
  };

  applyStatModifications(character);
  applyElementModifications(character);

  character.calculated.stats.action = action(character.calculated.stats.speed);
  character.calculated.stats.currentHp = character.calculated.stats.maxHp;
  character.calculated.stats.currentSp = character.calculated.stats.maxSp;
  character.calculated.stats.currentEnergy = 0;

  return character;
};
