import type { Slider } from './option';

export function incrementSlider(slider: Slider): void {
  slider.value = Math.min(slider.value + slider.step, slider.max);
  slider.change?.(slider);
}

export function decrementSlider(slider: Slider): void {
  slider.value = Math.max(slider.value - slider.step, slider.min);
  slider.change?.(slider);
}