export const filterOption = (input: string, option: any) => {
    if (typeof option?.children === 'string') {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    } else if (Array.isArray(option?.children)) {
        return option.children.join('').toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return false;
};
