import styled from "styled-components";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components/organismos/sidebar/Sidebar";
import { MenuHambur } from "../components/organismos/MenuHambur";
import { Device } from "../styles/breackpoints";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { ErrorMolecula } from "../components/moleculas/ErrorMolecula";
import { useState } from "react";
import { v } from "../styles/variables"; // Importar variables para consistencia

export function Layout({children}){
  
  const { mostrarUsuarios,idusuario,mostrarpermisos } = useUsuariosStore();
  const [sidebarOpen, setSidebarOpen] = useState(true); // MEJORA: Inicia abierta por defecto en desktop
  const {mostrarEmpresa} = useEmpresaStore()

  // Las queries de React Query se mantienen igual
  const { data:datausuarios, isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: mostrarUsuarios,
  });
  const {data:dataempresa}=useQuery({queryKey:["mostrar empresa"],queryFn:()=>mostrarEmpresa({idusaurio:idusuario}),enabled:!!datausuarios})
  const {data:datapermisos}=useQuery({queryKey:["mostrar permisos",{id_usuario:idusuario}],queryFn:()=>mostrarpermisos({id_usuario:idusuario}),enabled:!!datausuarios})

  if (isLoading){
    return <SpinnerLoader/>
  }
  if(error){
    return <ErrorMolecula mensaje={error.message}/>
  }
    return(
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
        <ContainerBody>
            {children}
        </ContainerBody>
      </Container>
    )
}

const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  background-color: ${({ theme }) => theme.bgtotal};
  min-height: 100vh; // Asegura que el layout ocupe toda la altura de la pantalla
  
  .ContentSidebar {
    display: none;
  }
  .ContentMenuambur {
    display: block;
    position: fixed; // MEJORA: Fija el menú hamburguesa para que no se mueva con el scroll
    top: 15px;
    left: 20px;
    z-index: 101; // Se asegura que esté por encima del contenido
  }

  @media ${Device.tablet} {
    /* MEJORA: Transición suave para la expansión/contracción de la sidebar */
    transition: grid-template-columns 0.3s ease-in-out; 
    grid-template-columns: ${v.sidebarWidthInitial}; /* Usa variables para el ancho */
    &.active {
      grid-template-columns: ${v.sidebarWidth};
    }
    .ContentSidebar {
      display: initial;
    }
    .ContentMenuambur {
      display: none;
    }
  }
`;

const ContainerBody = styled.div `
  grid-column: 1;
  width: 100%;
  /* MEJORA: Añade un padding global a todas las páginas */
  padding: ${v.lgSpacing}; 
  
  @media ${Device.tablet}{
    grid-column: 2;
  }
`
