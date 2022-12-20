import { castDraft, castImmutable, produce } from 'immer';
import { useMemo } from 'react';

export type EntityState<T> = {
  ids: string[];
  entities: { [id: string]: T };
};

export const getEmptyEntityState = <T>(): EntityState<T> => ({
  ids: [],
  entities: {},
});

type IdSelector<T> = (entity: T) => string;

const partialIdSelector = <T>(idSelector: IdSelector<T>) => {
  return idSelector as (entity: Partial<T>) => string | undefined;
};

export const wrapEntityState = <T>(
  state: EntityState<T>,
  idSelector: IdSelector<T> = (entity: any) => entity.id
) => ({
  get(id: string) {
    return this.getById(id);
  },
  getById(id: string) {
    if (!state.entities[id]) {
      return undefined;
    }
    return state.entities[id];
  },
  getByIndex(index: number) {
    if (index < 0 || index >= state.ids.length) {
      return undefined;
    }
    return state.entities[state.ids[index]];
  },
  getIndexById(id: string) {
    return state.ids.indexOf(id);
  },
  getAllIds() {
    return castImmutable(state.ids);
  },
  getAll() {
    return castImmutable(state.ids.map((id) => state.entities[id]));
  },
  add: produce<EntityState<T>, [T]>((draft, entity) => {
    const entityId = idSelector(entity);
    if (draft.entities[entityId]) {
      return;
    }

    draft.ids.push(entityId);
    // TODO: Why is the cast necessary?
    draft.entities[entityId] = castDraft(entity);
  }),
  update: produce<EntityState<T>, [string, Partial<T>]>((draft, id, entity) => {
    if (!draft.entities[id]) {
      return;
    }

    // Do some legwork to update ID
    const entityId = partialIdSelector(idSelector)(entity);
    if (entityId !== undefined && id !== entityId) {
      if (!!draft.entities[entityId]) {
        // TODO: Handle the case of clashing ids
        return;
      }

      draft.entities[entityId] = draft.entities[id];
      delete draft.entities[id];

      const index = draft.ids.indexOf(id);
      draft.ids[index] = entityId;

      id = entityId;
    }

    draft.entities[id] = {
      ...draft.entities[id],
      ...entity,
    };
  }),
  remove: produce<EntityState<T>, [string]>((draft, id) => {
    if (!draft.entities[id]) {
      return;
    }

    const index = draft.ids.indexOf(id);
    draft.ids.splice(index, 1);
    delete draft.entities[id];
  }),
});

export const useEntityState = <T>(
  entityState: EntityState<T>,
  idSelector: IdSelector<T> = (entity: any) => entity.id
) => {
  return useMemo(() => {
    return wrapEntityState(entityState, idSelector);
  }, [entityState]);
};
