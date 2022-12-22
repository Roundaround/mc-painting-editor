import {
  createEntityAdapter,
  createSlice,
  Middleware,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import produce from 'immer';

export interface EditorState {
  loading: boolean;
  filename: string;
  dirty: boolean;
}

const initialEditorState: EditorState = {
  loading: false,
  filename: '',
  dirty: false,
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
    setDirty: (state, action: PayloadAction<boolean>) => {
      state.dirty = action.payload;
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
  name: string;
  artist: string;
  height: number;
  width: number;
  path: string;
  uuid: string; // For maintinging tracking in React
}

export const getDefaultPainting = (): Painting => ({
  id: '',
  name: '',
  artist: '',
  height: 1,
  width: 1,
  path: '',
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

export interface SavedSnapshotState {
  metadata: MetadataState;
  paintings: ReturnType<typeof paintingsAdapter.getInitialState>;
}

export const initialSavedSnapshotState: SavedSnapshotState = {
  metadata: initialMetadataState,
  paintings: paintingsAdapter.getInitialState(),
};

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

export function areSavedSnapshotsEqual(
  a: SavedSnapshotState,
  b: SavedSnapshotState
) {
  return (
    a.metadata.icon === b.metadata.icon &&
    a.metadata.packFormat === b.metadata.packFormat &&
    a.metadata.description === b.metadata.description &&
    a.metadata.id === b.metadata.id &&
    a.metadata.name === b.metadata.name &&
    paintingsAdapter.getSelectors().selectTotal(a.paintings) ===
      paintingsAdapter.getSelectors().selectTotal(b.paintings) &&
    paintingsAdapter
      .getSelectors()
      .selectIds(a.paintings)
      .every((id, index) => {
        if (
          paintingsAdapter.getSelectors().selectIds(b.paintings)[index] !== id
        ) {
          return false;
        }

        const aPainting = paintingsAdapter
          .getSelectors()
          .selectById(a.paintings, id);
        const bPainting = paintingsAdapter
          .getSelectors()
          .selectById(b.paintings, id);
        return (
          aPainting && bPainting && arePaintingsEqual(aPainting, bPainting)
        );
      })
  );
}

export const savedSnapshotSlice = createSlice({
  name: 'savedSnapshot',
  initialState: initialSavedSnapshotState,
  reducers: {
    captureSnapshot(state, action: PayloadAction<SavedSnapshotState>) {
      state.metadata = action.payload.metadata;
      state.paintings = action.payload.paintings;
    },
  },
});

export const reducers = {
  [editorSlice.name]: editorSlice.reducer,
  [metadataSlice.name]: metadataSlice.reducer,
  [paintingsSlice.name]: paintingsSlice.reducer,
  [savedSnapshotSlice.name]: savedSnapshotSlice.reducer,
};

export const SYNC_META = 'sync';
export const LOCAL_META = 'local';
export type ActionMeta = typeof SYNC_META | typeof LOCAL_META | undefined;
export type PayloadActionWithMeta<T> = PayloadAction<T, string, ActionMeta>;

export function asSyncAction<T>(
  action: PayloadActionWithMeta<T> | PayloadAction<T>
) {
  return produce(action as PayloadActionWithMeta<T>, (draft) => {
    draft.meta = SYNC_META;
  });
}

export function asLocalAction<T>(
  action: PayloadActionWithMeta<T> | PayloadAction<T>
) {
  return produce(action as PayloadActionWithMeta<T>, (draft) => {
    draft.meta = LOCAL_META;
  });
}

export function cleanActionMeta<T>(
  action: PayloadActionWithMeta<T> | PayloadAction<T>
) {
  return produce(action as PayloadActionWithMeta<T>, (draft) => {
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

export const trackDirty: Middleware<
  {},
  {
    editor: EditorState;
    metadata: MetadataState;
    paintings: ReturnType<typeof paintingsAdapter.getInitialState>;
    savedSnapshot: SavedSnapshotState;
  }
> =
  ({ dispatch, getState }) =>
  (next) =>
  <P>(action: PayloadActionWithMeta<P>) => {
    if (getState().editor.loading) {
      return next(action);
    }

    if (
      !action.type.startsWith(metadataSlice.name) &&
      !action.type.startsWith(paintingsSlice.name) &&
      !action.type.startsWith(savedSnapshotSlice.name)
    ) {
      return next(action);
    }

    setTimeout(() => {
      const state = getState();
      const savedSnapshot = state.savedSnapshot;
      const newSnapshot: SavedSnapshotState = {
        metadata: state.metadata,
        paintings: state.paintings,
      };

      dispatch(
        asLocalAction(
          editorSlice.actions.setDirty(
            !areSavedSnapshotsEqual(savedSnapshot, newSnapshot)
          )
        )
      );
    });

    return next(action);
  };
