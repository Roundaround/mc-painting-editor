import { arePaintingsEqual, Painting } from './painting';

export interface Archive {
  filename: string;
  id: string;
  name: string;
  description: string;
  packFormat: number;
  icon: string;
  paintings: Map<string, Painting>;
}

export const getDefaultArchive = (): Archive => ({
  filename: '',
  id: '',
  name: '',
  description: '',
  packFormat: 9,
  icon: '',
  paintings: new Map(),
});

export const areArchivesEqual = (a: Archive, b: Archive): boolean =>
  a.filename === b.filename &&
  a.id === b.id &&
  a.name === b.name &&
  a.description === b.description &&
  a.packFormat === b.packFormat &&
  a.icon === b.icon &&
  a.paintings.size === b.paintings.size &&
  [...a.paintings.keys()].every((id) => b.paintings.has(id)) &&
  [...a.paintings.keys()].every((id) =>
    arePaintingsEqual(a.paintings.get(id)!, b.paintings.get(id)!)
  );
