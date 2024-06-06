import { Rect } from '@pixel-craft/math';
import { property, State } from '@pixel-craft/state';
import { store } from '../../decorators/store';

export class EditorState extends State {
  @property
  @store()
  accessor tilesetFile: File | undefined;

  @property
  accessor tilesetImage: string = '';

  @property
  @store()
  accessor tileSize = 32;

  @property
  @store()
  accessor margin = 0;

  @property
  @store()
  accessor zoom = 1;

  @property
  @store()
  accessor selectedTiles: string[] = [];

  @property
  @store()
  accessor spriteFrames: Rect[] = [];

  @property
  @store()
  accessor selectedTileIndex = 0;

  @property
  @store()
  accessor selectedLayer = 0;

  @property
  @store()
  accessor width = 25;

  @property
  @store()
  accessor height = 25;

  @property
  @store()
  // eslint-disable-next-line @typescript-eslint/array-type
  accessor map: (number | undefined)[][][] = [];

  @property
  @store()
  accessor showGrid = true;

  @property
  @store()
  accessor showPalette = true;

  @property
  @store()
  accessor showTilesetInspector = false;

  accessor isRightMouseDown = false;
  accessor isMouseDown = false;

  constructor() {
    super();

    document.addEventListener('contextmenu', (event) => {
      this.isRightMouseDown = true;
      event.preventDefault();
      return false;
    });
    document.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
    document.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.isRightMouseDown = false;
    });

    this.addEventListener('change', (event) => {
      if (event.detail.property === 'tilesetFile') {
        if (this.tilesetImage) {
          URL.revokeObjectURL(this.tilesetImage);
        }
        this.tilesetImage = this.tilesetFile ? URL.createObjectURL(this.tilesetFile) : '';
      }
    });

    if (this.map.length === 0) {
      this.map = [[...new Array(this.width)].map(() => [...new Array(this.height)])];
    }
  }
}

export const editorState = new EditorState();
