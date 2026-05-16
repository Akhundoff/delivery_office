import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { RegionsTableContext } from "../context";
import { useRegionsTable } from "../hooks";

export const RegionsTable: FC = () => {
  const { columns } = useRegionsTable();
  return <NextTable context={RegionsTableContext} columns={columns} />;
};
