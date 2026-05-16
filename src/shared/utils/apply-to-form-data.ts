export const appendToFormData = <ObjectType extends Record<string, any> = Record<string, any>>(object: ObjectType, formData: FormData) => {
  Object.entries(object)
    .filter(([, value]) => !!value)
    .forEach(([key, value]) => formData.append(key, value));
};
