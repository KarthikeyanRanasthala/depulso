import { Container } from "@nextui-org/react";

import HeroComponent from "../components/homepage/HeroComponent";
import Instructions from "../components/homepage/Instructions";

const HomePage = () => {
  return (
    <Container css={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <HeroComponent />
      <Instructions />
    </Container>
  );
};

export default HomePage;
