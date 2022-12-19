import { Checkbox, Container, Text } from "@nextui-org/react";

const features = [
  "Customizable depulso.site subdomains",
  "Free SSL with every deployment",
  "Quick deployments with CLI",
];

const Features = () => {
  return (
    <Container
      display="flex"
      direction="column"
      css={{
        padding: "24px 0",
        gap: "16px",
        "@xsMin": {
          padding: 0,
          gap: "24px",
        },
      }}
    >
      <Text
        css={{
          textAlign: "center",
          "@xsMin": {
            fontSize: "$5xl",
          },
        }}
        b
        size={"$2xl"}
      >
        Every project on{" "}
        <Text as={"span"} css={{ color: "$secondary" }}>
          Depulso
        </Text>{" "}
        comes with
      </Text>
      <Container
        css={{
          padding: 0,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {features.map((el, i) => (
          <Checkbox key={i} color="secondary" isSelected size="lg">
            <Text
              size={"18px"}
              css={{
                "@xsMin": {
                  fontSize: "24px",
                },
              }}
            >
              {el}
            </Text>
          </Checkbox>
        ))}
      </Container>
    </Container>
  );
};

export default Features;
