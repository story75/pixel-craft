export type Option<T = string> = {
  type?: string;
  label: string;
  value?: T;
  active?: boolean;
  accept?: () => void;
  select?: () => void;
  deselect?: () => void;
};
