import { Button, Container, Text } from "@nextui-org/react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Link from "next/link";

const LastFold = () => {
  const { session } = useSessionContext();
  const client = useSupabaseClient();

  const onLogin = async () => {
    await client.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `http://${window.location.origin}/dashboard/` },
    });
  };

  return (
    <Container
      css={{ padding: "36px 0", gap: "24px" }}
      display="flex"
      direction="column"
      alignItems="center"
    >
      <Text css={{ textAlign: "center" }} b size={"$4xl"}>
        Begin Your Depulso Journey
      </Text>

      {session ? (
        <Link href={"/dashboard"}>
          <Text
            size={"lg"}
            css={{
              borderRadius: "12px",
              fontWeight: "$bold",
              padding: "8px 16px",
              color: "White",
              boxShadow: "0 4px 14px 0 #571d91",
              bg: "linear-gradient(112deg, #06B7DB -63.59%, #FF4ECD -20.3%, #0072F5 70.46%)",
            }}
          >
            Go to Dashboard
          </Text>
        </Link>
      ) : (
        <Button
          shadow
          size={"lg"}
          color="gradient"
          auto
          css={{ borderRadius: "12px", fontWeight: "$bold" }}
          onClick={onLogin}
        >
          Login with GitHub
        </Button>
      )}
    </Container>
  );
};

export default LastFold;
