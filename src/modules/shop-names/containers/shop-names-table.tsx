import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { ShopNamesTableContext } from "../context";
import { useShopNamesTable } from "../hooks";

export const ShopNamesTable: FC = () => {
  const { columns } = useShopNamesTable();
  return <NextTable context={ShopNamesTableContext} columns={columns} />;
};
