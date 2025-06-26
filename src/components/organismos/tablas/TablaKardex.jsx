import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import styled from "styled-components";
import { useKardexStore } from "../../../store/KardexStore";
import { Paginacion } from "./Paginacion";
import { v } from "../../../styles/variables";
import { ContentAccionesTabla } from "../ContentAccionesTabla";
import Swal from "sweetalert2";
import { FaArrowsAltV } from "react-icons/fa";
import { useState } from "react";
import { Device } from "../../../styles/breackpoints";

// MEJORA: Componente para mostrar el tipo de movimiento con colores
const TipoMovimiento = styled.div`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 15px;
  font-weight: 500;
  font-size: 0.85em;
  color: #fff;
  background-color: ${(props) => props.color};
  text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
  text-transform: capitalize;
`;

export function TablaKardex({
  data,
  SetopenRegistro,
  setdataSelect,
  setAccion,
}) {
  const [pagina, setPagina] = useState(1);
  const { eliminarkardex } = useKardexStore();

  const editar = (data) => {
    // La edición podría estar deshabilitada para registros anulados
    if (data.estado === 0) {
      Swal.fire({
        icon: "info",
        title: "Registro Anulado",
        text: "Este registro no se puede editar porque ha sido anulado.",
      });
      return;
    }
    // La edición no tiene sentido en un Kardex, pero se deja la lógica por si se requiere
    Swal.fire({
        icon: "info",
        title: "Acción no disponible",
        text: "Los movimientos de Kardex no pueden ser editados, solo anulados.",
      });
  };

  const eliminar = (p) => {
    if (p.estado === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Este registro ya fue anulado.",
        confirmButtonColor: v.colorError,
      });
      return;
    }
    Swal.fire({
      title: "¿Anular este movimiento?",
      text: "Esta acción no se puede deshacer y ajustará el stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
      confirmButtonColor: v.colorError,
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarkardex({ id: p.id });
      }
    });
  };
  
  const columns = [
    {
      accessorKey: "descripcion",
      header: "Producto",
      cell: (info) => (
        <span style={{ textDecoration: info.row.original.estado === 0 ? "line-through" : "none" }}>
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: (info) => <span>{new Date(info.getValue()).toLocaleDateString()}</span>,
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: (info) => {
        const tipo = info.getValue();
        const color = tipo.includes("entrada") ? v.colorIngresos : v.colorError;
        return <TipoMovimiento color={color}>{tipo}</TipoMovimiento>;
      },
    },
     {
      accessorKey: "cantidad",
      header: "Cantidad",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "nombres",
      header: "Usuario",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "acciones",
      header: "Acciones",
      cell: (info) => (
        <ContentAccionesTabla
          // La edición se deshabilita visualmente pasando una función vacía o nula si es necesario
          funcionEditar={() => editar(info.row.original)}
          funcionEliminar={() => eliminar(info.row.original)}
        />
      ),
    },
  ];
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: {
          pageSize: 10, // Más filas por defecto para un historial
        },
      },
  });

  return (
    <Container>
      <div className="table-responsive">
        <table className="responsive-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <div className="header-content">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span
                          className="sort-icon"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <FaArrowsAltV />
                        </span>
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion
        table={table}
        irinicio={() => table.setPageIndex(0)}
        pagina={table.getState().pagination.pageIndex + 1}
        setPagina={setPagina}
        maximo={table.getPageCount()}
      />
    </Container>
  );
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.bgcards};
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);

  .table-responsive {
    overflow-x: auto;
  }

  .responsive-table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background-color: ${({ theme }) => theme.bgAlpha};
      th {
        padding: 16px;
        font-weight: 600;
        text-align: left;
        color: ${({ theme }) => theme.text};
        border-bottom: 2px solid ${({ theme }) => theme.bg4};
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sort-icon {
          cursor: pointer;
          transition: color 0.2s;
          &:hover {
            color: ${({ theme }) => theme.primary};
          }
        }
      }
    }

    tbody {
      tr {
        transition: background-color 0.2s ease-in-out;
        border-bottom: 1px solid ${({ theme }) => theme.bg4};

        &:last-of-type {
          border-bottom: none;
        }

        &:hover {
          background-color: ${({ theme }) => theme.bgAlpha};
        }
      }

      td {
        padding: 15px 16px;
        vertical-align: middle;
        text-align: left;
        color: ${({ theme }) => theme.text};
        font-size: 0.9em;
      }
    }
  }
`;
