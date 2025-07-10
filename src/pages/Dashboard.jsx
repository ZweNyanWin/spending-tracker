import { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("journalEntries")) || [];
    setEntries(data);
  }, []);

  const totalAllTime = entries.reduce((sum, e) => sum + e.amount, 0);

  const filtered = monthFilter
    ? entries.filter((e) => e.date.startsWith(monthFilter))
    : entries;

  const totalMonth = filtered.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = {};
  filtered.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const pieData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        data: Object.values(byCategory),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const byDate = {};
  filtered.forEach((e) => {
    byDate[e.date] = (byDate[e.date] || 0) + e.amount;
  });

  const sortedDates = Object.keys(byDate).sort();

  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Spending",
        data: sortedDates.map((d) => byDate[d]),
        borderColor: "#36A2EB",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <h4>Total Spending (All Time): {totalAllTime}</h4>

      <label>Filter by Month:</label>
      <input
        type="month"
        value={monthFilter}
        onChange={(e) => setMonthFilter(e.target.value)}
      />

      <h4>Total Spending (Selected Month): {totalMonth}</h4>

      <h3>Pie Chart</h3>
      <Pie data={pieData} />

      <h3>Line Chart</h3>
      <Line data={lineData} />
    </div>
  );
}
