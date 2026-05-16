import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { ReturnTypesTableContext } from "../context";
import { useReturnTypesTable } from "../hooks";

export const ReturnTypesTable: FC = () => {
  const { columns } = useReturnTypesTable();
  return <NextTable context={ReturnTypesTableContext} columns={columns} />;
};
