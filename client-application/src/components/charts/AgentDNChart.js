import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function AgentDNChart({exData}) {

    const data = {
      labels: ['Pending Chats', 'Assigned Chats', "Completed Chats"],
      datasets: [
        {
          label: '# of Votes',
          data: [exData.penChats, exData.assChats, exData.comChats],
          backgroundColor: [
            '#3751FF',
            '#97A4FC',
            '#73FFC5'
          ],
          borderColor: ['#fff'],
          borderWidth: 1,
        },
      ],
    };

    return <Doughnut data={data} />
}

export default AgentDNChart;
