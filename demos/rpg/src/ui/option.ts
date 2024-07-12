export type Option<T = unknown> = {
  label: string;
  value?: T;
  active?: boolean;
  select?: (option: Option<T>) => void;
  deselect?: (option: Option<T>) => void;
  accept?: (option: Option<T>) => void;
};

export type OptionList = Option & {
  type: 'option-list';
  options: Option[];
  change?: (option: Option) => void;
};

export type Slider = Option<number> & {
  type: 'slider';
  value: number;
  min: number;
  max: number;
  step: number;
  change?: (option: Slider) => void;
};

export type OptionTypes = Option | OptionList | Slider;

export function previousOption<T extends Option>(options: T[], cycle = false): void {
  const currentIndex = options.findIndex((option) => option.active);
  const nextIndex = cycle ? (currentIndex - 1 + options.length) % options.length : Math.max(0, currentIndex - 1);

  const currentOption = options[currentIndex];
  const nextOption = options[nextIndex];

  currentOption.active = false;
  currentOption.deselect?.(currentOption);

  nextOption.active = true;
  nextOption.select?.(nextOption);
}

export function nextOption<T extends Option>(options: T[], cycle = false): void {
  const currentIndex = options.findIndex((option) => option.active);
  const nextIndex = cycle ? (currentIndex + 1) % options.length : Math.min(options.length - 1, currentIndex + 1);

  const currentOption = options[currentIndex];
  const nextOption = options[nextIndex];

  currentOption.active = false;
  currentOption.deselect?.(currentOption);

  nextOption.active = true;
  nextOption.select?.(nextOption);
}

export function acceptOption<T extends Option>(options: T[]): void {
  const currentOption = options.find((option) => option.active);
  if (!currentOption) {
    return;
  }
  currentOption.accept?.(currentOption);
}

export function changeOption(optionList: OptionList): void {
  const currentOption = optionList.options.find((option) => option.active);
  if (!currentOption) {
    return;
  }
  optionList.change?.(currentOption);
}

export function getOption<T extends Option>(options: T[]): T | undefined {
  return options.find((option) => option.active);
}

export function decrementSlider(slider: Slider): void {
  slider.value = Math.max(slider.min, slider.value - slider.step);
  slider.change?.(slider);
}

export function incrementSlider(slider: Slider): void {
  slider.value = Math.min(slider.max, slider.value + slider.step);
  slider.change?.(slider);
}

export function isOptionList(option: OptionTypes): option is OptionList {
  return 'type' in option && option.type === 'option-list';
}

export function isSlider(option: OptionTypes): option is Slider {
  return 'type' in option && option.type === 'slider';
}
