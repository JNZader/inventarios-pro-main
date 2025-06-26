/* eslint-disable no-unused-vars */
import styled, { keyframes } from "styled-components"; // Se importa keyframes
import { BtnSave } from "../moleculas/BtnSave";
import { v } from "../../styles/variables";
import { useAuthStore } from "../../store/AuthStore";
import { Device } from "../../styles/breackpoints";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import carrito from "../../assets/carrito.svg";
import logo from "../../assets/inventarioslogo.png";
import { MdOutlineInfo } from "react-icons/md";
import { ThemeContext } from "../../App";
import { InputText } from "../organismos/formularios/InputText";
import { RegistrarAdmin } from "../organismos/formularios/RegistrarAdmin";
import { FooterLogin } from "../FooterLogin";

export function LoginTemplate() {
  const { setTheme } = useContext(ThemeContext);
  useEffect(() => {
    setTheme("light");
  }, [setTheme]); // Se agrega setTheme como dependencia para evitar warnings

  const { signInWithEmail } = useAuthStore();
  const [state, setState] = useState(false);
  const [stateInicio, setStateInicio] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  async function iniciar(data) {
    const response = await signInWithEmail({
      correo: data.correo,
      pass: data.pass,
    });
    if (response) {
      navigate("/");
    } else {
      setStateInicio(true);
    }
  }

  return (
    <Container>
      <div className="contentLogo">
        <img src={logo} alt="Logo StockPRO" />
        <span>StockPRO</span>
      </div>
      <div className="bannerlateral">
        <img src={carrito} alt="Ilustración de carrito de compras" />
      </div>

      <div className="contentCard">
        <div className="card">
          {state && <RegistrarAdmin setState={() => setState(!state)} />}
          <Titulo>StockPRO</Titulo>
          {stateInicio && (
            <TextoStateInicio>Datos incorrectos</TextoStateInicio>
          )}
          <span className="ayuda">
            Puedes crear una cuenta nueva ó <br></br>solicitar a tu empleador
            una. <MdOutlineInfo />
          </span>
          <p className="frase">Controla tu inventario.</p>
          <form onSubmit={handleSubmit(iniciar)}>
            <InputText icono={<v.iconoemail />}>
              <input
                className="form__field"
                type="text"
                placeholder="email"
                {...register("correo", {
                  required: true,
                })}
              />
              <label className="form__label">Email</label>
              {errors.correo?.type === "required" && <p>Campo requerido</p>}
            </InputText>
            <InputText icono={<v.iconopass />}>
              <input
                className="form__field"
                type="password"
                placeholder="contraseña"
                {...register("pass", {
                  required: true,
                })}
              />
              <label className="form__label">Contraseña</label>
              {errors.pass?.type === "required" && <p>Campo requerido</p>}
            </InputText>
            <ContainerBtn>
              <BtnSave titulo="Iniciar" bgcolor="#007BFF" />
              <BtnSave
                funcion={() => setState(!state)}
                titulo="Crear cuenta"
                bgcolor="#ffffff"
              />
            </ContainerBtn>
          </form>
        </div>
        <FooterLogin />
      </div>
    </Container>
  );
}

// MEJORA: Animación de fondo sutil
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* MEJORA: Fondo con gradiente animado para un look más dinámico */
  background: linear-gradient(-45deg, #1A202C, #2D3748, #4A5568, #2D3748);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  
  @media ${Device.tablet} {
    grid-template-columns: 1fr 2fr;
  }

  .contentLogo {
    position: absolute;
    top: 20px;
    left: 20px;
    font-weight: 700;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    z-index: 2;

    img {
      width: 50px;
      height: 50px;
    }
  }

  .bannerlateral {
    /* MEJORA: Gradiente para el banner lateral */
    background: linear-gradient(to top, #005f9e, #007BFF);
    height: 100vh;
    display: none; /* Se oculta en móvil */
    align-items: center;
    justify-content: center;
    
    @media ${Device.tablet} {
      display: flex; /* Se muestra en tablet y superior */
    }

    img {
      width: 70%;
      max-width: 400px;
      /* MEJORA: Animación más sutil */
      animation: flotar 3s ease-in-out infinite alternate;
    }
  }

  .contentCard {
    grid-column: 1; /* Ocupa toda la pantalla en móvil */
    background-color: rgba(255, 255, 255, 0.95); /* MEJORA: Ligera transparencia */
    backdrop-filter: blur(5px); /* Efecto de desenfoque para el fondo */
    position: relative;
    gap: 20px;
    display: flex;
    padding: 20px;
    height: 100%;
    width: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: center; /* Centrado vertical */

    @media ${Device.tablet} {
      grid-column: 2; /* Ocupa la segunda columna en tablet */
      justify-content: space-between; /* Espacio para el footer */
    }

    .card {
      padding: 20px;
      border-radius: 15px;
      width: 100%;
      max-width: 400px; /* Ancho máximo para el formulario */
    }

    .frase {
      color: #0056b3; /* Azul más oscuro para la frase */
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 30px;
    }

    .ayuda {
      position: absolute;
      top: 20px;
      right: 20px;
      color: #6c757d;
      font-size: 14px;
      font-weight: 400;
    }
  }

  /* MEJORA: Animación de flotar más suave */
  @keyframes flotar {
    0% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(-20px);
    }
  }
`;

const Titulo = styled.h1` /* Cambiado a h1 por semántica */
  font-size: 2.5rem;
  font-weight: 700;
  color: #1C3F5F;
  margin-bottom: 8px;
`;

const ContainerBtn = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  gap: 15px; /* Espacio entre botones */
`;

const TextoStateInicio = styled.p`
  color: #D9534F; /* Un rojo más estándar para errores */
  background-color: rgba(217, 83, 79, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
  font-weight: 500;
`;
