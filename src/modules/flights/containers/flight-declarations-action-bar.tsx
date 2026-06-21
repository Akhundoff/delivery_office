import { useContext } from 'react';
import { Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils';
import { DeclarationsTableContext } from '@modules/declarations/context';
import { FlightsService } from '../services';

export const FlightDeclarationsActionBar = () => {
  const { state } = useContext(DeclarationsTableContext);

  const exportExcel = async () => {
    message.loading({ key: 'flight-dec-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await FlightsService.getListExcel(tableFilterQueryMaker(state.filters));
    if (result.status === 200) {
      message.success({ key: 'flight-dec-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `flight-declarations_export_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'flight-dec-export', content: result.data as string });
    }
  };

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={exportExcel} icon={<Icons.FileExcelOutlined />}>
            Excel
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
