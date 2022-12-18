import { Container, Text } from "@nextui-org/react";
import Image from "next/image";

const HeroComponent = () => {
  return (
    <>
      <Container
        css={{ padding: "24px 0" }}
        direction="column"
        display="flex"
        alignItems="center"
      >
        <Text
          h1
          size={60}
          css={{
            textGradient: "45deg, $blue600 -10%, $pink600 100%",
            textTransform: "capitalize",
            margin: 0,
            textAlign: "center",
          }}
          weight="bold"
        >
          Deploy your
        </Text>
        <Text
          h1
          size={60}
          css={{
            textGradient: "45deg, $purple600 -10%, $pink600 100%",
            textTransform: "capitalize",
            margin: 0,
            textAlign: "center",
          }}
          weight="bold"
        >
          Static Site
        </Text>
        <Text
          h1
          size={60}
          css={{
            textGradient: "45deg, $yellow600 -20%, $red600 100%",
            textTransform: "capitalize",
            margin: 0,
            textAlign: "center",
          }}
          weight="bold"
        >
          in Seconds
        </Text>
      </Container>
      <Text size={"$lg"} css={{ textAlign: "center" }}>
        Easy, one command deployments with free{" "}
        <Text css={{ fontWeight: "$extrabold" }} b>
          depulso.site
        </Text>{" "}
        subdomains.
      </Text>

      <Container
        css={{ mt: "$16", gap: "8px" }}
        direction="row"
        display="flex"
        justify="center"
        alignItems="center"
      >
        <Text size={"$lg"} css={{ textAlign: "center" }}>
          Built with
        </Text>
        <Image
          alt="supabase logo"
          src={
            "https://supabase.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-logo-wordmark--dark.53d797e9.png&w=384&q=75"
          }
          unoptimized
          width={120}
          height={24}
        />
      </Container>
    </>
  );
};

export default HeroComponent;