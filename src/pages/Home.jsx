import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; 

export default function Home() {
  const sections = ["Accredited Office Review Actions", "On-Hold Actions For Office Response", "Office Operational Actions"];

  const section1 = [
    "PWS", "SIGNED PROPOSAL", "ASSESSMENT PACKAGE", "ASSESSMENT PACKAGE - Resubmitted",
    "SURVEILLANCE PACKAGES", "SURVEILLANCE PACKAGES - Resubmitted", "EXTRA VISIT PACKAGE",
    "CLIENT DETAILS CHANGE REQUEST", "SALES TECH CHANGE REQUEST", "CERTIFICATES TO PRINT",
    "STANDARD / CPO APPLICATION", "CODE APPLICATIONS"
  ];

  const section2 = [
    "PWS ON HOLD", "SIGNED PROPOSAL ON HOLD", "STAGE 1 PACKAGES", "STAGE 2 PACKAGES",
    "RE-ASSESSMENT PACKAGES", "CLIENT DETAILS CHANGE REQUEST", "SALES TECH CHANGE REQUEST",
    "SURVEILLANCE PACKAGES", "EXTRA VISIT PACKAGE", "STANDARD / CPO APPLICATION",
    "CODE APPLICATIONS", "PWS CREATION"
  ];

  const section3 = [
    "RE-AUDIT PROPOSAL TO ACTION", "PROPOSAL TO SEND", "PROPOSAL WITHOUT CONTRACT",
    "RE-AUDIT BOOKINGS OVERDUE", "SURV DUE IN 3 MONTHS & NOT BOOKED", "STAGE 1 NOT BOOKED",
    "ASSESSMENT NOT BOOKED", "ASSESS PACKAGES TO UPLOAD", "RE-ASSESS PACKAGES TO UPLOAD",
    "SURV PACKAGES TO UPLOAD", "CPD FOR SUBMISSION", "AUDITOR PERFORMANCE ACTION"
  ];

  const [counts, setCounts] = useState({});
  const navigate = useNavigate();

  const handleClick = (item) => {
    navigate(`/table/${item}`);
  };

  useEffect(() => {
    const allItems = [...section1, ...section2, ...section3];

    async function fetchCounts() {
      try {
        const results = await Promise.all(
          allItems.map(async (item) => {
            const tableName = item.toLowerCase().replace(/[\s-]+/g, "_");
            const { count, error } = await supabase
              .from(tableName)
              .select("*", { count: "exact", head: true });

            if (error) {
              console.error(`Error fetching count for ${tableName}:`, error.message);
              return [item, 0];
            }

            return [item, count ?? 0];
          })
        );

        const countsObj = Object.fromEntries(results);
        setCounts(countsObj);
      } catch (err) {
        console.error("Error in fetchCounts:", err);
      }
    }

    fetchCounts();

    const subscriptions = allItems.map((item) => {
      const tableName = item.toLowerCase().replace(/[\s-]+/g, "_");

      return supabase
        .channel(`public:${tableName}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: tableName },
          async () => {
            const { count, error } = await supabase
              .from(tableName)
              .select("*", { count: "exact", head: true });

            if (!error) {
              setCounts((prev) => ({
                ...prev,
                [item]: count ?? 0,
              }));
            }
          }
        )
        .subscribe();
    });

    return () => {
      subscriptions.forEach((sub) => supabase.removeChannel(sub));
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-center items-start gap-3">
        {sections.map((section) => (
          <div
            key={section}
            className="border p-2 rounded shadow bg-[#dfe0d0] w-full text-center"
          >
            <div className="bg-[#4caf50] text-white p-2 rounded font-bold">
              {section}
            </div>
            <div className="my-1 p-2">
              {section === "Accredited Office Review Actions" &&
                section1.map((item) => (
                  <div
                    key={item}
                    className="mb-2 bg-white rounded text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleClick(item)}
                  >
                    <Link
                      className="text-gray-800 text-xs font-bold p-1 flex justify-between"
                      to={`/table/${item}`}
                    >
                      <span>{item}</span>
                      <span className="text-gray-500">
                        {counts[item] !== undefined ? counts[item] : (
                          <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                        )}
                      </span>
                    </Link>
                  </div>
                ))}

              {section === "On-Hold Actions For Office Response" &&
                section2.map((item) => (
                  <div
                    key={item}
                    className="mb-2 bg-white rounded text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleClick(item)}
                  >
                    <Link
                      className="text-gray-800 text-xs font-bold p-1 flex justify-between"
                      to={`/table/${item}`}
                    >
                      <span>{item}</span>
                      <span className="text-gray-500">
                        {counts[item] !== undefined ? counts[item] : (
                          <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                        )}
                      </span>
                    </Link>
                  </div>
                ))}

              {section === "Office Operational Actions" &&
                section3.map((item) => (
                  <div
                    key={item}
                    className="mb-2 bg-white rounded text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleClick(item)}
                  >
                    <Link
                      className="text-gray-800 text-xs font-bold p-1 flex justify-between"
                      to={`/table/${item}`}
                    >
                      <span>{item}</span>
                      <span className="text-gray-500">
                        {counts[item] !== undefined ? counts[item] : (
                          <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                        )}
                      </span>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
