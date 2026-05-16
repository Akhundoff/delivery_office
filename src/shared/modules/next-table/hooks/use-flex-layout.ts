const getTableProps = (props: any, { instance }: any) => [props, { style: { minWidth: `${instance.totalColumnsWidth}px` } }];

const getRowStyles = (props: any, { instance }: any) => [props, { style: { display: 'flex', flex: '1 0 auto', minWidth: `${instance.totalColumnsMinWidth}px` } }];

const getHeaderProps = (props: any, { column }: any) => [
    props,
    {
        style: {
            boxSizing: 'border-box',
            flex: column.unit === 'px' ? undefined : column.totalFlexWidth ? `${column.totalFlexWidth} 0 auto` : undefined,
            minWidth: `${column.totalMinWidth}px`,
            width: `${column.totalWidth}px`,
        },
    },
];

const getCellProps = (props: any, { cell }: any) => [
    props,
    {
        style: {
            boxSizing: 'border-box',
            flex: cell.column.unit === 'px' ? undefined : `${cell.column.totalFlexWidth} 0 auto`,
            minWidth: `${cell.column.totalMinWidth}px`,
            width: `${cell.column.totalWidth}px`,
        },
    },
];

export const useNextTableFlexLayout = (hooks: any) => {
    hooks.getTableProps.push(getTableProps);
    hooks.getRowProps.push(getRowStyles);
    hooks.getHeaderGroupProps.push(getRowStyles);
    hooks.getHeaderProps.push(getHeaderProps);
    hooks.getCellProps.push(getCellProps);
};
