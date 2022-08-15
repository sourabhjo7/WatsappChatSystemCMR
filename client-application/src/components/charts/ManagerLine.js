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


function ManagerLine({totalEscalations, totalTemplates, totalCompletedChats}) {

    const filterEsc = (timeArr) =>{
      let arr = [0, 0, 0, 0, 0];

      for(let esc of totalEscalations){
        if(esc.date <= timeArr[0]){
          arr[0] = arr[0]+1;
        }
        if(esc.date <= timeArr[1]){
          arr[1] = arr[1]+1;
        }
        if(esc.date <= timeArr[2]){
          arr[2] = arr[2]+1;
        }
        if(esc.date <= timeArr[3]){
          arr[3] = arr[3]+1;
        }
        if(esc.date <= timeArr[4]){
          arr[4] = arr[4]+1;
        }
      }

      return arr;
    }
    const filterTemp = (timeArr) =>{

      let arr = [0, 0, 0, 0, 0];

      for(let temp of totalTemplates){
        if(temp.creationDate <= timeArr[0]){
          arr[0] = arr[0]+1;
        }
        if(temp.creationDate <= timeArr[1]){
          arr[1] = arr[1]+1;
        }
        if(temp.creationDate <= timeArr[2]){
          arr[2] = arr[2]+1;
        }
        if(temp.creationDate <= timeArr[3]){
          arr[3] = arr[3]+1;
        }
        if(temp.creationDate <= timeArr[4]){
          arr[4] = arr[4]+1;
        }
      }

      return arr;

    }
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

    const filterData = (toBeFilterArr) => {
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

      let datasetArr;

      if(toBeFilterArr === "esc"){
        datasetArr = filterEsc(timeArr);
      }else if(toBeFilterArr === "temp"){
        datasetArr = filterTemp(timeArr);
      }else{
        datasetArr = filterChats(timeArr);
      }

      return datasetArr;
    }

    const data = {
      labels,
      datasets: [
        {
          label: 'Escalated Chats',
          data: filterData("esc"),
          borderColor: '#97A4FC',
          backgroundColor: '#97A4FC',
        },
        {
          label: 'Template Created',
          data: filterData("temp"),
          borderColor: '#4EFFB5',
          backgroundColor: '#4EFFB5',
        },
        {
          label: 'Completed Chats',
          data: filterData("chat"),
          borderColor: '#3751FF',
          backgroundColor: '#3751FF',
        },
      ],
    };

    return <Line options={options} data={data} />;
}

export default ManagerLine;
