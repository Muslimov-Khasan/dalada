import Nav from "../Nav/Nav";
import "./Monitoring.css";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";

ChartJS.register(
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Monitoring() {
  const [selectedOption, setSelectedOption] = useState("DAILY");
  const [ChooseDate, setChooseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [monitoring, setMonitoring] = useState({
    date: "",
    key: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedOption, ChooseDate]); // Run fetchData when selectedOption changes

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const fetchData = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      const response = await fetch(
        "http://188.225.10.97:8080/api/v1/products/statistics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            date: ChooseDate,
            key: selectedOption,
          }),
        }
      );

      const responseData = await response.json();
      console.log(responseData);
      setMonitoring((prevMonitoring) => ({
        ...prevMonitoring,
        date: responseData.date,
        key: responseData.key,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const labels = {
    DAILY: Array.from(
      { length: 24 },
      (_, i) => `${i.toString().padStart(2, "0")}:00`
    ),
    MONTHLY: [
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
    YEARLY: ["2020", "2022", "2023"],
  };

  const data = {
    datasets: [
      {
        label: "Ma'lumotlar namunasi",
        data: [23, 20, 21, 33, 26, 44, 47, 53, 28, 43, 22],
        backgroundColor: "rgba(37, 182, 121, 1)",
        borderColor: "rgba(37, 182, 121, 1)",
        borderWidth: 15,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Options for the line chart (you can customize as needed)
  const options = {
    scales: {
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
      case "DAILY":
        return data.slice().sort();
      case "MONTHLY":
        return data.slice().sort((a, b) => a - b);
      case "YEARLY":
        return data.slice().sort((a, b) => b - a);
      default:
        return data;
    }
  };

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
            <option className="option" value="DAILY">
              Day
            </option>
            <option className="option" value="MONTHLY">
              Month
            </option>
            <option className="option" value="YEARLY">
              Year
            </option>
          </select>
          <input
            className="date-input"
            type="date"
            onChange={(event) => setChooseDate(event.target.value)}
            value={ChooseDate}
          />
        </div>

        <div className="chart-container">
          <Line data={sortedData} options={options} />
        </div>
      </div>
    </>
  );
}

export default Monitoring;