import { getDefaultArchive, Archive } from './archive';
import { Painting } from './painting';
import { Atom, Usable, create, use } from 'xoid';

type Merge<T, U> = Omit<T, keyof U> & U;

type BoundAtomUsable<T, U = {}> = Usable<
  Merge<
    {
      registerListener: () => () => void;
    },
    U
  >
>;

const createIpcBoundAtom = <T, U = {}>(
  key: string,
  initialValue: T,
  getUsable?: (atom: Atom<T>) => U
): Atom<T> & BoundAtomUsable<T, U> => {
  let baseSetter = (value: T) => {};
  
  const boundAtom = create(initialValue, (atom) => {
    const usableAdditions = getUsable?.(atom) ?? ({} as U);
    return {
      registerListener: () => {
        return window.electron.listenForValue(key, (value: T) => {
          baseSetter(value);
        });
      },
      ...usableAdditions,
    };
  });

  baseSetter = boundAtom.set;
  boundAtom.set = (value: T) => {
    baseSetter(value);
    window.electron.sendValue(key, value);
  };

  return boundAtom;
};

export const loadingAtom = createIpcBoundAtom('loading', false);
export const iconAtom = createIpcBoundAtom('icon', '');
export const packFormatAtom = createIpcBoundAtom('packFormat', 9);
export const descriptionAtom = createIpcBoundAtom('description', '');
export const idAtom = createIpcBoundAtom('id', '');
export const nameAtom = createIpcBoundAtom('name', '');
export const paintingsAtom = createIpcBoundAtom(
  'paintings',
  new Map<string, Painting>()
);
export const filenameAtom = createIpcBoundAtom('filename', '');
