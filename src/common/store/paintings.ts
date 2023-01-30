import {
  createEntityAdapter,
  createSlice,
  EntityId,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';

export interface Painting {
  id: string;
  name: string;
  artist: string;
  height: number;
  width: number;
  path: string;
  pixelWidth: number;
  pixelHeight: number;
  marked: boolean;
  uuid: string; // For maintaining tracking in React
}

export const getDefaultPainting = (): Painting => ({
  id: '',
  name: '',
  artist: '',
  height: 1,
  width: 1,
  path: '',
  pixelWidth: 0,
  pixelHeight: 0,
  marked: false,
  uuid: nanoid(),
});

export const paintingsAdapter = createEntityAdapter<Painting>({
  selectId: (painting) => painting.uuid,
});

export const paintingsSlice = createSlice({
  name: 'paintings',
  initialState: paintingsAdapter.getInitialState(),
  reducers: {
    addPainting: paintingsAdapter.addOne,
    upsertPainting: paintingsAdapter.upsertOne,
    updatePainting: paintingsAdapter.updateOne,
    setPaintings: paintingsAdapter.setAll,
    removePainting: paintingsAdapter.removeOne,
    removeManyPaintings: paintingsAdapter.removeMany,
    movePaintingUp(state, action: PayloadAction<EntityId>) {
      const index = state.ids.indexOf(action.payload);
      if (index > 0) {
        const temp = state.ids[index - 1];
        state.ids[index - 1] = state.ids[index];
        state.ids[index] = temp;
      }
    },
    movePaintingDown(state, action: PayloadAction<EntityId>) {
      const index = state.ids.indexOf(action.payload);
      if (index < state.ids.length - 1) {
        const temp = state.ids[index + 1];
        state.ids[index + 1] = state.ids[index];
        state.ids[index] = temp;
      }
    },
    setPaintingMarked(
      state,
      action: PayloadAction<{ id: EntityId; marked: boolean }>
    ) {
      return paintingsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { marked: action.payload.marked },
      });
    },
    removeSelected(state) {
      return paintingsAdapter.removeMany(
        state,
        state.ids.filter((id) => {
          const painting = state.entities[id];
          return painting && painting.marked;
        })
      );
    },
    clearSelection(state) {
      return paintingsAdapter.updateMany(
        state,
        state.ids.map((id) => ({
          id,
          changes: { marked: false },
        }))
      );
    },
  },
});

export const paintingsReducer = paintingsSlice.reducer;
export const paintingsActions = paintingsSlice.actions;

export const paintingsInitialState = paintingsAdapter.getInitialState();
export const paintingsSelectors = {
  ...paintingsAdapter.getSelectors<{
    paintings: PaintingsState;
  }>((state) => state.paintings),
  selectWithWarnings: (state: { paintings: PaintingsState }) => {
    return paintingsSelectors
      .selectAll(state)
      .filter(
        (painting) =>
          getIssuesForPainting(painting).filter(
            (issue) => issue.severity === 'warning'
          ).length > 0
      );
  },
};

export type PaintingsState = ReturnType<typeof paintingsReducer>;

function removeCacheBuster(url: string) {
  return url.replace(/\?v=\d+$/, '');
}

export function arePaintingsEqual(a: Painting, b: Painting) {
  return (
    a.id === b.id &&
    a.name === b.name &&
    a.artist === b.artist &&
    a.height === b.height &&
    a.width === b.width &&
    removeCacheBuster(a.path || '') === removeCacheBuster(b.path || '')
  );
}

export interface PaintingIssue {
  severity: 'error' | 'warning';
  message: string;
}

export function getIssuesForPainting(painting: Painting) {
  const result: PaintingIssue[] = [];

  if (!painting.id) {
    result.push({
      severity: 'error',
      message: 'Missing ID',
    });
  }

  if (!painting.path) {
    result.push({
      severity: 'error',
      message: 'Missing image',
    });
  }

  if (
    !!painting.path &&
    (painting.pixelWidth < painting.width * 16 ||
      painting.pixelHeight < painting.height * 16)
  ) {
    result.push({
      severity: 'warning',
      message:
        'Image is too small. Min recommended resolution is 16 pixels per block.',
    });
  }

  if (
    !!painting.path &&
    (painting.pixelWidth > painting.width * 160 ||
      painting.pixelHeight > painting.height * 160)
  ) {
    result.push({
      severity: 'warning',
      message:
        'Image is unnecessarily large. Max recommended resolution is 160 pixels per block.',
    });
  }

  if (
    !!painting.path &&
    painting.pixelWidth * painting.height !==
      painting.pixelHeight * painting.width
  ) {
    result.push({
      severity: 'warning',
      message: 'Image aspect ratio does not match painting aspect ratio.',
    });
  }

  return result;
}
