import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({exData}) {

    const data = {
      labels: ['Agents', 'Active Agents'],
      datasets: [
        {
          label: '# of Votes',
          data: [exData.agent, exData.activeAgent],
          backgroundColor: [
            '#73FFC5',
            '#97A4FC',
          ],
          borderColor: ['#fff'],
          borderWidth: 1,
        },
      ],
    };

    return <Doughnut data={data} />
}

export default DoughnutChart;
