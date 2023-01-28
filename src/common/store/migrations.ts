import {
  createEntityAdapter,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';

export interface Migration {
  id: string;
  pairs: [string, string][];
  uuid: string; // For maintaining tracking in React
}

export const getDefaultMigration = (
  id = '',
  pairs: [string, string][] = []
): Migration => ({
  id: id,
  pairs: pairs,
  uuid: nanoid(),
});

export const migrationsAdapter = createEntityAdapter<Migration>({
  selectId: (migration) => migration.uuid,
});

export const migrationsSlice = createSlice({
  name: 'migrations',
  initialState: migrationsAdapter.getInitialState(),
  reducers: {
    addMigration: migrationsAdapter.addOne,
    createMigration: (
      state,
      action: PayloadAction<{ id: string; pairs: [string, string][] }>
    ) => {
      const { id, pairs } = action.payload;
      return migrationsAdapter.addOne(state, getDefaultMigration(id, pairs));
    },
    upsertMigration: migrationsAdapter.upsertOne,
    updateMigration: migrationsAdapter.updateOne,
    setMigrations: migrationsAdapter.setAll,
    removeMigration: migrationsAdapter.removeOne,
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
