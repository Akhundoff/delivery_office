import { FC } from "react";
import { NextTable } from "@shared/modules/next-table/containers";
import { DeliveryProofsTableContext } from "../context";
import { useDeliveryProofsTable } from "../hooks";

export const DeliveryProofsTable: FC = () => {
  const { columns } = useDeliveryProofsTable();
  return <NextTable context={DeliveryProofsTableContext} columns={columns} />;
};
