import { FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { IPartnerDeclarationStatistic } from '../interfaces';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const PartnerDeclarationsChart: FC<{ data: IPartnerDeclarationStatistic[] }> = ({ data }) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.updatedAt),
      datasets: [
        {
          label: 'Bağlama sayı',
          borderColor: 'rgb(61, 192, 234)',
          backgroundColor: 'rgba(61, 192, 234, 0.1)',
          data: data.map((item) => item.count),
          fill: true,
        },
      ],
    }),
    [data],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { display: false } },
    }),
    [],
  );

  return <Line options={options} data={chartData} />;
};
