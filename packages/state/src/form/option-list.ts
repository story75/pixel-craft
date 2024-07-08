import type { Option, OptionList } from './option';

export function getIndex<T extends Option>(optionList: OptionList<T>): number {
  return optionList.options.findIndex((option) => option.active);
}

export function getOption<T extends Option>(optionList: OptionList<T>): T {
  const index = getIndex(optionList);
  return optionList.options[index];
}

export function setOption<T extends Option>(optionList: OptionList<T>, option: T): void {
  const index = optionList.options.findIndex((o) => o === option);
  toggleOptions(optionList, index);
}
function toggleOptions<T extends Option>(optionList: OptionList<T>, newIndex: number): void {
  const oldIndex = getIndex(optionList);
  const oldOption = optionList.options[oldIndex];
  const newOption = optionList.options[newIndex];

  oldOption.active = false;
  oldOption.deselect?.(oldOption);
  newOption.active = true;
  newOption.select?.(newOption);
  optionList.change?.(newOption);
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
