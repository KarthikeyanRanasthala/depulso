import { Card, Container, Text } from "@nextui-org/react";
import CopyablePre from "../CopyablePre";

const Instructions = () => {
  let co = `? Build output directory (framework gets auto-detected):
? Project name (static-in-seconds):`;

  return (
    <>
      <Container
        css={{
          padding: "64px 0 24px",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "@xsMin": {
            padding: "72px 0",
            margin: "24px auto",
            flexDirection: "row",
            gap: "32px",
          },
        }}
      >
        <Card
          css={{
            borderRadius: "8px",
            bg: "Black",
            shadow: "0 0 0 1px #333",
            "@xsMin": {
              width: "calc(50% - 16px)",
            },
          }}
        >
          <Card.Body css={{ gap: "$6" }}>
            <Text>To install the latest version of the Depulso CLI,</Text>
            <CopyablePre label="npm install -g depulso" />
            <Text>Login to the CLI through GitHub,</Text>
            <CopyablePre label="npx depulso login" />
            <Text>Initialize a new depulso project</Text>
            <CopyablePre label="npx depulso init" />
            <CopyablePre label={co} />
            <Text>Deploy 🚀🚀</Text>
            <CopyablePre label="npx depulso deploy" />
          </Card.Body>
        </Card>
        <iframe
          className="video"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/wHNnb_IW4tE"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Container>

      <style jsx>{`
        .video {
          max-width: 100%;
          border-radius: 10px;
          box-shadow: 0 0 0 1px #333;
        }

        @media (min-width: 650px) {
          .video {
            width: calc(50% - 16px);
          }
        }
      `}</style>
    </>
  );
};

export default Instructions;
