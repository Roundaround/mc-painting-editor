import {
  createEntityAdapter,
  createSlice,
  EntityId,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';

import { editorActions } from '$common/store/editor';

export interface Migration {
  id: string;
  description: string;
  pairs: [string, string][];
  uuid: EntityId; // For maintaining tracking in React
}

export const getDefaultMigration = (
  id = '',
  description = '',
  pairs: [string, string][] = []
): Migration => ({
  id: id,
  description: description,
  pairs: pairs,
  uuid: nanoid(),
});

export const migrationsAdapter = createEntityAdapter({
  selectId: (migration: Migration) => migration.uuid,
});

export const migrationsSlice = createSlice({
  name: 'migrations',
  initialState: migrationsAdapter.getInitialState(),
  reducers: {
    addMigration: migrationsAdapter.addOne,
    createMigration: (
      state,
      action: PayloadAction<{
        id: string;
        description: string;
        pairs: [string, string][];
      }>
    ) => {
      const { id, description, pairs } = action.payload;
      return migrationsAdapter.addOne(
        state,
        getDefaultMigration(id, description, pairs)
      );
    },
    upsertMigration: migrationsAdapter.upsertOne,
    updateMigration: migrationsAdapter.updateOne,
    setMigrations: migrationsAdapter.setAll,
    removeMigration: migrationsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(editorActions.newFile, () => migrationsInitialState);
  },
});

export const migrationsReducer = migrationsSlice.reducer;
export const migrationsActions = migrationsSlice.actions;

export const migrationsInitialState = migrationsAdapter.getInitialState();
export const migrationsSelectors = migrationsAdapter.getSelectors<{
  migrations: MigrationsState;
}>((state) => state.migrations);

export type MigrationsState = ReturnType<typeof migrationsReducer>;

export function areMigrationsEqual(a: Migration, b: Migration): boolean {
  return a.id === b.id && a.pairs === b.pairs;
}
