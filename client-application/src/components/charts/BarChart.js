import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: ' Chart',
    },
  },
  scales: {}
};

const labels = ["Managers", "Agents", "Templates"];



function BarChart({exData}) {
    const data = {
      labels,
      datasets: [
        {
          label: 'Adimin',
          data: [exData.manager, exData.agent, exData.template],
          backgroundColor: ["#a9f2d3", "#7af4c1", "#18f499"],
          // borderColor: 'rgb(255, 99, 132)',
        }
      ],
    };
    return <Bar options={options} data={data} />;
}

export default BarChart;
