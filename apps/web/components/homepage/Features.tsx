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
      css={{ padding: "24px 0", gap: "16px" }}
    >
      <Text css={{ textAlign: "center" }} b size={"$2xl"}>
        Every project on Depulso comes with
      </Text>
      <Container css={{ padding: 0, textAlign: "center" }}>
        {features.map((el, i) => (
          <Checkbox key={i} color="secondary" isSelected>
            <Text size={"18px"}>{el}</Text>
          </Checkbox>
        ))}
      </Container>
    </Container>
  );
};

export default Features;
