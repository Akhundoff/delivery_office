export type ILog = {
  id: number;
  title: string;
  action: string;
  modelId: number;
  modelName: string;
  objectId: number;
  userId: number;
  userName: string;
  createdAt: string;
};

export type ILogDetail = ILog & {
  newValue: Record<string, any> | null;
  oldValue: Record<string, any> | null;
};
