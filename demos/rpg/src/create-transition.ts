import type { Root } from './ui/components/root';
import { Transition } from './ui/components/transition';

export function createTransition(root: Root, onTransitionEnd: () => void): () => void {
  const transition = new Transition();
  transition.addEventListener('transitionend', onTransitionEnd);
  root.appendChild(transition);

  return () => {
    root.removeChild(transition);
  };
}
