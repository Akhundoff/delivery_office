import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { PopupsTableContext } from "../context";
import { usePopupsTable } from "../hooks";

export const PopupsTable: FC = () => {
  const { columns } = usePopupsTable();
  return <NextTable context={PopupsTableContext} columns={columns} />;
};
