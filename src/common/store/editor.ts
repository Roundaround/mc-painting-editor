import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  loading: boolean;
  filename: string;
  dirty: boolean;
}

export const editorInitialState: EditorState = {
  loading: false,
  filename: '',
  dirty: false,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorInitialState,
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

export const editorReducer = editorSlice.reducer;
export const editorActions = editorSlice.actions;
