import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { metadataInitialState, MetadataState } from './metadata';
import {
  areMigrationsEqual,
  migrationsInitialState,
  migrationsSelectors,
  MigrationsState,
} from './migrations';
import {
  arePaintingsEqual,
  paintingsInitialState,
  paintingsSelectors,
  PaintingsState,
} from './paintings';

export interface SavedSnapshotState {
  metadata: MetadataState;
  paintings: PaintingsState;
  migrations: MigrationsState;
}

export const savedSnapshotInitialState: SavedSnapshotState = {
  metadata: metadataInitialState,
  paintings: paintingsInitialState,
  migrations: migrationsInitialState,
};

export const savedSnapshotSlice = createSlice({
  name: 'savedSnapshot',
  initialState: savedSnapshotInitialState,
  reducers: {
    captureSnapshot(state, action: PayloadAction<SavedSnapshotState>) {
      state.metadata = action.payload.metadata;
      state.paintings = action.payload.paintings;
      state.migrations = action.payload.migrations;
    },
  },
});

export const savedSnapshotReducer = savedSnapshotSlice.reducer;
export const savedSnapshotActions = savedSnapshotSlice.actions;

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
    paintingsSelectors.selectTotal(a) === paintingsSelectors.selectTotal(b) &&
    paintingsSelectors.selectIds(a).every((id, index) => {
      if (paintingsSelectors.selectIds(b)[index] !== id) {
        return false;
      }

      const aPainting = paintingsSelectors.selectById(a, id);
      const bPainting = paintingsSelectors.selectById(b, id);
      return aPainting && bPainting && arePaintingsEqual(aPainting, bPainting);
    }) &&
    migrationsSelectors.selectTotal(a) === migrationsSelectors.selectTotal(b) &&
    migrationsSelectors.selectIds(a).every((id, index) => {
      if (migrationsSelectors.selectIds(b)[index] !== id) {
        return false;
      }

      const aMigration = migrationsSelectors.selectById(a, id);
      const bMigration = migrationsSelectors.selectById(b, id);
      return (
        aMigration && bMigration && areMigrationsEqual(aMigration, bMigration)
      );
    })
  );
}
