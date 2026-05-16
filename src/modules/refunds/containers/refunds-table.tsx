import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { RefundsTableContext } from "../context";
import { useRefundsTable } from "../hooks";

export const RefundsTable: FC = () => {
  const { columns } = useRefundsTable();
  return <NextTable context={RefundsTableContext} columns={columns} />;
};
