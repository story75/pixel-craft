import { Rect } from '@pixel-craft/math';
import { State, forcePersistValues, loadPersistedValues, persist, property } from '@pixel-craft/state';

export type PaintMode = 'auto' | 'add' | 'remove';

type Tool = { name: string; icon: string; executor: (x: number, y: number, mode: 'add' | 'remove') => void };

export class EditorState extends State {
  @property
  @persist()
  accessor tilesetFile: File | undefined;

  @property
  accessor tilesetImage: string = '';

  @property
  @persist()
  accessor tileSize = 32;

  @property
  @persist()
  accessor margin = 0;

  @property
  @persist()
  accessor zoom = 1;

  @property
  @persist()
  accessor selectedTiles: string[] = [];

  @property
  @persist()
  accessor palette: Rect[] = [];

  @property
  @persist()
  accessor selectedTileIndex = 0;

  @property
  @persist()
  accessor selectedToolIndex = 0;

  @property
  @persist()
  accessor selectedLayer = 0;

  @property
  @persist()
  accessor width = 25;

  @property
  @persist()
  accessor height = 25;

  @property
  @persist()
  accessor map: (number | undefined | null)[][][] = [];

  @property
  @persist()
  accessor showGrid = false;

  @property
  @persist()
  accessor showPalette = false;

  @property
  @persist()
  accessor showTools = false;

  @property
  @persist()
  accessor showTilesetInspector = false;

  @property
  @persist()
  accessor showMapSize = false;

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
    window.addEventListener('beforeunload', () => {
      forcePersistValues(this);
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

  readonly tools: Tool[] = [
    {
      name: 'Brush',
      icon: '',
      executor: (x, y, mode) => {
        this.map[this.selectedLayer][x][y] = mode === 'add' ? this.selectedTileIndex : undefined;
      },
    },
    {
      name: 'Bucket-Fill',
      icon: '',
      executor: (x, y, mode) => {
        // TODO: implement me; flood fill from x,y
        this.map[this.selectedLayer][x][y] = mode === 'add' ? this.selectedTileIndex : undefined;
      },
    },
  ];

  readonly openTilesetInspector = () => {
    this.showTilesetInspector = true;
  };

  readonly closeTilesetInspector = () => {
    this.showTilesetInspector = false;

    if (this.palette.length !== 0) {
      if (this.map.length === 0) {
        this.addLayer();
      }
      this.showPalette = true;
      this.showTools = true;
      this.showGrid = true;
    }
  };

  readonly openMapSize = () => {
    this.showMapSize = true;
  };

  readonly closeMapSize = () => {
    this.showMapSize = false;
  };

  readonly toggleGrid = () => {
    this.showGrid = !this.showGrid;
  };

  readonly togglePalette = () => {
    this.showPalette = !this.showPalette;
  };

  readonly toggleTools = () => {
    this.showTools = !this.showTools;
  };

  readonly setActiveLayer = (layer: number) => {
    this.selectedLayer = layer;
  };

  readonly addLayer = () => {
    const layer: (number | undefined)[][] = [];
    for (let x = 0; x < this.width; x++) {
      layer.push([]);
      for (let y = 0; y < this.height; y++) {
        layer[x].push(undefined);
      }
    }
    this.map.push(layer);
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

  readonly selectTool = (i: number) => {
    this.selectedToolIndex = i;
  };

  readonly paintTile = (x: number, y: number, mode: PaintMode = 'auto') => {
    if (mode === 'auto') {
      if (!this.isMouseDown) {
        return;
      }

      mode = this.isRightMouseDown ? 'remove' : 'add';
    }

    this.tools[this.selectedToolIndex].executor(x, y, mode);
  };

  readonly resizeMap = (width: number, height: number) => {
    this.width = width;
    this.height = height;

    const layers = this.map.length;
    const newMap: (number | undefined)[][][] = [];
    for (let i = 0; i < layers; i++) {
      newMap.push([]);
      for (let x = 0; x < width; x++) {
        newMap[i].push([]);
        for (let y = 0; y < height; y++) {
          newMap[i][x].push(this.map[i][x][y] ?? undefined);
        }
      }
    }
    this.map = newMap;
  };

  readonly isModalOpen = () => {
    return this.showTilesetInspector || this.showMapSize;
  };
}

export const editorState = new EditorState();
(() => void loadPersistedValues(editorState))();
