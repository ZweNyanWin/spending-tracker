import { useEffect, useState } from "react";

export default function Journal() {
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("spendingCategories"));
    if (stored) {
      setCategories(stored);
    } else {
      fetch("/spending-category.json")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          localStorage.setItem("spendingCategories", JSON.stringify(data));
        });
    }
  }, []);

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem("spendingCategories", JSON.stringify(updated));
      setNewCategory("");
    }
  };

  const handleSave = () => {
    if (!date || !category || !amount) {
      alert("Please fill all fields.");
      return;
    }

    const entry = { date, category, amount: Number(amount) };
    const oldEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const updatedEntries = [...oldEntries, entry];
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));

    alert("Saved!");
    setDate("");
    setCategory("");
    setAmount("");
  };

  return (
    <div>
      <h2>Journal</h2>

      <label>Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label>Category:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div>
        <label>Add New Category:</label>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add</button>
      </div>

      <label>Amount:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleSave}>Save Entry</button>
    </div>
  );
}
