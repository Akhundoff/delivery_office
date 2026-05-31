import { FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import { rgba } from 'polished';
import { IOrderStatisticByAdmin } from '../interfaces';
import { getChartColor } from './chart-colors';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const OrdersByAdminChart: FC<{ data: IOrderStatisticByAdmin[] }> = ({ data }) => {
    const labels = useMemo(() => uniq(data.map((item) => item.updatedAt)), [data]);

    const datasets = useMemo(() => {
        const groupedByUser = groupBy(data, (item) => item.user.id);
        return Object.values(groupedByUser).map((rows, index) => {
            const user = rows[0].user;
            const color = getChartColor(index);
            return {
                label: user.name,
                borderColor: color,
                backgroundColor: rgba(color, 0.05),
                data: labels.map((date) => {
                    const found = rows.find((item) => item.updatedAt === date);
                    return found ? found.price : 0;
                }),
                fill: true,
            };
        });
    }, [data, labels]);

    const chartData = useMemo(() => ({ labels, datasets }), [labels, datasets]);
    const options = useMemo(() => ({ responsive: true, plugins: { legend: { display: true } } }), []);

    return <Line options={options} data={chartData} />;
};
