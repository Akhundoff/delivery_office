import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { CountriesTableContext } from "../context";
import { useCountriesTable } from "../hooks";

export const CountriesTable: FC = () => {
  const { columns } = useCountriesTable();
  return <NextTable context={CountriesTableContext} columns={columns} />;
};
