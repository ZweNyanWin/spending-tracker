// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../App.css';

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [groupBy, setGroupBy] = useState('daily');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setEntries(data);
  }, []);

  function formatMonthLabel(monthStr) {
    const [year, month] = monthStr.split('-');
    const d = new Date(`${monthStr}-01`);
    return `${d.toLocaleString('default',{month:'long'})} ${year}`;
  }

  function getWeekNumber(dateStr) {
    const date = new Date(dateStr);
    const onejan = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = (date - onejan + 86400000) / 86400000;
    return `${date.getFullYear()}-W${String(Math.ceil(dayOfYear/7)).padStart(2,'0')}`;
  }

  function getWeekRangeLabel(yearWeek) {
    const [year, wn] = yearWeek.split('-W');
    const week = parseInt(wn,10);
    const simple = new Date(year,0,1 + (week-1)*7);
    const dow = simple.getDay();
    const start = new Date(simple);
    if (dow <= 4) start.setDate(simple.getDate() - dow + 1);
    else start.setDate(simple.getDate() + 8 - dow);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return `${fmt(start)} ~ ${fmt(end)}`;
  }

  // only valid entries
  let valid = entries.filter(e => {
    if (typeof e.date !== 'string' || typeof e.amount !== 'number') return false;
    const [y, m, d] = e.date.split('-');
    if (!y || !m || !d) return false;
    const padded = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    e.date = padded;
    return true;
  });
  

  // apply filter
  if (groupBy==='daily' && dateFilter) {
    valid = valid.filter(e=>e.date===dateFilter);
  } else if (groupBy==='weekly' && dateFilter) {
    const tw = getWeekNumber(dateFilter);
    valid = valid.filter(e=>getWeekNumber(e.date)===tw);
  } else if (groupBy==='monthly' && dateFilter) {
    valid = valid.filter(e=>e.date.startsWith(dateFilter));
  }

  const totalAll = valid.reduce((s,e)=>s+e.amount,0);
  const totalSel = valid.reduce((s,e)=>s+e.amount,0);

  const byCat = {};
  valid.forEach(e=> byCat[e.category]=(byCat[e.category]||0)+e.amount);
  const pieData = { labels: Object.keys(byCat), datasets:[{ data:Object.values(byCat), backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40']} ] };

  const byGrp = {};
  valid.forEach(e=>{
    let key = groupBy==='daily'?e.date
            : groupBy==='monthly'?e.date.substring(0,7)
            : getWeekNumber(e.date);
    byGrp[key] = (byGrp[key]||0) + e.amount;
  });
  const groups = Object.keys(byGrp).sort();
  const lineData = {
    labels: groups.map(k =>
      groupBy==='weekly'?getWeekRangeLabel(k)
    : groupBy==='monthly'?formatMonthLabel(k)
    : k
    ),
    datasets:[{ label:`Spending (${groupBy})`, data:groups.map(k=>byGrp[k]), borderColor:'#36A2EB', fill:false }]
  };

  return (
    <div className="container">
      <div style={{display:'flex',gap:'1rem',alignItems:'center',marginBottom:'1rem'}}>
        <label>Group Data By:</label>
        <select value={groupBy}
          onChange={e=>{setGroupBy(e.target.value);setDateFilter('');}}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        {groupBy==='daily'&&<>
          <label>Filter by Day:</label>
          <input type="date" value={dateFilter}
            onChange={e=>setDateFilter(e.target.value)}/>
        </>}
        {(groupBy==='weekly'||groupBy==='monthly')&&<>
          <label>Filter by Month:</label>
          <input type="month" value={dateFilter}
            onChange={e=>setDateFilter(e.target.value)}/>
        </>}
      </div>

      <div className="grid grid-3">
        <div className="card"><h4>Total Spending (All Time)</h4><p>${totalAll.toFixed(2)}</p></div>
        <div className="card"><h4>Period Total</h4><p>${totalSel.toFixed(2)}</p></div>
        <div className="card"><h4>Grouping</h4><p>{groupBy.charAt(0).toUpperCase()+groupBy.slice(1)}</p></div>
      </div>

      <div className="grid grid-2">
        <div className="card chart-container"><h3>Over Time</h3><Line data={lineData}/></div>
        <div className="card chart-container"><h3>By Category</h3><Pie data={pieData}/></div>
      </div>
    </div>
  );
}
