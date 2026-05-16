import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { CouponsTableContext } from "../context";
import { useCouponsTable } from "../hooks";

export const CouponsTable: FC = () => {
  const { columns } = useCouponsTable();
  return <NextTable context={CouponsTableContext} columns={columns} />;
};
