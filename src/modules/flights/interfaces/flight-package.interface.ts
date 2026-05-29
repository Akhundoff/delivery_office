export type IFlightPackage = {
  id: number;
  executed: boolean;
  statusCode: string;
  input: { regNumber: string; trackingNumber: string; airWaybillNumber: string; dispatchNumber: string }[];
  output: { code: string; data: { trackingNumber: string; code: string }[] };
  elapsedTime: number;
  startedAt: string;
  endedAt: string;
  createdAt: string;
};

export type IFlightPackageExecution = {
  trackingNumber: string;
  code: string;
  codeText: string;
};
