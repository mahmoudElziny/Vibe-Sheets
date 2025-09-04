import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const sections = ["Accredited Office Review Actions", "On-Hold Actions For Office Response", "Office Operational Actions"];
  const section1 = ["PWS", "SIGNED PROPOSAL", "ASSESSMENT PACKAGE", "ASSESSMENT PACKAGE - Resubmitted", "SURVEILLANCE PACKAGES",
    "SURVEILLANCE PACKAGES - Resubmitted", "EXTRA VISIT PACKAGE", "CLIENT DETAILS CHANGE REQUEST", "SALES TECH CHANGE REQUEST",
  "CERTIFICATES TO PRINT", "STANDARD / CPO APPLICATION", "CODE APPLICATIONS"];
  const section2 = ["PWS ON HOLD", "SIGNED PROPOSAL ON HOLD", " STAGE 1 PACKAGES", "STAGE 2 PACKAGES", "RE-ASSESSMENT PACKAGES",
    "CLIENT DETAILS CHANGE REQUEST", "SALES TECH CHANGE REQUEST",
  "SURVEILLANCE PACKAGES", "EXTRA VISIT PACKAGE", "STANDARD / CPO APPLICATION", "CODE APPLICATIONS", "PWS CREATION"];
  const section3 = ["RE-AUDIT PROPOSAL TO ACTION", "PROPOSAL TO SEND", "PROPOSAL WITHOUT CONTRACT", "RE-AUDIT BOOKINGS OVERDUE",
    "SURV DUE IN 3 MONTHS & NOT BOOKED", "STAGE 1 NOT BOOKED", "ASSESSMENT NOT BOOKED", "ASSESS PACKAGES TO UPLOAD",
    "RE-ASSESS PACKAGES TO UPLOAD", "SURV PACKAGES TO UPLOAD", "CPD FOR SUBMISSION", "AUDITOR PERFORMANCE ACTION"];

  const navigate = useNavigate();
  const handleClick = (item) => {
    navigate(`/table/${item}`);
  };

return (
  <div>
    <div className="p-8">
      <div className="flex justify-center items-center gap-3">
        {sections.map((section) => (
          <div
            key={section}
            className="border p-2 rounded shadow bg-[#dfe0d0] w-full text-center"
          >
            <div className="text-white p-2 rounded">
              <div className="bg-[#4caf50] text-white p-2 rounded font-bold">{section}</div>
              <div className="my-1 p-2">            
                  {section === "Accredited Office Review Actions" && section1.map((item) => (
                    <div key={item} className="mb-2 bg-white rounded text-left hover:bg-gray-200 cursor-pointer" onClick={() => handleClick(item)}>    
                        <Link className="text-gray-800 text-xs font-bold p-1" to={`/table/${item}`}>{item}</Link>
                    </div>
                  ))}
                  {section === "On-Hold Actions For Office Response" && section2.map((item) => (
                    <div key={item} className="mb-2 bg-white rounded text-left hover:bg-gray-200 cursor-pointer" onClick={() => handleClick(item)}>    
                        <Link className="text-gray-800 text-xs font-bold p-1" to={`/table/${item}`}>{item}</Link>
                    </div>
                  ))}
                  {section === "Office Operational Actions" && section3.map((item) => (
                    <div key={item} className="mb-2 bg-white rounded text-left hover:bg-gray-200 cursor-pointer" onClick={() => handleClick(item)}>    
                        <Link className="text-gray-800 text-xs font-bold p-1" to={`/table/${item}`}>{item}</Link>
                    </div>
                  ))}
              
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}
