  import React, { useState } from "react";
  import Nav from "../Nav/Nav";
  import "./Monitoring.css";
  import { Chart as ChartJS, PointElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
  import { Line } from "react-chartjs-2";

  ChartJS.register(PointElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend);

  function Monitoring() {
    const [selectedOption, setSelectedOption] = useState("day");

    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };

    // Sample data for the line chart
    const labels = {
      day: ["Dushanba", "Seshanba", "Charshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"],
      week: ["Week 1", "Week 2", "Week 3", "Week 4"],
      month: [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "Iyun",
        "Iyul",
        "Avgust",
        "Sentabr",
        "Oktabr",
        "Noyabr",
        "Dekabr",
      ],
      year: ["2020", "2022", "2023"],
    };

    const data = {
      datasets: [
        {
          label: "Ma'lumotlar namunasi",
          data: [23, 20, 21, 33, 26, 44, 47, 53, 28, 43, 22],
          backgroundColor: "rgba(37, 182, 121, 1)",
          borderColor: "rgba(37, 182, 121, 1)",
          borderWidth: 15,
          fill: false, // Set to false to create a line chart
          tension: 0.1,
        },
      ],
    };

    // Options for the line chart (you can customize as needed)
    const options = {
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "Line Chart Example",
        },
      },
    };

    // Function to sort data based on the selected option
    const sortData = (data) => {
      switch (selectedOption) {
        case "day":
          return data.slice().sort();
        case "week":
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
          <div className="drmamma-wrapper">
            <div className="text-wrapper">
              <h2 className="drmamma-title">Monitoring</h2>
              <p className="drmamma-title">E’lonlar</p>
            </div>
            <select
              className="day-select"
              onChange={handleSelectChange}
              value={selectedOption}
            >
              <option className="option" value="day">
                Day
              </option>
              <option className="option" value="week">
                Week
              </option>
              <option className="option" value="month">
                Month
              </option>
              <option className="option" value="year">
                Year
              </option>
            </select>
          </div>

          <div className="chart-container">
            <Line data={sortedData} options={options} />
          </div>
        </div>
      </>
    );
  }

  export default Monitoring;
