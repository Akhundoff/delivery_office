import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { BoxesTableContext } from "../context";
import { useBoxesTable } from "../hooks";

export const BoxesTable: FC = () => {
  const { columns } = useBoxesTable();
  return <NextTable context={BoxesTableContext} columns={columns} />;
};
