import { getRegion } from '@pixel-craft/grid';
import type { Rect } from '@pixel-craft/math';
import {
  State,
  fileToString,
  forcePersistValues,
  loadPersistedValues,
  persist,
  property,
  stringToFile,
} from '@pixel-craft/state';

export type PaintMode = 'auto' | 'add' | 'remove';

type Tool = { name: string; icon: string; executor: (x: number, y: number, mode: 'add' | 'remove') => void };

export class EditorState extends State {
  @property
  @persist()
  accessor tilesetFile: File | undefined;

  @property
  accessor tilesetImage = '';

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
  accessor showTilesetInspector = false;

  @property
  accessor showMapSize = false;

  @property
  accessor showSettings = false;

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
        const copy: number[][] = [];
        for (let i = 0; i < this.width; i++) {
          copy.push([]);
          for (let j = 0; j < this.height; j++) {
            copy[i].push(this.map[this.selectedLayer][i][j] ?? -1);
          }
        }

        const cells = getRegion(copy, { x, y, type: copy[x][y] });
        for (const cell of cells) {
          this.map[this.selectedLayer][cell.x][cell.y] = mode === 'add' ? this.selectedTileIndex : undefined;
        }
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

  readonly openSettings = () => {
    this.showSettings = true;
  };

  readonly closeSettings = () => {
    this.showSettings = false;
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
    let evaluatedMode: 'add' | 'remove';

    if (mode === 'auto') {
      if (!this.isMouseDown) {
        return;
      }

      evaluatedMode = this.isRightMouseDown ? 'remove' : 'add';
    } else {
      evaluatedMode = mode;
    }

    this.tools[this.selectedToolIndex].executor(x, y, evaluatedMode);
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
          newMap[i][x].push(this.map[i][x]?.[y] ?? undefined);
        }
      }
    }
    this.map = newMap;
  };

  readonly isModalOpen = () => {
    return this.showTilesetInspector || this.showMapSize;
  };

  readonly reset = () => {
    this.selectedLayer = 0;
    this.width = 25;
    this.height = 25;
    this.map = [];
    this.addLayer();
  };

  readonly save = async () => {
    if (!this.tilesetFile) {
      return;
    }

    const data = {
      width: this.width,
      height: this.height,
      map: this.map,
      palette: this.palette,
      tileSize: this.tileSize,
      margin: this.margin,
      zoom: this.zoom,
      selectedTiles: this.selectedTiles,
      tilesetFile: await fileToString(this.tilesetFile),
    };
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'level.json';
    a.click();
  };

  readonly upload = () => {
    return new Promise<void>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve();
          return;
        }

        const stringData = await file.text();
        const data = JSON.parse(stringData);
        this.width = data.width;
        this.height = data.height;
        this.map = data.map;
        this.palette = data.palette;
        this.tileSize = data.tileSize;
        this.margin = data.margin;
        this.zoom = data.zoom;
        this.selectedTiles = data.selectedTiles;
        this.tilesetFile = await stringToFile(data.tilesetFile);
        resolve();
      };
      input.click();
    });
  };
}

export const editorState = new EditorState();
(() => void loadPersistedValues(editorState))();
