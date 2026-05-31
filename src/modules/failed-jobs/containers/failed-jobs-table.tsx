import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { FailedJobsTableContext } from "../context";
import { useFailedJobsTable } from "../hooks";

export const FailedJobsTable: FC = () => {
  const { columns } = useFailedJobsTable();
  return <NextTable context={FailedJobsTableContext} columns={columns} filterable={false} sortable={false} />;
};
