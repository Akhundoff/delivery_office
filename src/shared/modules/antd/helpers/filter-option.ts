export const filterOption = (input: string, option: any) => {
  if (typeof option?.children === 'string') {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  } else if (Array.isArray(option?.children)) {
    return option.children.join('').toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  return false;
};

export const filterOptionWithNameOrId = (input: string, option: any) => {
  const parsedInput = parseInt(input.toLowerCase());
  if (typeof option?.children === 'string') {
    return Number.isNaN(parsedInput)
      ? option.children.toLowerCase().split(' ')[3]?.includes(input.toLowerCase()) ?? false
      : option.children.toLowerCase().split(' ')[1]?.includes(parsedInput.toString()) ?? false;
  } else if (Array.isArray(option?.children)) {
    return Number.isNaN(parsedInput)
      ? option.children[option.children.length - 1]?.toLowerCase().includes(input.toLowerCase()) ?? false
      : option.children[1]?.toString().toLowerCase().startsWith(parsedInput.toString()) ?? false;
  }
  return false;
};

export const filterOptionStart = (input: string, option: any) => {
  if (typeof option?.children === 'string') {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) === 1;
  } else if (Array.isArray(option?.children)) {
    return option.children.join('').toLowerCase().indexOf(input.toLowerCase()) === 1;
  }
  return false;
};
