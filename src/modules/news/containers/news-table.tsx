import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { NewsTableContext } from "../context";
import { useNewsTable } from "../hooks";

export const NewsTable: FC = () => {
  const { columns } = useNewsTable();
  return <NextTable context={NewsTableContext} columns={columns} />;
};
