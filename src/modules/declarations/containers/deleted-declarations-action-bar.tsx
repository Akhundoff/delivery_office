import { useCallback, useContext, useMemo } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import * as Icons from '@ant-design/icons';
import { DeletedDeclarationsTableContext } from '../context';

export const DeletedDeclarationsActionBar = () => {
    const { state, handleChangeFilterById, handleFetch, handleReset } = useContext(DeletedDeclarationsTableContext);

    const date = useMemo<[Dayjs, Dayjs] | undefined>(() => {
        const from = state.filters.find((f: any) => f.id === 'dateFrom')?.value;
        const to = state.filters.find((f: any) => f.id === 'dateTo')?.value;
        if (from && to) return [dayjs(from), dayjs(to)];
        return undefined;
    }, [state.filters]);

    const handleDateChange = useCallback(
        (value: [Dayjs | null, Dayjs | null] | null) => {
            handleChangeFilterById('dateFrom', value?.[0]?.startOf('day').format('YYYY-MM-DD HH:mm:ss'));
            handleChangeFilterById('dateTo', value?.[1]?.endOf('day').format('YYYY-MM-DD HH:mm:ss'));
        },
        [handleChangeFilterById],
    );

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
                        Yenilə
                    </StyledHeaderButton>
                    <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
                        Sıfırla
                    </StyledHeaderButton>
                    <StyledHeaderButton type='text' disabled={true}>
                        Cəmi: {state.total}
                    </StyledHeaderButton>
                </Space>
                <Space>
                    <DatePicker.RangePicker value={date} onChange={handleDateChange} />
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
