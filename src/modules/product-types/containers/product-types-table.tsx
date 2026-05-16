import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { ProductTypesTableContext } from "../context";
import { useProductTypesTable } from "../hooks";

export const ProductTypesTable: FC = () => {
  const { columns } = useProductTypesTable();
  return <NextTable context={ProductTypesTableContext} columns={columns} />;
};
