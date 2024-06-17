import { State, loadPersistedValues, persist, property } from '@pixel-craft/state';

export class GeneratorState extends State {
  @property
  @persist()
  accessor seed = 'dungeon-generator';

  @property
  @persist()
  accessor width = 100;

  @property
  @persist()
  accessor height = 55;

  @property
  @persist()
  accessor smoothIterations = 5;

  @property
  @persist()
  accessor cullSize = 10;
}

export const generatorState = new GeneratorState();
(() => void loadPersistedValues(generatorState))();
