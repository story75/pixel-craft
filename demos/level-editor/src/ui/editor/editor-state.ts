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
  accessor palette: Rect[] = [];

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
  accessor showGrid = false;

  @property
  @store()
  accessor showPalette = false;

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

    const updateImage = () => {
      if (this.tilesetImage) {
        URL.revokeObjectURL(this.tilesetImage);
      }
      this.tilesetImage = this.tilesetFile ? URL.createObjectURL(this.tilesetFile) : '';
    };

    this.addEventListener('change', (event) => {
      if (event.detail.property === 'tilesetFile') {
        updateImage();
      }
    });

    updateImage();
  }

  readonly openTilesetInspector = () => {
    this.showTilesetInspector = true;
  };

  readonly closeTilesetInspector = () => {
    this.showTilesetInspector = false;

    if (this.palette.length !== 0) {
      if (this.map.length === 0) {
        this.map = [[...new Array(this.width)].map(() => [...new Array(this.height)])];
      }
      this.showPalette = true;
      this.showGrid = true;
    }
  };

  readonly toggleGrid = () => {
    this.showGrid = !this.showGrid;
  };

  readonly togglePalette = () => {
    this.showPalette = !this.showPalette;
  };

  readonly setActiveLayer = (layer: number) => {
    this.selectedLayer = layer;
  };

  readonly addLayer = () => {
    this.map.push([...new Array(this.width)].map(() => [...new Array(this.height)]));
  };

  readonly removeLayer = () => {
    if (this.map.length === 1) {
      return;
    }

    this.map.pop();
  };

  readonly selectTile = (i: number) => {
    this.selectedTileIndex = i;
  };

  readonly paintTile = (x: number, y: number, mode: 'auto' | 'add' | 'remove' = 'auto') => {
    if (mode === 'auto') {
      if (!this.isMouseDown) {
        return;
      }

      mode = this.isRightMouseDown ? 'remove' : 'add';
    }

    this.map[this.selectedLayer][x][y] = mode === 'add' ? this.selectedTileIndex : undefined;
  };
}

export const editorState = new EditorState();
