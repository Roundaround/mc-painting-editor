import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  filename: string;
  dirty: boolean;
  overlay: false | 'loading' | 'splitting';
  split: {
    id: string;
    name: string;
  };
}

export const editorInitialState: EditorState = {
  filename: '',
  dirty: false,
  overlay: false,
  split: {
    id: '',
    name: '',
  },
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorInitialState,
  reducers: {
    setFilename: (state, action: PayloadAction<string>) => {
      state.filename = action.payload;
    },
    setDirty: (state, action: PayloadAction<boolean>) => {
      state.dirty = action.payload;
    },
    clearOverlay: (state) => {
      state.overlay = false;
    },
    setLoading: (state) => {
      state.overlay = 'loading';
    },
    setSplitting: (state) => {
      state.overlay = 'splitting';
      state.split = {
        id: '',
        name: '',
      };
    },
    setSplitId: (state, action: PayloadAction<string>) => {
      state.split.id = action.payload;
    },
    setSplitName: (state, action: PayloadAction<string>) => {
      state.split.name = action.payload;
    },
  },
});

export const editorReducer = editorSlice.reducer;
export const editorActions = editorSlice.actions;
