export const sanitizeObject = <ObjectType extends object>(
  object: ObjectType,
  sanitizedValues: (string | number | undefined | null)[],
): ObjectType => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (sanitizedValues.includes(value)) return acc;
    return { ...acc, [key]: value };
  }, {}) as ObjectType;
};
