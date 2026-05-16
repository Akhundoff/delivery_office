import { useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, Tag, message } from "antd";
import * as Icons from "@ant-design/icons";

import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";

import { CountriesService } from "../../services";
import { ICountry } from "../../interfaces";

export const useCountriesTableColumns = (handleFetch: () => void): Column<ICountry>[] => {
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<ICountry>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Düzəliş et",
            icon: <Icons.EditOutlined />,
            onClick: () =>
              navigate(`/countries/${original.id}/update`, { withBackground: true }),
          },
          { type: "divider" },
          {
            key: "delete",
            label: "Sil",
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: "Diqqət",
                content: "Ölkəni silməyə əminsinizmi?",
                okText: "Sil",
                okType: "danger",
                cancelText: "Ləğv et",
                onOk: async () => {
                  const result = await CountriesService.delete([original.id]);
                  if (result.status === 200) {
                    handleFetch();
                  } else {
                    message.error(result.data as string);
                  }
                },
              });
            },
          },
        ];

        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={["hover"]}>
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<ICountry>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.name, id: "country_name", Header: "Ad" },
      { accessor: (r) => r.abbr, id: "abbr", Header: "Abbr" },
      { accessor: (r) => r.currency, id: "currency", Header: "Valyuta" },
      { accessor: (r) => r.unit, id: "unit", Header: "Vahid" },
      {
        accessor: (r) => r.box,
        id: "box",
        Header: "Yeşik",
        Cell: ({ value }: any) => value ? <Tag color="green">Bəli</Tag> : <Tag>Xeyr</Tag>,
      },
      {
        ...nextTableColumns.date,
        accessor: (r) => r.createdAt,
        id: "created_at",
        Header: "Tarix",
      },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
