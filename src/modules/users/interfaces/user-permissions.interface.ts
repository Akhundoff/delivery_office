export type IOperation = {
  id: number;
  name: string;
  codeName: string;
};

export type IOperationGroup = {
  id: number;
  name: string;
  operations: IOperation[];
};

export type IUserPermissions = {
  permissionIds: number[];
  companyId: number;
};
