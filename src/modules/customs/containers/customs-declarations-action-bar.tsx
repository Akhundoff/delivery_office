import { useContext } from 'react';
import { Select, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { CustomsDeclarationsTableContext } from '../context';
import { CustomsDeclarationsCounts } from './customs-declarations-counts';
import { UploadCustomsDeclarationsDocument } from './upload-customs-declarations-document';

export const CustomsDeclarationsActionBar = () => {
  const { handleFetch, handleReset, state, handleChangeFilterById } = useContext(CustomsDeclarationsTableContext);

  const isDeclared = state.filters.find((f: any) => f.id === 'd')?.value;
  const clientIsExist = state.filters.find((f: any) => f.id === 'u')?.value;
  const flightStatus = state.filters.find((f: any) => f.id === 'flight')?.value;

  const setFilter = (id: string, value: string | undefined) => handleChangeFilterById(id, value);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <UploadCustomsDeclarationsDocument />
          <CustomsDeclarationsCounts />
          <StyledHeaderButton type="text" disabled={true}>
            Cəmi: {state.total}
          </StyledHeaderButton>
        </Space>
        <Space size={8}>
          <Select placeholder="Bəyan statusu" value={isDeclared} onChange={(v) => setFilter('d', v)} allowClear={true} style={{ width: 160 }}>
            <Select.Option value="1">Bəyan edilib</Select.Option>
            <Select.Option value="0">Bəyan edilməyib</Select.Option>
          </Select>
          <Select placeholder="Müştəri statusu" value={clientIsExist} onChange={(v) => setFilter('u', v)} allowClear={true} style={{ width: 160 }}>
            <Select.Option value="1">Mövcud olan</Select.Option>
            <Select.Option value="0">Mövcud olmayan</Select.Option>
          </Select>
          <Select placeholder="Uçuş statusu" value={flightStatus} onChange={(v) => setFilter('flight', v)} allowClear={true} style={{ width: 160 }}>
            <Select.Option value="in">Uçuşda olan</Select.Option>
            <Select.Option value="out">Uçuşda olmayan</Select.Option>
          </Select>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
