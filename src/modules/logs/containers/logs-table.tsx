import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { LogsTableContext } from "../context";
import { useLogsTable } from "../hooks";

export const LogsTable: FC = () => {
  const { columns } = useLogsTable();
  return <NextTable context={LogsTableContext} columns={columns} />;
};
