import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import styled from "styled-components";
import { useMarcaStore } from "../../../store/MarcaStore";
import { Paginacion } from "./Paginacion";
import { v } from "../../../styles/variables";
import { ContentAccionesTabla } from "../ContentAccionesTabla";
import Swal from "sweetalert2";
import { FaArrowsAltV } from "react-icons/fa";
import { useState } from "react";

export function TablaMarca({
  data,
  SetopenRegistro,
  setdataSelect,
  setAccion,
}) {
  const [pagina, setPagina] = useState(1);
  const { eliminarMarca } = useMarcaStore();

  const editar = (data) => {
    if (data.descripcion === "Generica") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Este registro no se permite modificar ya que es valor por defecto.",
        confirmButtonColor: v.colorError,
      });
      return;
    }
    SetopenRegistro(true);
    setdataSelect(data);
    setAccion("Editar");
  };

  const eliminar = (p) => {
    if (p.descripcion === "Generica") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Este registro no se permite eliminar ya que es valor por defecto.",
        confirmButtonColor: v.colorError,
      });
      return;
    }
    Swal.fire({
      title: "¿Estás seguro(a)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: v.colorError,
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarMarca({ id: p.id });
      }
    });
  };

  const columns = [
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "acciones",
      header: "Acciones",
      cell: (info) => (
        <ContentAccionesTabla
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
        pageSize: 5, // Mostrar 5 filas por página
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

// MEJORA: Estilos modernos y limpios para la tabla y su contenedor.
const Container = styled.div`
  background-color: ${({ theme }) => theme.bgcards};
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
  
  .table-responsive {
    overflow-x: auto; /* Permite scroll horizontal en pantallas pequeñas */
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
