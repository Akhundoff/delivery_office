export const baseErrorParser = (errors: Record<string, string[]>): string[] => {
  return Object.values(errors).flat();
};
