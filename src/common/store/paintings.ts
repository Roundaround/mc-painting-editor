import {
  createEntityAdapter,
  createSelector,
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
  uuid: EntityId; // For maintaining tracking in React
  originalId?: string; // So we can track if the ID has changed
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

export const paintingsAdapter = createEntityAdapter({
  selectId: (painting: Painting) => painting.uuid,
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
const basePaintingsSelectors = paintingsAdapter.getSelectors<{
  paintings: PaintingsState;
}>((state) => state.paintings);
export const paintingsSelectors = {
  ...basePaintingsSelectors,
  selectWithWarnings: createSelector(
    [basePaintingsSelectors.selectAll, (state) => state.metadata.targetScale],
    (paintings, targetScale) => {
      return paintings.filter(
        (painting) =>
          getIssuesForPainting(painting, targetScale).filter(
            (issue) => issue.severity === 'warning'
          ).length > 0
      );
    }
  ),
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

export function getIssuesForPainting(painting: Painting, targetScale: number) {
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

  const recommendedWidth = painting.width * targetScale * 16;
  const recommendedHeight = painting.height * targetScale * 16;
  const maxWidth = painting.width * 160;
  const maxHeight = painting.height * 160;

  if (
    !!painting.path &&
    (Math.abs(painting.pixelWidth - recommendedWidth) > 0.01 ||
      Math.abs(painting.pixelHeight - recommendedHeight) > 0.01)
  ) {
    result.push({
      severity: 'warning',
      message:
        `Image is likely the wrong size ` +
        `(${painting.pixelWidth} x ${painting.pixelHeight}). ` +
        `Current targeted resolution is ${targetScale * 16} pixels per block ` +
        `(${recommendedWidth} x ${recommendedHeight}).`,
    });
  }

  if (
    !!painting.path &&
    (painting.pixelWidth > maxWidth ||
      painting.pixelHeight > painting.height * 160)
  ) {
    result.push({
      severity: 'warning',
      message:
        `Image is unnecessarily large ` +
        `(${painting.pixelWidth} x ${painting.pixelHeight}). ` +
        `Max recommended resolution is 160 pixels per block ` +
        `(${maxWidth} x ${maxHeight}).`,
    });
  }

  // Hard cap at 2k resolution, because the game can't handle larger images
  const hardMaxWidth = 2560;
  const hardMaxHeight = 2560;
  if (
    !!painting.path &&
    (painting.pixelWidth > hardMaxWidth || painting.pixelHeight > hardMaxHeight)
  ) {
    result.push({
      severity: 'error',
      message:
        `Image is too large ` +
        `(${painting.pixelWidth} x ${painting.pixelHeight}). ` +
        `Max supported resolution is 2560 x 2560.`,
    });
  }

  if (
    !!painting.path &&
    painting.pixelWidth * painting.height !==
      painting.pixelHeight * painting.width
  ) {
    result.push({
      severity: 'warning',
      message:
        'Image aspect ratio does not match painting aspect ratio. ' +
        'This may cause the painting to be stretched or squished.',
    });
  }

  return result;
}
