import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Input, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { CustomsPostsTableContext } from '../context';

export const CustomsPostsActionBar = () => {
    const { state, handleChangeFilterById } = useContext(CustomsPostsTableContext);

    const [tempFilters, setTempFilters] = useState({ fin: '', trackingNumber: '', dateFrom: '', dateTo: '', status: '' });

    const fin = useMemo(() => state.filters.find((f: any) => f.id === 'documentNumber')?.value, [state.filters]);
    const trackingNumber = useMemo(() => state.filters.find((f: any) => f.id === 'trackingNumber')?.value, [state.filters]);
    const dateFrom = useMemo(() => state.filters.find((f: any) => f.id === 'dateFrom')?.value, [state.filters]);
    const dateTo = useMemo(() => state.filters.find((f: any) => f.id === 'dateTo')?.value, [state.filters]);
    const status = useMemo(() => state.filters.find((f: any) => f.id === 'status')?.value, [state.filters]);

    const date = useMemo<[Dayjs, Dayjs]>(() => {
        if (dateFrom && dateTo) {
            return [dayjs(dateFrom), dayjs(dateTo)];
        }
        return [dayjs().startOf('day'), dayjs().endOf('day')];
    }, [dateFrom, dateTo]);

    const onDateChange = useCallback((value: [Dayjs | null, Dayjs | null] | null) => {
        const [from, to] = value || [null, null];
        if (from && to) {
            setTempFilters((prev) => ({
                ...prev,
                dateFrom: from.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                dateTo: to.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            }));
        }
    }, []);

    const onStatusChange = useCallback((value: string | undefined) => {
        setTempFilters((prev) => ({ ...prev, status: value || '' }));
    }, []);

    const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTempFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const onSubmit = useCallback(() => {
        handleChangeFilterById('dateFrom', tempFilters.dateFrom);
        handleChangeFilterById('dateTo', tempFilters.dateTo);
        handleChangeFilterById('status', tempFilters.status);
        handleChangeFilterById('documentNumber', tempFilters.fin);
        handleChangeFilterById('trackingNumber', tempFilters.trackingNumber);
    }, [handleChangeFilterById, tempFilters]);

    useEffect(() => {
        setTempFilters({ fin: fin || '', trackingNumber: trackingNumber || '', dateFrom: dateFrom || '', dateTo: dateTo || '', status: status || '' });
    }, [fin, trackingNumber, dateFrom, dateTo, status]);

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space size={8}>
                    <DatePicker.RangePicker allowClear={false} value={date} onChange={onDateChange} />
                    <Select style={{ width: 200 }} allowClear={true} onChange={onStatusChange} placeholder='Status'>
                        <Select.Option value='0'>Gömrükdə</Select.Option>
                        <Select.Option value='1'>Bəyan edilmiş</Select.Option>
                        <Select.Option value='3'>Qutuya əlavə edilmiş</Select.Option>
                        <Select.Option value='4'>Depesh göndərilmiş</Select.Option>
                    </Select>
                    <Input value={tempFilters.fin} onChange={onInputChange} name='fin' placeholder='FİN Kod' />
                    <Input value={tempFilters.trackingNumber} onChange={onInputChange} name='trackingNumber' placeholder='İzləmə kodu' />
                    <Button onClick={onSubmit} icon={<Icons.SearchOutlined />} />
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
