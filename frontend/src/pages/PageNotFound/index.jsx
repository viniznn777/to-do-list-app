import React from "react";
import { colors } from "../../utils/Colors";
import PageNotFoundImg from "../../assets/images/page-not-found.svg";
import { Container } from "./styles";
import BackButton from "../../components/BackButton";

const PageNotFound = () => {
  return (
    <Container className="container">
      <p
        className="fs-1 text-center mt-4 fw-bold"
        style={{ color: `${colors.darkBlue}` }}
      >
        Parece que não encontramos esta página :(
      </p>
      <br />
      <img
        src={PageNotFoundImg}
        alt="Desculpe! Não conseguimos localizar esta página :("
        draggable="false"
      />
      <p className="fs-5 fw-bold text-center">Voltar</p>
      <BackButton where={"/"} />
    </Container>
  );
};

export default PageNotFound;
