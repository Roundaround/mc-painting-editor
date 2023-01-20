import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { metadataInitialState, MetadataState } from './metadata';
import {
  arePaintingsEqual,
  paintingsInitialState,
  paintingsSelectors,
  PaintingsState,
} from './paintings';

export interface SavedSnapshotState {
  metadata: MetadataState;
  paintings: PaintingsState;
}

export const savedSnapshotInitialState: SavedSnapshotState = {
  metadata: metadataInitialState,
  paintings: paintingsInitialState,
};

export const savedSnapshotSlice = createSlice({
  name: 'savedSnapshot',
  initialState: savedSnapshotInitialState,
  reducers: {
    captureSnapshot(state, action: PayloadAction<SavedSnapshotState>) {
      state.metadata = action.payload.metadata;
      state.paintings = action.payload.paintings;
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
    paintingsSelectors.selectTotal(a.paintings) ===
      paintingsSelectors.selectTotal(b.paintings) &&
    paintingsSelectors.selectIds(a.paintings).every((id, index) => {
      if (paintingsSelectors.selectIds(b.paintings)[index] !== id) {
        return false;
      }

      const aPainting = paintingsSelectors.selectById(a.paintings, id);
      const bPainting = paintingsSelectors.selectById(b.paintings, id);
      return aPainting && bPainting && arePaintingsEqual(aPainting, bPainting);
    })
  );
}
