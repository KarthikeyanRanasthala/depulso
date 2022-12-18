import { Button, Input, Loading, Modal, Row, Text } from "@nextui-org/react";
import { useSession } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  handleModal: () => void;
  modalVisiblity: boolean;
  closeHandler: () => void;
  getDeployments: () => Promise<void>;
}

const CreateProjectModal: React.FC<Props> = (props) => {
  const [suggestion, setSuggestion] = useState("");
  const session = useSession();
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isCreated, setCreated] = useState(false);
  const [isCreating, setCreating] = useState(false);

  const headers = {
    authorization: `Bearer ${session?.access_token}`,
  };

  const getProjectNameSuggestion = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/projects/suggestion`,
        { headers }
      );

      setSuggestion(data?.suggestion || "");
    } catch (err) {
      setSuggestion("");
    }
  };

  const checkAvailability = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/projects/availability?name=${name}`,
        { headers }
      );
      setIsAvailable(data.isAvailable);
      setLoading(false);
    } catch (err) {
      setIsAvailable(false);
      if (isAxiosError(err)) {
        // @todo: show error messages
        console.log(err.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    if (props.modalVisiblity) getProjectNameSuggestion();

    return () => {
      setSuggestion("");
    };
  }, [props.modalVisiblity]);

  const debounced = useDebouncedCallback(() => {
    checkAvailability();
  }, 500);

  const createProject = async () => {
    try {
      setCreating(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/projects`,
        { name },
        { headers }
      );
      setCreating(false);
      setCreated(true);
      setIsAvailable(false);
      await props.getDeployments();
    } catch (err) {}
  };

  useEffect(() => {
    if (name.length > 3) {
      debounced();
    }
  }, [name]);

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={props.modalVisiblity}
      blur
      onClose={() => {
        props.closeHandler();
        setCreated(false);
        setName("");
      }}
    >
      {isCreated ? (
        <>
          <Modal.Header>
            <Text id="modal-title" b size={18}>
              Next steps
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Text>
              Create new file <code>depulso.json</code> in your project
              directory and paste the following content into it.
            </Text>
            <Text size={14}>
              <code>
                {JSON.stringify(
                  {
                    project: name,
                    outputDirectory: "build",
                  },
                  null,
                  2
                )}
              </code>
            </Text>
            <Text>Install Depulso CLI, if you haven't already.</Text>
            <code>npm install -g depulso</code>
            <Text>Login to Depulso CLI.</Text>
            <code>npx depulso login</code>
            <Text>Deploy &nbsp; 🚀🚀</Text>
            <code>npx depulso deploy</code>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="secondary"
              auto
              onClick={() => {
                props.closeHandler();
                setCreated(false);
                setName("");
              }}
            >
              Okay
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Header>
            <Text id="modal-title" b size={18}>
              Create new Project
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Input
              bordered
              fullWidth
              color="secondary"
              size="lg"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              labelRight={
                isLoading ? <Loading color={"secondary"} size="sm" /> : null
              }
            />

            <Row justify="space-between">
              <Text size={14}>
                {suggestion ? (
                  <>
                    Can't think of a name? Try
                    <strong
                      style={{ cursor: "pointer" }}
                      onClick={() => setName(suggestion)}
                    >
                      {" "}
                      {suggestion}
                    </strong>
                  </>
                ) : (
                  <>&nbsp;</>
                )}
              </Text>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={isLoading || !isAvailable}
              color="secondary"
              auto
              onClick={() => {
                createProject();
              }}
            >
              {isCreating ? <Loading color="white" size="sm" /> : "Create"}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default CreateProjectModal;
