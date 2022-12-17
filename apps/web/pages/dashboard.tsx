import React, { useEffect, useState } from "react";
import { Grid } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import ProjectCard from "../components/ProjectCard";

const Dashboard = () => {
  const client = useSupabaseClient();
  const [deployments, setDeployments] = useState<Array<{ name: string }>>([]);

  const getDeployments = async () => {
    const { data } = await client.storage.from("deployments").list("");
    setDeployments(data);
  };

  useEffect(() => {
    getDeployments();
  }, []);

  return (
    <Grid.Container
      gap={2}
      justify="center"
      css={{ maxWidth: "1200px", margin: "auto" }}
    >
      {deployments?.map((el) => (
        <Grid xs={4}>
          <ProjectCard name={el.name} />
        </Grid>
      ))}
    </Grid.Container>
  );
};

export default Dashboard;
