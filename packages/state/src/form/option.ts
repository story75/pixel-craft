export type Option<T = unknown> = {
  type?: string;
  label: string;
  value?: T;
  active?: boolean;
  init?: ((option: Option) => void) | (() => void);
  accept?: ((option: Option) => void) | (() => void);
  select?: ((option: Option) => void) | (() => void);
  deselect?: ((option: Option) => void) | (() => void);
};

export type Slider = Option<number> & {
  type: 'slider';
  value: number;
  min: number;
  max: number;
  step: number;
  change?: ((option: Slider) => void) | (() => void);
};

export function isSlider(option: Option): option is Slider {
  return option.type === 'slider';
}

export type OptionType<T> = T extends Option<infer OptionType> ? OptionType : never;

export type OptionList<T extends Option, O = OptionType<T>> = Option<O> & {
  type: 'option-list';
  options: T[];
  cycle?: boolean;
  change?: ((option: Option) => void) | (() => void);
};

export function isOptionList(option: Option): option is OptionList<Option> {
  return option.type === 'option-list';
}
