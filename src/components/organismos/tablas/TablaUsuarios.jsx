import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import styled from "styled-components";
import Swal from "sweetalert2";
import { FaArrowsAltV } from "react-icons/fa";
import { useState } from "react";
import { ContentAccionesTabla } from "../ContentAccionesTabla";
import { Paginacion } from "../tablas/Paginacion";
import { v } from "../../../styles/variables";
import { useUsuariosStore } from "../../../store/UsuariosStore";

// MEJORA: Componente para mostrar el estado y tipo de usuario con píldoras de colores
const StatusPill = styled.div`
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

export function TablaUsuarios({
  data,
  SetopenRegistro,
  setdataSelect,
  setAccion,
}) {
  const [pagina, setPagina] = useState(1);
  const { eliminarusuarios } = useUsuariosStore();

  const editar = (data) => {
    if (data.tipouser === "superadmin") {
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
    if (p.tipouser === "superadmin") {
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
        await eliminarusuarios({ id: p.id });
      }
    });
  };

  const columns = [
    {
      accessorKey: "nombres",
      header: "Nombres",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "tipouser",
      header: "Tipo Usuario",
      cell: (info) => {
        const tipo = info.getValue();
        const color = tipo === "superadmin" ? v.colorSecundario : "#6c757d";
        const textColor = tipo === "superadmin" ? "#000" : "#fff";
        return <StatusPill color={color} style={{color: textColor}}>{tipo}</StatusPill>;
      }
    },
    {
      accessorKey: "estado",
      header: "Estado",
      enableSorting: false,
      cell: (info) => {
        const estado = info.getValue();
        const color = estado === 'activo' ? v.colorIngresos : v.colorError;
        return <StatusPill color={color}>{estado}</StatusPill>;
      }
    },
    {
      accessorKey: "acciones",
      header: "Acciones",
      enableSorting: false,
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
          pageSize: 5,
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
