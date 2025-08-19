import { useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TablePage() {
  const { name } = useParams();
  const [rows, setRows] = useState([
    { id: 1, col1: "value1", col2: "value2" },
    { id: 2, col1: "value3", col2: "value4" },
  ]);

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    toast.success("Changes saved!");
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">{name.toUpperCase()}</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Col1</th>
            <th className="p-2 border">Col2</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="p-2 border">
                <input
                  type="text"
                  value={row.col1}
                  onChange={(e) => handleChange(row.id, "col1", e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={row.col2}
                  onChange={(e) => handleChange(row.id, "col2", e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
