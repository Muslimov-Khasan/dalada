import React, { useState } from "react";
import Nav from "../Nav/Nav";
import "./Monitoring.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Monitoring() {
  const [selectedOption, setSelectedOption] = useState("day");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Sample data for the bar chart
  const labels = {
    day: ["Dushanna", "Seshanba", "Charshanba", "Payshanba", "Juma", "Shanba"],
    month: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    year: ["2020", "2022", "2023"],
  };

  const data = {
    datasets: [
      {
        label: "Ma'lumotlar namunasi",
        data: [23, 20, 21, 33, 26, 44, 47, 53 ,28, 43, 22],
        backgroundColor: "rgba(37, 182, 121, 1)",
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };
  
  // Options for the bar chart (you can customize as needed)
  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Bar Chart Example",
      },
    },
  };

  // Function to sort data based on the selected option
  const sortData = (data) => {
    switch (selectedOption) {
      case "day":
        return data.slice().sort();
      case "month":
        
        return data.slice().sort((a, b) => a - b);
      case "year":
       
        return data.slice().sort((a, b) => b - a);
      default:
        return data;
    }
  };

  // Sort data based on the selected option
  const sortedData = {
    ...data,
    labels: labels[selectedOption],
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data: sortData(dataset.data),
    })),
  };

  return (
    <>
      <div className="container">
        <Nav />
        <h2 className="drmamma-title">Monitoring</h2>
        <div className="drmamma-wrapper">
          <p className="drmamma-title">E’lonlar</p>
          <select
            className="day-select"
            onChange={handleSelectChange}
            value={selectedOption}
          >
            <option className="option" value="day">
              Kun
            </option>
            <option className="option" value="month">
              oy
            </option>
            <option className="option" value="year">
              Yil
            </option>
          </select>
        </div>

        <div className="chart-container">
          <Bar data={sortedData} options={options} />
        </div>
      </div>
    </>
  );
}

export default Monitoring;
