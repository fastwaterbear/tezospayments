export const copyObjectExcludingFields = <T, TFields extends keyof T>(obj: T, fields: TFields[]): Omit<T, TFields> => {
  const newObject = { ...obj };

  fields.forEach(field => delete newObject[field]);

  return newObject;
};
