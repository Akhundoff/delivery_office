import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { BannersTableContext } from "../context";
import { useBannersTable } from "../hooks";

export const BannersTable: FC = () => {
  const { columns } = useBannersTable();
  return <NextTable context={BannersTableContext} columns={columns} />;
};
