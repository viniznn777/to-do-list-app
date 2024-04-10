import React from "react";
import { toast, Zoom } from "react-toastify";
import Icon from "../assets/images/cookie.png";

export const errorMessage = (string, autoClose = 5000) =>
  toast.error(string, {
    position: "bottom-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    role: "Mensagem de Erro",
  });
export const successMessage = (string, autoClose = 5000) =>
  toast.success(string, {
    position: "bottom-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    role: "Mensagem de sucesso",
  });
export const alertMessage = (string, autoClose = 5000) =>
  toast.warning(string, {
    position: "bottom-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    role: "Mensagem Alerta",
  });
export const infoMessage = (string, autoClose = 5000) =>
  toast.info(string, {
    position: "bottom-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    role: "Mensagem de informação",
  });

export const cookieMessagee = () =>
  toast.info(
    "Usamos Cookies para personalizar sua experiência. Ao continuar a visitar este site você concorda com o uso de Cookies.",
    {
      position: "bottom-left",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 1,
      theme: "colored",
      transition: Zoom,
      role: "Mensagem de informação do uso de Cookies",
      icon: ({ theme, type }) => <img src={Icon} className="img-fluid" />,
    }
  );

export const cookieMessage = () =>
  toast.info(
    <>
      Usamos Cookies para personalizar sua experiência. Ao continuar a visitar
      este site você concorda com o uso de Cookies.{" "}
      <a
        href="https://cookiepedia.co.uk/"
        style={{
          color: "#fff",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Saiba mais sobre a Política de Privacidade dos Cookies
      </a>
    </>,
    {
      position: "bottom-left",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 1,
      theme: "colored",
      transition: Zoom,
      role: "Mensagem de informação do uso de Cookies",
      icon: ({ theme, type }) => <img src={Icon} className="img-fluid" />,
    }
  );
