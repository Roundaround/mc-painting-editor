import {
  createEntityAdapter,
  createSlice,
  Middleware,
  PayloadAction,
} from '@reduxjs/toolkit';
import produce from 'immer';

export interface EditorState {
  loading: boolean;
  filename: string;
}

const initialEditorState: EditorState = {
  loading: false,
  filename: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState: initialEditorState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilename: (state, action: PayloadAction<string>) => {
      state.filename = action.payload;
    },
  },
});

export interface MetadataState {
  icon: string;
  packFormat: number;
  description: string;
  id: string;
  name: string;
}

const initialMetadataState: MetadataState = {
  icon: '',
  packFormat: 9,
  description: '',
  id: '',
  name: '',
};

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: initialMetadataState,
  reducers: {
    setIcon: (state, action: PayloadAction<string>) => {
      state.icon = action.payload;
    },
    setPackFormat: (state, action: PayloadAction<number>) => {
      state.packFormat = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export interface Painting {
  id: string;
  name?: string;
  artist?: string;
  height: number;
  width: number;
  path?: string;
  uuid: string; // For maintinging tracking in React
}

const paintingsAdapter = createEntityAdapter<Painting>({
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
    movePaintingUp: (state, action: PayloadAction<string>) => {
      const index = state.ids.indexOf(action.payload);
      if (index > 0) {
        const temp = state.ids[index - 1];
        state.ids[index - 1] = state.ids[index];
        state.ids[index] = temp;
      }
    },
    movePaintingDown: (state, action: PayloadAction<string>) => {
      const index = state.ids.indexOf(action.payload);
      if (index < state.ids.length - 1) {
        const temp = state.ids[index + 1];
        state.ids[index + 1] = state.ids[index];
        state.ids[index] = temp;
      }
    },
  },
});

export const reducers = {
  editor: editorSlice.reducer,
  metadata: metadataSlice.reducer,
  paintings: paintingsSlice.reducer,
};

export const SYNC_META = 'sync';
export const LOCAL_META = 'local';
export type ActionMeta = typeof SYNC_META | typeof LOCAL_META | undefined;
export type PayloadActionWithMeta<T> = PayloadAction<T, string, ActionMeta>;

export function asSyncAction<T>(action: PayloadActionWithMeta<T>) {
  return produce(action, (draft) => {
    draft.meta = SYNC_META;
  });
}

export function asLocalAction<T>(action: PayloadActionWithMeta<T>) {
  return produce(action, (draft) => {
    draft.meta = LOCAL_META;
  });
}

export function cleanActionMeta<T>(action: PayloadActionWithMeta<T>) {
  return produce(action, (draft) => {
    draft.meta = undefined;
  });
}

export const markLocalActions: Middleware =
  () =>
  (next) =>
  <T>(action: PayloadActionWithMeta<T>) => {
    for (const reducerKey of Object.keys(reducers)) {
      if (action.type.startsWith(`${reducerKey}/`)) {
        return next(action);
      }
    }
    return next(asLocalAction(action));
  };
