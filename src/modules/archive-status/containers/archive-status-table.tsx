import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { ArchiveStatusTableContext } from "../context";
import { useArchiveStatusTable } from "../hooks";

export const ArchiveStatusTable: FC = () => {
  const { columns } = useArchiveStatusTable();
  return <NextTable context={ArchiveStatusTableContext} columns={columns} />;
};
