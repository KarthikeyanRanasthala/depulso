import { Button, Input, Loading, Modal, Row, Text } from "@nextui-org/react";
import { useSession } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  handleModal: () => void;
  modalVisiblity: boolean;
}

const CreateProjectModal: React.FC<Props> = (props) => {
  const [suggestion, setSuggestion] = useState("");
  const session = useSession();
  const [name, setName] = useState("");

  const getProjectNameSuggestion = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/projects/suggestion`,
        {
          headers: {
            authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      setSuggestion(data?.suggestion || "");
    } catch (err) {
      debugger;
      setSuggestion("");
    }
  };

  useEffect(() => {
    if (props.modalVisiblity) getProjectNameSuggestion();

    return () => {
      setSuggestion("");
    };
  }, [props.modalVisiblity]);

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={props.modalVisiblity}
      blur
      onClose={props.handleModal}
    >
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
          labelRight={<Loading color={"secondary"} size="sm" />}
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
        <Button color="secondary" auto onClick={props.handleModal}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateProjectModal;
