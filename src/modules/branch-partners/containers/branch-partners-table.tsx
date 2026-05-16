import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { BranchPartnersTableContext } from "../context";
import { useBranchPartnersTable } from "../hooks";

export const BranchPartnersTable: FC = () => {
  const { columns } = useBranchPartnersTable();
  return <NextTable context={BranchPartnersTableContext} columns={columns} />;
};
