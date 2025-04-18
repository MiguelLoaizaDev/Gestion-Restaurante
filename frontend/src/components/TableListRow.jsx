function TableListRow({ table, setSelectedTable, setShowModal }) {
    const getStatusClass = (status) => {
      switch (status) {
        case "available":
          return "bg-success text-white";
        case "occupied":
          return "bg-danger text-white";
        case "reserved":
          return "bg-primary text-white";
        default:
          return "bg-secondary text-white";
      }
    };
  
    return (
      <tr>
        <td>Mesa {table.id}</td>
        <td>{table.capacity}</td>
        <td>
          <span className={`badge ${getStatusClass(table.status)}`}>
            {table.status === "available"
              ? "Disponible"
              : table.status === "occupied"
              ? "Ocupada"
              : "Reservada"}
          </span>
        </td>
        <td>{table.customerName || "-"}</td>
        <td>{table.timeOccupied || "-"}</td>
        <td>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setSelectedTable(table);
              setShowModal(true);
            }}
          >
            Editar
          </button>
        </td>
      </tr>
    );
  }
  
  export default TableListRow;
  