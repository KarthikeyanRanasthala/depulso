import { Button, Card, Grid, Link, Loading, Text } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

interface Props {
  getDeployments: () => Promise<void>;
  name: string;
}

const ProjectCard: React.FC<Props> = (props) => {
  const { name, getDeployments } = props;

  const [isDeleting, setDeleting] = useState(false);

  const handleDelete = async (name: string) => {
    try {
      setDeleting(true);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/projects?name=${name}`
      );

      await getDeployments();
      setDeleting(false);
    } catch (err) {}
  };

  return (
    <Card css={{ mw: "400px" }} variant="bordered">
      <Card.Header>
        <Grid.Container wrap="wrap">
          <Grid xs={12}>
            <Grid.Container justify="space-between">
              <Grid>
                <Text h4 css={{ lineHeight: "$xs" }}>
                  {name}
                </Text>
              </Grid>
              <Grid>
                <Link block color="text" css={{ p: "$4" }}>
                  <a
                    style={{ height: "18px", width: "18px" }}
                    href={`https://${name}.depulso.app`}
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
            <Text css={{ color: "$accents8" }}>{name}.depulso.app</Text>
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
          onPress={() => handleDelete(name)}
        >
          {isDeleting ? <Loading size="sm" color="white" /> : "Delete"}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ProjectCard;
