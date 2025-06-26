import styled from "styled-components";
import { Header } from "../organismos/Header";
import { useState } from "react";
import { Title } from "../atomos/Title";
import { BannerEmpresa } from "../organismos/BannerEmpresa";
import { v } from "../../styles/variables";

export function HomeTemplate() {
  const [state, setState] = useState(false);

  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      <section className="area1">
        <Title>Tu empresa</Title>
      </section>
      <section className="main">
        <BannerEmpresa />
      </section>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 100px 100px 1fr;
  grid-template-areas:
    "header"
    "area1"
    "main";
  padding: 15px;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.bgtotal};
  color: ${({ theme }) => theme.text};

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }

  .area1 {
    grid-area: area1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .main {
    grid-area: main;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    position: relative;
  }

  @media (max-width: 768px) {
    grid-template-rows: 80px 80px 1fr;
    padding: 10px;
  }
`;