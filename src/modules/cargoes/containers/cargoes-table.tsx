import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { CargoesTableContext } from "../context";
import { useCargoesTable } from "../hooks";

export const CargoesTable: FC = () => {
  const { columns } = useCargoesTable();
  return <NextTable context={CargoesTableContext} columns={columns} />;
};
