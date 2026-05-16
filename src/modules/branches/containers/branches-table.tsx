import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { BranchesTableContext } from "../context";
import { useBranchesTable } from "../hooks";

export const BranchesTable: FC = () => {
  const { columns } = useBranchesTable();
  return <NextTable context={BranchesTableContext} columns={columns} />;
};
