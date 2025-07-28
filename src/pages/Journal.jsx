// src/pages/Journal.jsx

import { useEffect, useState } from "react";
// 1) Import the JSON so Vite bundles it into your JS
import teacherData from "../data/spending_data.json";
import "../App.css";

export default function Journal() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [date, setDate] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([]);

useEffect(() => {
  //read whatever the user already saved (or [])
  const savedCats =
    JSON.parse(localStorage.getItem("spendingCategories")) || [];

  // grab the instructor’s categories
  const baseCats = Array.from(
    new Set(teacherData.map((r) => r.category))
  );

  // merge them, de-duplicating
  const merged = Array.from(new Set([...baseCats, ...savedCats]));

  // persist + load into state
  localStorage.setItem(
    "spendingCategories",
    JSON.stringify(merged)
  );
  setCategories(merged);

  //  load journal entries as before
  const stored = JSON.parse(
    localStorage.getItem("journalEntries")
  ) || [];
  setEntries(stored);
}, []);


  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return alert("Enter a category name.");
    if (categories.includes(trimmed))
      return alert("That category already exists.");

    const updated = [...categories, trimmed];
    localStorage.setItem(
      "spendingCategories",
      JSON.stringify(updated)
    );
    setCategories(updated);
    setNewCategory(""); // reset input
  };
  

  const handleSaveExpense = () => {
    if (!date || !expenseCategory || amount === "")
      return alert("Please fill date, category, and amount.");

    const num = Number(amount);
    if (isNaN(num) || num < 0)
      return alert("Enter a valid non-negative amount.");

    const entry = { date, category: expenseCategory, amount: num };
    const old = JSON.parse(
      localStorage.getItem("journalEntries")
    ) || [];
    const updatedEntries = [...old, entry];
    localStorage.setItem(
      "journalEntries",
      JSON.stringify(updatedEntries)
    );
    setEntries(updatedEntries);

    // reset form
    setDate("");
    setExpenseCategory("");
    setAmount("");
  };

  return (
    <div className="container">
      {/* add category card */}
      <div className="card">
        <h3>Add New Category</h3>
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory} style={{ marginTop: 8 }}>
          + Add Category
        </button>
      </div>

      {/* add expense card */}
      <div className="card">
        <h3>Add New Expense</h3>

        <label>Date</label>
        <input
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Category</label>
        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Amount ($)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleSaveExpense}
          style={{ marginTop: 8 }}
        >
          Add Expense
        </button>
      </div>

      {/* recent entries */}
      <div className="card">
        <h3>Recent Expenses</h3>
        {entries.length ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i}>
                  <td>{e.date}</td>
                  <td>{e.category}</td>
                  <td>{e.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}
