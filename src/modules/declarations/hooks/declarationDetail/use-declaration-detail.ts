import { useQuery } from "react-query";
import { IDeclaration } from "../../interfaces";
import { DeclarationsService } from "../../services";

export const useDeclarationDetail = (id: string | number) => {
  return useQuery<IDeclaration, Error>(
    ["declarations", String(id)],
    async () => {
      const result = await DeclarationsService.getDeclarationById(id);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );
};
