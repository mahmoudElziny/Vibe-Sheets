import { Link } from "react-router-dom";

export default function Home() {
  const tables = ["table1", "table2", "table3"];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome!</h1>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Link
            key={table}
            to={`/table/${table}`}
            className="border p-6 rounded shadow hover:bg-gray-50"
          >
            {table.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
