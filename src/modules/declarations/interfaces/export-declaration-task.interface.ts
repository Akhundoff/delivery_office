export interface IExportDeclarationTask {
  id: string;
  type: string;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: number; name: string };
  status: { id: number; name: string };
  model: { id: number; name: string };
}
