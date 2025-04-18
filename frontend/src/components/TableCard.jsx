import { FaClock, FaUsers } from "react-icons/fa";

function TableCard({ table, setSelectedTable, setShowModal }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "bg-success-subtle";
      case "occupied":
        return "bg-danger-subtle";
      case "reserved":
        return "bg-primary-subtle";
      default:
        return "bg-secondary-subtle";
    }
  };

  return (
    <div
      className={`card h-100 ${getStatusClass(table.status)}`}
      onClick={() => {
        setSelectedTable(table);
        setShowModal(true);
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body d-flex flex-column align-items-center justify-content-center">
        <h5 className="mb-2">Mesa {table.id}</h5>
        <div className="d-flex align-items-center gap-2">
          <FaUsers size={16} />
          <span>{table.capacity}</span>
        </div>
        {table.status === "occupied" && (
          <div className="d-flex align-items-center gap-2 mt-2">
            <FaClock size={16} />
            <span>{table.timeOccupied}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableCard;
