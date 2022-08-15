import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export let labels = [];

var d = new Date();
var tempDate = new Date();
for(let i = 4; i >= 0; i--){
  tempDate.setMonth(d.getMonth() - i);
  labels.push(monthArr[tempDate.getMonth()]);
}


function AdminLine({totalCompletedChats}) {

    const filterChats = (timeArr) =>{

      let arr = [0, 0, 0, 0, 0];

      for(let chat of totalCompletedChats){
        if(chat.lastInteraction <= timeArr[0]){
          arr[0] = arr[0]+1;
        }
        if(chat.lastInteraction <= timeArr[1]){
          arr[1] = arr[1]+1;
        }
        if(chat.lastInteraction <= timeArr[2]){
          arr[2] = arr[2]+1;
        }
        if(chat.lastInteraction <= timeArr[3]){
          arr[3] = arr[3]+1;
        }
        if(chat.lastInteraction <= timeArr[4]){
          arr[4] = arr[4]+1;
        }
      }

      return arr;

    }

    const filterData = () => {
      var d = new Date();

      let timeArr = [];
      var tempDate = new Date();
      for(let i = 3; i >= 0; i--){

        tempDate.setMonth(d.getMonth() - i);

        tempDate.setDate(0);
        tempDate.setHours(0, 0, 0, 0);

        timeArr.push(tempDate.getTime());

        if(i === 0){
          tempDate = new Date();
          timeArr.push(tempDate.getTime());
        }
      }

      const datasetArr = filterChats(timeArr);

      return datasetArr;
    }

    const data = {
      labels,
      datasets: [
        {
          label: 'Completed Chats',
          data: filterData(),
          borderColor: '#7AF4C1',
          backgroundColor: '#7AF4C1',
        },
      ],
    };

    return <Line options={options} data={data} />;
}

export default AdminLine;
