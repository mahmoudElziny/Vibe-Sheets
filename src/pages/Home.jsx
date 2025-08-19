import { Link } from "react-router-dom";

export default function Home() {
  const tables = ["table1", "table2", "table3"];

 return (
  <div className="max-w-5xl w-full mx-auto">
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
        {tables.map((table) => (
          <Link
            key={table}
            to={`/table/${table}`}
            className="border p-6 rounded shadow hover:bg-gray-50 w-full text-center"
          >
            {table.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

}
