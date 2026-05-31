export type IFailedJob = {
  id: number;
  displayName: string;
  maxTries: number | null;
  delay: number | null;
  body: string;
  failedAt: string;
  number: string;
  dispatchData: Record<string, any>;
};
