import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { v } from "../../styles/variables";
import { Device } from "../../styles/breackpoints";
import { Title } from "../atomos/Title";

export function ReportesTemplate() {
  const reportSections = [
    {
      title: "Stock Actual",
      items: [
        { to: "stock-actual-por-producto", label: "Por producto", icon: <v.iconopie /> },
        { to: "stock-actual-todos", label: "Todos", icon: <v.iconotodos /> },
        { to: "stock-bajo-minimo", label: "Bajo del mínimo", icon: <v.iconostockminimo /> },
      ],
    },
    {
      title: "Entradas y salidas",
      items: [
        { to: "kardex-entradas-salidas", label: "Por producto", icon: <v.iconocalculadora /> },
      ],
    },
    {
      title: "Valorizado",
      items: [
        { to: "inventario-valorado", label: "Todos", icon: <v.iconoprecioventa /> },
      ],
    },
  ];

  return (
    <Container>
      <Header>
        <Title>
          <v.iconoreportes />
          Reportes
        </Title>
      </Header>

      <PageContainer>
        <Sidebar>
          {reportSections.map((section) => (
            <SidebarSection key={section.title}>
              <SidebarTitle>{section.title}</SidebarTitle>
              {section.items.map((item) => (
                <SidebarItem key={item.to} to={item.to}>
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </SidebarItem>
              ))}
            </SidebarSection>
          ))}
        </Sidebar>

        <Content>
          <div className="content-title">
            <h4>Vista Previa del Reporte</h4>
          </div>
          <OutletContainer>
            <Outlet />
          </OutletContainer>
        </Content>
      </PageContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 15px;
  width: 100%;
  min-height: 100vh;
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  margin-bottom: 20px;
  
  h1 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 2.5rem;
  }
`;

const PageContainer = styled.div`
  display: grid;
  flex: 1;
  gap: 20px;
  grid-template-columns: 280px 1fr;

  @media ${Device.tablet} {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background-color: ${({ theme }) => theme.bgcards};
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
  height: fit-content;

  @media ${Device.tablet} {
    order: 1; // En móvil, el sidebar va abajo
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 25px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.bg4};
  color: ${({ theme }) => theme.text};
`;

const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 8px;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  transition: background-color 0.3s, color 0.3s;

  .icon {
    font-size: 1.2em;
  }
  
  .label {
    font-weight: 500;
  }

  &:hover {
    background-color: ${({ theme }) => theme.bgAlpha};
  }

  &.active {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
    font-weight: 600;
    box-shadow: 0 4px 15px -5px ${({ theme }) => theme.primary};
  }
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .content-title {
    h4 {
      font-size: 1.2rem;
      font-weight: 500;
      color: ${({ theme }) => theme.text};
    }
  }

  @media ${Device.tablet} {
    order: 0; // En móvil, el contenido va arriba
  }
`;

const OutletContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgcards};
  border-radius: 15px;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  // Para que el PDFViewer se ajuste al contenedor
  & > div {
    width: 100%;
    height: 100%;
    min-height: 65vh; /* Altura mínima para asegurar visibilidad */
  }
`;