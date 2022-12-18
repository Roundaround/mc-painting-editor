import { atom } from 'jotai';
import { getDefaultPack, Pack } from './pack';
import { Painting } from './painting';

export const iconAtom = atom('');
export const packFormatAtom = atom(9);
export const descriptionAtom = atom('');
export const idAtom = atom('');
export const nameAtom = atom('');
export const paintingsAtom = atom(new Map<string, Painting>());
export const filenameAtom = atom('');
export const lastSavedStateAtom = atom<Pack>(getDefaultPack());
