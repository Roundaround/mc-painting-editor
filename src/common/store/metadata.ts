import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MetadataState {
  icon: string;
  packFormat: number;
  description: string;
  id: string;
  name: string;
  targetScale: number;
}

export const metadataInitialState: MetadataState = {
  icon: '',
  packFormat: 9,
  description: '',
  id: '',
  name: '',
  targetScale: 1,
};

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: metadataInitialState,
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
    setTargetScale: (state, action: PayloadAction<number>) => {
      state.targetScale = action.payload;
    },
  },
});

export const metadataReducer = metadataSlice.reducer;
export const metadataActions = metadataSlice.actions;
