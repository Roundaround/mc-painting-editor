import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  appInfo: {
    name: string;
    version: string;
  };
  filename: string;
  dirty: boolean;
  overlay: false | 'loading' | 'splitting' | 'about';
  split: {
    id: string;
    name: string;
  };
}

export const editorInitialState: EditorState = {
  appInfo: {
    name: '',
    version: '',
  },
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
    setAppInfo: (
      state,
      action: PayloadAction<{ name: string; version: string }>
    ) => {
      state.appInfo.name = action.payload.name;
      state.appInfo.version = action.payload.version;
    },
    setFilename: (state, action: PayloadAction<string>) => {
      state.filename = action.payload;
    },
    newFile: (state) => {
      state.filename = '';
      state.dirty = false;
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
    openSplitModal: (state) => {
      state.overlay = 'splitting';
      state.split = {
        id: '',
        name: '',
      };
    },
    openAboutModal: (state) => {
      state.overlay = 'about';
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
