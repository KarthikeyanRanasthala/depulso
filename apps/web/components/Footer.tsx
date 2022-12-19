import { Container } from "@nextui-org/react";
import Image from "next/image";

const Footer = () => {
  return (
    <Container
      css={{
        padding: "12px",
        textAlign: "center",
      }}
    >
      <a
        href="https://github.com/KarthikeyanRanasthala/depulso"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          style={{ filter: "invert(1)" }}
          alt="github icon"
          src={"/github-icon.png"}
          height={36}
          width={36}
        />
      </a>
    </Container>
  );
};

export default Footer;
