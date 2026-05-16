import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { FaqTableContext } from "../context";
import { useFaqTable } from "../hooks";

export const FaqTable: FC = () => {
  const { columns } = useFaqTable();
  return <NextTable context={FaqTableContext} columns={columns} />;
};
