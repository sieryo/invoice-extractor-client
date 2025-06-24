function normalizeKey(key: any) {
  return key
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // hapus simbol seperti titik, tanda baca, dll
    .replace(/\s+/g, "_");   // ubah spasi menjadi underscore
}

export function normalizeObject(obj: any) {
  const result = {};

  for (const key in obj) {
    const normalizedKey = normalizeKey(key);
    // @ts-expect-error
    result[normalizedKey] = obj[key];
  }

  return result;
}
