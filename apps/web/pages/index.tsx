import { Container } from "@nextui-org/react";
import Features from "../components/homepage/Features";

import HeroComponent from "../components/homepage/HeroComponent";
import Instructions from "../components/homepage/Instructions";
import LastFold from "../components/homepage/LastFold";

const HomePage = () => {
  return (
    <Container css={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <HeroComponent />
      <Instructions />
      <Features />
      <LastFold />
    </Container>
  );
};

export default HomePage;
