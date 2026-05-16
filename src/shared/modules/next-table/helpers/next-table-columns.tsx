import { NextTableDateFilter } from '../components/filters/date';

type Columns = Record<'smaller' | 'small' | 'normal' | 'large' | 'actions' | 'date', any>;

export const nextTableColumns: Columns = {
    smaller: {
        width: 75,
        minWidth: 75,
        maxWidth: 75,
        unit: 'px',
    },
    small: {
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        unit: 'px',
    },
    normal: {
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        unit: 'px',
    },
    large: {
        width: 200,
        minWidth: 200,
        maxWidth: 200,
        unit: 'px',
    },
    actions: {
        id: 'actions',
        width: 39,
        minWidth: 39,
        maxWidth: 39,
        filterable: false,
        sortable: false,
        unit: 'px',
    },
    date: {
        width: 200,
        minWidth: 200,
        maxWidth: 200,
        unit: 'px',
        Filter: NextTableDateFilter,
    },
};

export const nextTableColumnGenerator = (width: number, unit?: 'px') => ({
    width,
    minWidth: width,
    maxWidth: width,
    unit,
});
