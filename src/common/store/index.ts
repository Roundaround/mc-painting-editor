import { Middleware, PayloadAction } from '@reduxjs/toolkit';
import produce from 'immer';
import { editorReducer, editorSlice, EditorState } from './editor';
import { metadataReducer, metadataSlice, MetadataState } from './metadata';
import {
  migrationsReducer,
  migrationsSlice,
  MigrationsState,
} from './migrations';
import { paintingsReducer, paintingsSlice, PaintingsState } from './paintings';
import {
  areSavedSnapshotsEqual,
  savedSnapshotReducer,
  savedSnapshotSlice,
  SavedSnapshotState,
} from './savedSnapshot';

export const reducers = {
  [editorSlice.name]: editorReducer,
  [metadataSlice.name]: metadataReducer,
  [paintingsSlice.name]: paintingsReducer,
  [migrationsSlice.name]: migrationsReducer,
  [savedSnapshotSlice.name]: savedSnapshotReducer,
};

export type RootState = {
  [key in keyof typeof reducers]: ReturnType<typeof reducers[key]>;
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

function isSyncAction<T>(action: PayloadActionWithMeta<T>) {
  return action.meta === SYNC_META;
}

function isLocalAction<T>(action: PayloadActionWithMeta<T>) {
  return (
    action.meta === LOCAL_META ||
    !Object.keys(reducers).some((key) => action.type.startsWith(`${key}/`))
  );
}

export const syncWithExternal =
  (syncFn: (action: PayloadActionWithMeta<any>) => void): Middleware =>
  () =>
  (next) =>
  <T>(action: PayloadActionWithMeta<T>) => {
    if (!isSyncAction(action) && !isLocalAction(action)) {
      syncFn(asSyncAction(action));
    }

    next(cleanActionMeta(action));
  };

export const trackDirty: Middleware<
  {},
  {
    editor: EditorState;
    metadata: MetadataState;
    paintings: PaintingsState;
    migrations: MigrationsState;
    savedSnapshot: SavedSnapshotState;
  }
> =
  ({ dispatch, getState }) =>
  (next) =>
  <P>(action: PayloadActionWithMeta<P>) => {
    if (isSyncAction(action)) {
      return next(action);
    }

    if (getState().editor.overlay) {
      return next(action);
    }

    if (
      !action.type.startsWith(metadataSlice.name) &&
      !action.type.startsWith(paintingsSlice.name) &&
      !action.type.startsWith(migrationsSlice.name) &&
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
        migrations: state.migrations,
      };

      const wasDirty = state.editor.dirty;
      const isDirty = !areSavedSnapshotsEqual(savedSnapshot, newSnapshot);

      if (wasDirty === isDirty) {
        return;
      }

      dispatch(editorSlice.actions.setDirty(isDirty));
    });

    return next(action);
  };
