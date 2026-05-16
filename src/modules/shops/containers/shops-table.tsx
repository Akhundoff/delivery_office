import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { ShopsTableContext } from "../context";
import { useShopsTable } from "../hooks";

export const ShopsTable: FC = () => {
  const { columns } = useShopsTable();
  return <NextTable context={ShopsTableContext} columns={columns} />;
};
