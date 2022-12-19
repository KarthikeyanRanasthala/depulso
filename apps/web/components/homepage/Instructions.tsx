import { Card, Container, Text } from "@nextui-org/react";

const Instructions = () => {
  return (
    <>
      <Container
        css={{
          padding: "64px 0 24px",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
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
          <Card.Body>
            <code>A hoverable card.</code>
            <Text>A hoverable card.</Text>
            <code>A hoverable card.</code>
          </Card.Body>
        </Card>
        <video
          autoPlay
          className="video"
          src="https://dev.voyage/video.mp4"
        ></video>
      </Container>

      <style jsx>{`
        .video {
          max-width: 100%;
          border-radius: 10px;
          box-shadow: 0 4px 14px 0 #571d91;
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
