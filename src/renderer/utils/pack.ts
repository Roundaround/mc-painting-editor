import { Painting } from './painting';

export interface Pack {
  filename: string;
  id: string;
  name: string;
  description: string;
  packFormat: number;
  icon: string;
  paintings: Map<string, Painting>;
}

export const getDefaultPack = (): Pack => ({
  filename: '',
  id: '',
  name: '',
  description: '',
  packFormat: 9,
  icon: '',
  paintings: new Map(),
});

export const arePacksEqual = (a: Pack, b: Pack): boolean =>
  a.filename === b.filename &&
  a.id === b.id &&
  a.name === b.name &&
  a.description === b.description &&
  a.packFormat === b.packFormat &&
  a.icon === b.icon &&
  a.paintings.size === b.paintings.size &&
  [...a.paintings.keys()].every((id) => b.paintings.has(id));
