import { shallowEqualObjects } from 'shallow-equal';

export const twoLevelShallowEqualObject = (prevObject: object, currObject: object): boolean => {
  for (const key in prevObject) {
    if (prevObject.hasOwnProperty(key) && currObject.hasOwnProperty(key)) {
      if (!shallowEqualObjects(prevObject[key], currObject[key])) return false;
    } else {
      return false;
    }
  }
  return true;
};
