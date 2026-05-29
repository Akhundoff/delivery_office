import { FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type Props = {
    labels: string[];
    datasets: { label: string; data: number[]; color?: string }[];
};

export const StatisticsLineChart: FC<Props> = ({ labels, datasets }) => {
    const chartData = useMemo(
        () => ({
            labels,
            datasets: datasets.map((ds) => ({
                label: ds.label,
                borderColor: ds.color || 'rgb(61, 192, 234)',
                backgroundColor: `${ds.color || 'rgba(61, 192, 234'}0.1)`,
                data: ds.data,
                fill: true,
            })),
        }),
        [labels, datasets],
    );

    const options = useMemo(
        () => ({ responsive: true, plugins: { legend: { display: datasets.length > 1 } } }),
        [datasets.length],
    );

    return <Line options={options} data={chartData} />;
};
