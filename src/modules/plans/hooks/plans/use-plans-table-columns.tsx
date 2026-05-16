import { useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from "antd";
import * as Icons from "@ant-design/icons";
import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { filterOption } from "@shared/modules/antd/helpers/filter-option";
import { useBackgroundNavigate } from "@shared/hooks";
import { SettingsContext } from "@modules/settings";
import { useContext } from "react";
import { PlansService } from "../../services";
import { IPlan } from "../../interfaces";

export const usePlansTableColumns = (handleFetch: () => void): Column<IPlan>[] => {
  const navigate = useBackgroundNavigate();
  const settings = useContext(SettingsContext);

  const actionsColumn = useMemo<Column<IPlan>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          { key: "edit", label: "Düzəliş et", icon: <Icons.EditOutlined />, onClick: () => navigate(`/plans/${original.id}/update`, { withBackground: true }) },
          { type: "divider" },
          {
            key: "delete", label: "Sil", icon: <Icons.DeleteOutlined />, danger: true,
            onClick: () => Modal.confirm({ title: "Diqqət", content: "Tarifi silməyə əminsinizmi?", okText: "Sil", okType: "danger", cancelText: "Ləğv et",
              onOk: async () => { const r = await PlansService.delete([original.id]); if (r.status === 200) handleFetch(); else message.error(r.data as string); },
            }),
          },
        ];
        return <StopPropagation><Dropdown menu={{ items }} trigger={["hover"]}><Button icon={<Icons.MoreOutlined />} size="small" /></Dropdown></StopPropagation>;
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<IPlan>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      {
        ...nextTableColumns.small, accessor: (r) => {
          const c = settings.data?.countries?.find((c) => c.id === r.countryId);
          return c?.name || r.countryId;
        }, id: "country_id", Header: "Ölkə",
        Filter: ({ column: { setFilter, filterValue } }: any) => (
          <Select showSearch filterOption={filterOption} allowClear style={{ width: "100%" }} onChange={setFilter} value={filterValue} placeholder="Ölkə seç">
            {(settings.data?.countries || []).map((c) => <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>)}
          </Select>
        ),
      },
      { ...nextTableColumns.small, accessor: (r) => r.weight.from, id: "from_weight", Header: "Çəkidən (kg)" },
      { ...nextTableColumns.small, accessor: (r) => r.weight.to ?? "∞", id: "to_weight", Header: "Çəkiyə (kg)" },
      { ...nextTableColumns.normal, accessor: (r) => `${r.price} ${r.currency}`, id: "price", Header: "Qiymət" },
      {
        ...nextTableColumns.small, accessor: (r) => (
          <Tag color={r.type === "maye" ? "blue" : "default"}>{r.type === "maye" ? "Maye" : "Standart"}</Tag>
        ), id: "type", Header: "Növ",
      },
      { accessor: (r) => r.tariffCategory.name || "—", id: "tariff_category_id", Header: "Kateqoriya" },
    ],
    [settings.data],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
