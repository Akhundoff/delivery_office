export type IAzerpostQueue = {
  id: number;
  objectId: number;
  requestMethod: string;
  requestBody: string;
  responseBody: string;
  statusCode: string;
  executed: boolean;
  attempts: number;
  retryAt: string;
  createdAt: string;
};
