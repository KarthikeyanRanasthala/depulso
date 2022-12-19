import React, { useEffect, useState } from "react";
import { Button, Container } from "@nextui-org/react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";

import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/Modal";
import { useRouter } from "next/router";

const Dashboard = () => {
  const client = useSupabaseClient();
  const { isLoading, session } = useSessionContext();
  const router = useRouter();

  if (!isLoading && !session) {
    router.push("/");
  }

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
      <Container
        css={{
          maxWidth: "1200px",
          margin: "auto",
          p: "24px",
          minHeight: "calc(100vh - 142px)",
          display: "flex",
          gap: "24px",
          flexDirection: "column",
        }}
      >
        <Button
          color="gradient"
          auto
          bordered
          shadow
          onClick={handleModal}
          css={{ zIndex: 1, alignSelf: "flex-end" }}
        >
          Create new project
        </Button>

        <Container
          css={{
            display: "flex",
            gap: "16px",
            flexDirection: "column",
            padding: 0,
            maxWidth: "100%",
            "@xsMin": {
              flexDirection: "row",
            },
          }}
        >
          {deployments?.map((el) => (
            <ProjectCard
              key={el.name}
              name={el.name}
              getDeployments={getDeployments}
            />
          ))}
        </Container>
      </Container>

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
