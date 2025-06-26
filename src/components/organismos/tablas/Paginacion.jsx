import styled from "styled-components";
import { v } from "../../../styles/variables";

export function Paginacion({ table, pagina, maximo, irinicio }) {
  return (
    <Container>
      <button
        className="btn-pag"
        onClick={() => irinicio()}
        disabled={!table.getCanPreviousPage()}
      >
        <v.iconotodos />
      </button>
      <button
        className="btn-pag"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <span className="iconos izquierda">
          <v.iconoflechaderecha />
        </span>
      </button>
      <div className="info-pagina">
        <span>Página</span>
        <strong>
          {pagina} de {maximo}
        </strong>
      </div>
      <button
        className="btn-pag"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        <span className="iconos">
          <v.iconoflechaderecha />
        </span>
      </button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  font-family: 'Poppins', sans-serif;

  .btn-pag {
    background-color: ${({ theme }) => theme.bg3};
    border: 1px solid ${({ theme }) => theme.bg4};
    color: ${({ theme }) => theme.text};
    height: 40px;
    width: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not([disabled]) {
      background-color: ${({ theme }) => theme.primary};
      color: #fff;
      border-color: ${({ theme }) => theme.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 10px -2px rgba(0, 123, 255, 0.5);
    }

    &:disabled {
      background-color: ${({ theme }) => theme.bg4};
      color: ${({ theme }) => theme.text};
      opacity: 0.5;
      cursor: not-allowed;
    }

    .iconos {
      font-size: 1.2em;
      &.izquierda {
        transform: rotate(-180deg);
      }
    }
  }
  
  .info-pagina {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 0.9em;
    color: ${({ theme }) => theme.text};
    
    strong {
        font-weight: 600;
    }
  }
`;
