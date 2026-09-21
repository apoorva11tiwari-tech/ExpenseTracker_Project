import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";

function UserIncome() {
  const [incomes, setIncomes] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("Salary");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  const sources = [
    "Salary",
    "Freelance",
    "Investments",
    "Gift",
    "Allowance",
    "Other"
  ];

  // Fetch incomes from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/income")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch income records");
        return res.json();
      })
      .then((data) => setIncomes(data))
      .catch((err) => console.error("Error fetching income:", err));
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount || !date || !source) {
      alert("Please fill in all required fields.");
      return;
    }

    const incomeData = {
      title,
      amount: Number(amount),
      source,
      date,
      description
    };

    try {
      const response = await fetch("http://localhost:5000/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add income");
      }

      setIncomes([result.income, ...incomes]);
      alert("Income added successfully!");

      // Reset form
      setTitle("");
      setAmount("");
      setSource("Salary");
      setDate("");
      setDescription("");
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income.");
    }
  };

  // Delete Income Record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income record?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/income/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete income");

      setIncomes(incomes.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income.");
    }
  };

  // Filtered incomes based on search
  const filteredIncomes = incomes.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.source?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Income Tracker 💰</h2>

      {/* Add Income Form Card */}
      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="mb-3">Add New Income</h4>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title / Source Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Monthly Salary, Freelance Project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Source Category</label>
              <select
                className="form-select"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                {sources.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Description (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Note or details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-success">
                + Add Income
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Income Records List Card */}
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Income History</h4>
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search income..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Source</th>
                <th>Date</th>
                <th className="text-end">Amount</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      {item.source}
                    </span>
                  </td>
                  <td>
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="text-end text-success fw-bold">
                    +₹{Number(item.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredIncomes.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No income records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserIncome;