import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

export default function TablePage() {
  const { tableName } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);


  // Fetch columns
  useEffect(() => {
    async function fetchColumns() {
      const { data: cols, error } = await supabase.rpc("get_table_columns", {
        table_name: tableName,
      });

      if (error) {
        console.error(error);
        toast.error("Error fetching columns");
        return;
      }

      const filtered = cols
        .map((c) => c.column_name)
        .filter((c) => c !== "id" && c !== "user_id");

      setColumns(filtered);
    }
    fetchColumns();
  }, [tableName]);

  // Fetch rows
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase.from(tableName).select("*");
      if (error) {
        console.error(error);
        toast.error("Error fetching data");
      } else {
        setRows(data);
      }
      setLoading(false);
    }
    fetchData();
  }, [tableName]);

  // Handle input change
  const handleChange = (rowIndex, col, value) => {
    const updated = [...rows];
    updated[rowIndex][col] = value;
    setRows(updated);
  };

  // Insert new row
  const handleInsert = () => {
    const emptyRow = {};
    columns.forEach((col) => {
      emptyRow[col] = "";
    });
    setRows((prev) => [...prev, emptyRow]);
  };

  // Save *all* rows (bulk save)
  const handleSaveAll = async () => {
    const newRows = rows.filter((r) => !r.id);
    const existingRows = rows.filter((r) => r.id);

    if (newRows.length > 0) {
      const payload = newRows.map((row) => {
        const cleanRow = {};
        columns.forEach((col) => {
          if (
            col !== "tracking_no" &&
            row[col] !== undefined &&
            row[col] !== ""
          ) {
            cleanRow[col] = row[col];
          }
        });
        return cleanRow;
      });

      const { data, error } = await supabase
        .from(tableName)
        .insert(payload)
        .select();

      if (error) {
        console.error(error);
        toast.error("Error inserting rows: " + error.message);
      } else {
        toast.success("New rows inserted");
        setRows([...existingRows, ...data]);
      }
    }

    for (const row of existingRows) {
      const payload = {};
      columns.forEach((col) => {
        if (col !== "tracking_no") {
          payload[col] = row[col];
        }
      });

      const { error } = await supabase
        .from(tableName)
        .update(payload)
        .eq("id", row.id);

      if (error) {
        console.error(error);
        toast.error("Error updating row " + row.id);
      }
    }

    toast.success("Changes saved");
  };

  // Save a single row
  const handleSaveRow = async (row) => {
    if (!row.id) {
      toast.error("Row must be saved first with Save All");
      return;
    }

    const payload = {};
    columns.forEach((col) => {
      if (col !== "tracking_no") {
        payload[col] = row[col];
      }
    });

    const { error } = await supabase
      .from(tableName)
      .update(payload)
      .eq("id", row.id);

    if (error) {
      console.error(error);
      toast.error("Error updating row " + row.id);
    } else {
      toast.success("Row updated");
      setEditingRow(null);
    }
  };

  // Delete row
  const handleDelete = async (id) => {
    if (!id) {
      setRows((prev) => prev.filter((r) => r.id));
      return;
    }
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Error deleting row");
    } else {
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Row deleted");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-300 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4 bg-[#4caf50] p-4">
        {tableName.toUpperCase()}
      </h1>

      {rows.length === 0 ? (
        <div>
          <p className="mb-4">No data in {tableName}</p>
          <button
            onClick={handleInsert}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Insert new row
          </button>
        </div>
      ) : (
        <>
          <table className="w-full border">
            <thead>
              <tr className="bg-[#4caf50]">
                {columns.map((col) => (
                  <th
                    key={col}
                    className= "px-3 py-2 border text-xs text-left break-words whitespace-normal"
                    style={{ maxWidth: col === "tracking_no" ? "60px" : "200px", minWidth: col === "tracking_no" ? "60px" : 
                      col === "company_name" ? "180px" : "120px"
                    }}
                  >
                    {col.toUpperCase().replace(/_/g, "\n")}
                  </th>
                ))}
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map((col) => (
                    <td key={col} className="p-2 border bg-amber-50">
                      {col === "tracking_no" ? (
                        <input
                          type="text"
                          value={row[col] || ""}
                          disabled
                          className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500 text-sm"
                        />
                      ) : col.toLowerCase().includes("date") ? (
                        <input
                          type="date"
                          value={row[col] || ""}
                          onChange={(e) =>
                            handleChange(idx, col, e.target.value)
                          }
                          disabled={editingRow !== row.id}
                          className="w-full border px-3 py-2 rounded text-xs"
                        />
                      ) : (
                        <input
                          type="text"
                          value={row[col] || ""}
                          onChange={(e) =>
                            handleChange(idx, col, e.target.value)
                          }
                          disabled={editingRow !== row.id}
                          className="w-full border px-3 py-2 rounded text-xs"
                        />
                      )}
                    </td>
                  ))}
                  <td className="p-2 border flex gap-2">
                    {editingRow === row.id ? (
                      <button
                        onClick={() => handleSaveRow(row)}
                        className="bg-blue-600 text-xs text-white px-3 py-2 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingRow(row.id)}
                        className="bg-yellow-500 text-xs text-white px-3 py-2 rounded"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="bg-red-500 text-xs text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleInsert}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Insert new row
            </button>
            <button
              onClick={handleSaveAll}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save All
            </button>
          </div>
        </>
      )}
    </div>
  );
}
