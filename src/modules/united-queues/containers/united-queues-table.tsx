import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { UnitedQueuesTableContext } from "../context";
import { useUnitedQueuesTable } from "../hooks";

export const UnitedQueuesTable: FC = () => {
  const { columns } = useUnitedQueuesTable();
  return <NextTable context={UnitedQueuesTableContext} columns={columns} filterable={false} sortable={false} />;
};
