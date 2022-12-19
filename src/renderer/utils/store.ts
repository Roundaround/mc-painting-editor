import { atom } from 'jotai';
import { getDefaultArchive, Archive } from './archive';
import { Painting } from './painting';
import {create, use} from 'xoid';

const createIpcBoundAtom = <T>(key: string, initialValue: T) => {
  const boundAtom = create(initialValue, (atom) => ({
    set: (value: T) => {
      atom.set(value);
      window.electron.sendValue(key, value);
    },
    update: (fn: (value: T) => T) => {
      atom.update(fn);
      window.electron.sendValue(key, atom.value);
    },
  }));

  window.electron.listenForValue(key, (value: T) => {
    boundAtom.set(value);
  });

  return boundAtom;
};

export const iconAtom = createIpcBoundAtom('icon', '');
export const packFormatAtom = createIpcBoundAtom('packFormat', 9);
export const descriptionAtom = createIpcBoundAtom('description', '');
export const idAtom = createIpcBoundAtom('id', '');
export const nameAtom = createIpcBoundAtom('name', '');
export const paintingsAtom = createIpcBoundAtom('paintings', new Map<string, Painting>());
export const filenameAtom = createIpcBoundAtom('filename', '');

export const getPaintingAtom = (id: string) => {
  return paintingsAtom.focus((paintings) => paintings.get(id));
};

// export const iconAtom = atom('');
// export const packFormatAtom = atom(9);
// export const descriptionAtom = atom('');
// export const idAtom = atom('');
// export const nameAtom = atom('');
// export const paintingsAtom = atom(new Map<string, Painting>());
// export const filenameAtom = atom('');
// export const lastSavedStateAtom = atom<Archive>(getDefaultArchive());
