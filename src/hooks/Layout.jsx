import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components/organismos/sidebar/Sidebar";
import { MenuHambur } from "../components/organismos/MenuHambur";
import { Device } from "../styles/breackpoints";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { ErrorMolecula } from "../components/moleculas/ErrorMolecula";
import { useState } from "react";
import { v } from "../styles/variables";
import { RegistrarUsuarios } from "../components/organismos/formularios/RegistrarUsuarios";

export function Layout({ children }) {
  const {
    mostrarUsuarios,
    idusuario,
    mostrarpermisos,
    isEditProfileOpen,
    closeEditProfile,
    perfilUsuario,
  } = useUsuariosStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { mostrarEmpresa } = useEmpresaStore();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { data: datausuarios, isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: mostrarUsuarios,
  });
  const { data: dataempresa } = useQuery({
    queryKey: ["mostrar empresa", { idusaurio: idusuario }],
    queryFn: () => mostrarEmpresa({ idusaurio: idusuario }),
    enabled: !!datausuarios,
  });
  const { data: datapermisos } = useQuery({
    queryKey: ["mostrar permisos", { id_usuario: idusuario }],
    queryFn: () => mostrarpermisos({ id_usuario: idusuario }),
    enabled: !!datausuarios,
  });

  if (isLoading) {
    return <SpinnerLoader />;
  }
  if (error) {
    return <ErrorMolecula mensaje={error.message} />;
  }
  return (
    <>
      {isEditProfileOpen && (
        <RegistrarUsuarios
          onClose={closeEditProfile}
          dataSelect={perfilUsuario}
          accion="Editar"
        />
      )}
      <Container className={sidebarOpen ? "active" : ""}>
        <section className="ContentSidebar">
          <Sidebar
            state={sidebarOpen}
            setState={() => setSidebarOpen(!sidebarOpen)}
          />
        </section>
        <section className="ContentMenuambur">
          <MenuHambur />
        </section>
        <ContainerBody>{children}</ContainerBody>
      </Container>
    </>
  );
}

const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  background-color: ${({ theme }) => theme.bgtotal};
  min-height: 100vh;

  .ContentSidebar {
    display: none;
  }

  .ContentMenuambur {
    display: block;
    position: fixed;
    top: 15px;
    left: 20px;
    z-index: 101;
  }

  @media ${Device.tablet} {
    transition: grid-template-columns 0.3s ease-in-out;
    &.active {
      grid-template-columns: ${v.sidebarWidth};
    }
    grid-template-columns: ${v.sidebarWidthInitial};
    
    .ContentSidebar {
      display: initial;
    }
    
    .ContentMenuambur {
      display: none;
    }
  }
`;

const ContainerBody = styled.div`
  grid-column: 1;
  width: 100%;
  padding: ${v.lgSpacing};
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media ${Device.tablet} {
    grid-column: 2;
  }
`;