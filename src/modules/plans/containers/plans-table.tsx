import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { PlansTableContext } from "../context";
import { usePlansTable } from "../hooks";

export const PlansTable: FC = () => {
  const { columns } = usePlansTable();
  return <NextTable context={PlansTableContext} columns={columns} />;
};
