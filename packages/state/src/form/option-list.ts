import { Option, OptionList } from './option';

export function getIndex<T extends Option>(optionList: OptionList<T>): number {
  return optionList.options.findIndex((option) => option.active);
}

export function getOption<T extends Option>(optionList: OptionList<T>): T {
  const index = getIndex(optionList);
  return optionList.options[index];
}

function toggleOptions<T extends Option>(optionList: OptionList<T>, newIndex: number): void {
  const oldIndex = getIndex(optionList);
  optionList.options[oldIndex].active = false;
  optionList.options[oldIndex].deselect?.();
  optionList.options[newIndex].active = true;
  optionList.options[newIndex].select?.();
  optionList.change?.();
}

export function nextOption<T extends Option>(optionList: OptionList<T>): void {
  let newIndex: number;
  const currentIndex = getIndex(optionList);

  if (optionList.cycle) {
    newIndex = (currentIndex + 1) % optionList.options.length;
  } else {
    newIndex = Math.min(currentIndex + 1, optionList.options.length - 1);
  }

  toggleOptions(optionList, newIndex);
}

export function previousOption<T extends Option>(optionList: OptionList<T>): void {
  let newIndex: number;
  const currentIndex = getIndex(optionList);

  if (optionList.cycle) {
    newIndex = (currentIndex - 1 + optionList.options.length) % optionList.options.length;
  } else {
    newIndex = Math.max(currentIndex - 1, 0);
  }

  toggleOptions(optionList, newIndex);
}
