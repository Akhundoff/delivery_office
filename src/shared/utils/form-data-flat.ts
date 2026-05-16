import { flatten } from 'flat';

export const formDataFlat = <Output extends object>(object: Record<string, any>): Output => {
  const flattened = flatten<Record<string, any>, Record<string, any>>(object);

  const connectorsChanged = Object.entries(flattened).reduce((acc, [key, value]) => {
    const finalKey = key.split('.').reduce((a, val, index) => a + (index ? '[' + val + ']' : val), '');
    return { ...acc, [finalKey]: value };
  }, {});

  return Object.entries(connectorsChanged).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value instanceof Array) return acc;

    const finalEntry: Record<string, string> = {};
    if (typeof value === 'number') {
      finalEntry[key] = value.toString();
    } else if (typeof value === 'boolean') {
      finalEntry[key] = Number(value).toString();
    } else {
      finalEntry[key] = value;
    }
    return { ...acc, ...finalEntry };
  }, {}) as Output;
};
