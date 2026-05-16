import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { AzerpostQueuesTableContext } from "../context";
import { useAzerpostQueuesTable } from "../hooks";

export const AzerpostQueuesTable: FC = () => {
  const { columns } = useAzerpostQueuesTable();
  return <NextTable context={AzerpostQueuesTableContext} columns={columns} />;
};
