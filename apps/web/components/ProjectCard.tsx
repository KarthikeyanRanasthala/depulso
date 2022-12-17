import { Button, Card, Grid, Link, Text } from "@nextui-org/react";
import Image from "next/image";

const ProjectCard: React.FC<{ name: string }> = (props) => {
  return (
    <Card css={{ p: "$6", mw: "400px" }} variant="bordered">
      <Card.Header>
        <Grid.Container wrap="wrap">
          <Grid xs={12}>
            <Grid.Container justify="space-between">
              <Grid>
                <Text h4 css={{ lineHeight: "$xs" }}>
                  {props.name}
                </Text>
              </Grid>
              <Grid>
                <Link block color="text" css={{ p: "$4" }}>
                  <a
                    style={{ height: "18px", width: "18px" }}
                    href={`https://${props.name}.depulso.app`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      style={{ filter: "invert(1)" }}
                      src="/external-link.png"
                      width={18}
                      height={18}
                      alt="link"
                    />
                  </a>
                </Link>
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid xs={12}>
            <Text css={{ color: "$accents8" }}>{props.name}.depulso.app</Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Footer>
        <Button
          light
          color="error"
          bordered
          ghost
          css={{ alignSelf: "flex-start", minWidth: "fit-content" }}
        >
          Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ProjectCard;
