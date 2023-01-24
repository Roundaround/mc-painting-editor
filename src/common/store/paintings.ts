import {
  createEntityAdapter,
  createSlice,
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
  uuid: string; // For maintinging tracking in React
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
    createPainting(state) {
      return paintingsAdapter.addOne(state, getDefaultPainting());
    },
    upsertPainting: paintingsAdapter.upsertOne,
    updatePainting: paintingsAdapter.updateOne,
    setPaintings: paintingsAdapter.setAll,
    removePainting: paintingsAdapter.removeOne,
    movePaintingUp(state, action: PayloadAction<string>) {
      const index = state.ids.indexOf(action.payload);
      if (index > 0) {
        const temp = state.ids[index - 1];
        state.ids[index - 1] = state.ids[index];
        state.ids[index] = temp;
      }
    },
    movePaintingDown(state, action: PayloadAction<string>) {
      const index = state.ids.indexOf(action.payload);
      if (index < state.ids.length - 1) {
        const temp = state.ids[index + 1];
        state.ids[index + 1] = state.ids[index];
        state.ids[index] = temp;
      }
    },
  },
});

export const paintingsReducer = paintingsSlice.reducer;
export const paintingsActions = paintingsSlice.actions;

export const paintingsInitialState = paintingsAdapter.getInitialState();
export const paintingsSelectors = paintingsAdapter.getSelectors<{
  paintings: PaintingsState;
}>((state) => state.paintings);

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
