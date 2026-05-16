import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { StatusesTableContext } from "../context";
import { useStatusesTable } from "../hooks";

export const StatusesTable: FC = () => {
  const { columns } = useStatusesTable();
  return <NextTable context={StatusesTableContext} columns={columns} />;
};
