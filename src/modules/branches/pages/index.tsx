import { FC, useMemo, useState } from "react";
import { Alert, Button, message, Table } from "antd";
import { useQuery } from "react-query";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BranchesTableContext } from "../context";
import { branchesTableFetchUseCase } from "../use-cases/table-fetch";
import { BranchesTable, BranchesActionBar } from "../containers";
import { BranchesService } from "../services";

export const BranchesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={BranchesTableContext} onFetch={branchesTableFetchUseCase} name="branches-table">
        <BranchesActionBar />
        <BranchesTable />
      </NextTableProvider>
    </PageContent>
  );
};

export const FlyexLocationsPage: FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const { data, isFetching, refetch } = useQuery(["flyex-locations"], async () => {
    const result = await BranchesService.getFlyexLocations();
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  });

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as number[]),
    }),
    [selectedRowKeys],
  );

  const createBranches = async () => {
    if (!selectedRowKeys.length) return;
    const result = await BranchesService.createBranchesFromLocations(selectedRowKeys);
    if (result.status === 200) {
      message.success("Yeni filial(lar) yaradıldı");
      setSelectedRowKeys([]);
      refetch();
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <PageContent $contain={true}>
      <h2>Flyex Filialları</h2>

      <Alert
        style={{ marginBottom: 16 }}
        message="Yaradılan yeni Flyex filialı qeyri-aktiv və natamam məlumatlarla yaradılacaq. Aktivləşdirmək üçün məlumatları yerinə doldurmaqla aktivləşdirə bilərsiz."
        type="info"
        showIcon
      />

      <Table rowKey="id" dataSource={data || []} loading={isFetching} rowSelection={rowSelection} pagination={false} scroll={{ y: "60vh" }}>
        <Table.Column title="Id" dataIndex="id" key="id" width={100} />
        <Table.Column title="Ad" dataIndex="name" key="name" />
        <Table.Column title="Ünvan" dataIndex="address" key="address" />
        <Table.Column title="Cədvəl" dataIndex="scheduleDescription" key="scheduleDescription" />
        <Table.Column
          title="Xəritə"
          dataIndex="mapUrl"
          key="mapUrl"
          render={(value: string) =>
            value ? (
              <a href={value} target="_blank" rel="noreferrer">
                Xəritədə aç
              </a>
            ) : (
              "-"
            )
          }
        />
      </Table>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={createBranches} disabled={!selectedRowKeys.length}>
          Yeni Filial yarat
        </Button>
      </div>
    </PageContent>
  );
};
