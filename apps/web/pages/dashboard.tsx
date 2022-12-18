import React, { useEffect, useState } from "react";
import { Button, Grid } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/Modal";

const Dashboard = () => {
  const client = useSupabaseClient();
  const [deployments, setDeployments] = useState<Array<{ name: string }>>([]);
  const [modalVisiblity, setModalVisiblity] = React.useState(false);

  const handleModal = () => setModalVisiblity(true);

  const closeHandler = () => {
    setModalVisiblity(false);
  };

  const getDeployments = async () => {
    const { data } = await client.storage.from("deployments").list("");
    setDeployments(data);
  };

  useEffect(() => {
    getDeployments();
  }, []);

  return (
    <>
      <Grid.Container
        direction="column"
        gap={1}
        css={{ maxWidth: "1200px", margin: "auto", pt: "24px" }}
      >
        <Grid css={{ alignSelf: "flex-end", pr: "12px" }}>
          <Button color="gradient" flat auto onClick={handleModal}>
            Create new project
          </Button>
        </Grid>
        <Grid>
          <Grid.Container gap={2} justify="center">
            {deployments?.map((el) => (
              <Grid xs={4}>
                <ProjectCard name={el.name} getDeployments={getDeployments} />
              </Grid>
            ))}
          </Grid.Container>
        </Grid>
      </Grid.Container>

      <CreateProjectModal
        handleModal={handleModal}
        modalVisiblity={modalVisiblity}
        closeHandler={closeHandler}
        getDeployments={getDeployments}
      />
    </>
  );
};

export default Dashboard;
