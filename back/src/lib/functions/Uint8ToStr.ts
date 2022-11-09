import LZString from 'lz-string';

export const Decodeuint8arr = (INPUT: Uint8Array) =>
  LZString.compress(JSON.stringify(INPUT));

export const Encodeuint8arr = (INPUT: string) =>
  new Uint8Array(Object.values(JSON.parse(LZString.decompress(INPUT) || '')));

export const JsonToString = (INPUT: object) =>
  LZString.compressToEncodedURIComponent(JSON.stringify(INPUT));

export const StringToJson = <T>(INPUT: string): T =>
  JSON.parse(LZString.decompressFromEncodedURIComponent(INPUT) || '');
