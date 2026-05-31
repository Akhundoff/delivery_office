import { FC, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { rgba } from 'polished';
import { getChartColor } from './chart-colors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
    labels: string[];
    data: number[];
    label?: string;
};

export const StatisticsBarChart: FC<Props> = ({ labels, data, label = 'Saylar' }) => {
    const chartData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    label,
                    data,
                    backgroundColor: data.map((_, index) => rgba(getChartColor(index), 0.75)),
                },
            ],
        }),
        [labels, data, label],
    );

    const options = useMemo(() => ({ responsive: true, plugins: { legend: { display: false } } }), []);

    return <Bar options={options} data={chartData} />;
};
