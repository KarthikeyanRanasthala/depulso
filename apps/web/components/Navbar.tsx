import {
  Navbar as NextUINavbar,
  Link,
  Text,
  Avatar,
  Dropdown,
  Button,
} from "@nextui-org/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { default as NextLink } from "next/link";

const collapseItems = ["Features", "Docs", "GitHub"];

// @todo: add error state

const Navbar = () => {
  const user = useUser();

  const client = useSupabaseClient();
  const onLogin = async () => {
    await client.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `http://${window.location.origin}/dashboard/` },
    });
  };

  const handleDropdownAction = async (actionName: string) => {
    if (actionName === "logout") {
      const { error } = await client.auth.signOut();
    }
  };

  return (
    <NextUINavbar isBordered variant="sticky" maxWidth="fluid">
      <NextUINavbar.Toggle showIn="xs" />
      <NextUINavbar.Brand
        css={{
          "@xs": {
            w: "12%",
          },
        }}
      >
        <Text b color="inherit" size="$xl">
          Depulso
        </Text>
      </NextUINavbar.Brand>
      <NextUINavbar.Content
        enableCursorHighlight
        activeColor="secondary"
        hideIn="xs"
        variant="highlight-rounded"
      >
        <NextUINavbar.Link isActive href="#">
          Features
        </NextUINavbar.Link>
        <NextUINavbar.Link href="#">Docs</NextUINavbar.Link>
        <NextUINavbar.Link href="#">Github</NextUINavbar.Link>
      </NextUINavbar.Content>
      <NextUINavbar.Content
        css={{
          "@xs": {
            w: "12%",
            jc: "flex-end",
          },
        }}
      >
        {user ? (
          <Dropdown placement="bottom-right">
            <NextUINavbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="secondary"
                  size="md"
                  src={user?.user_metadata?.avatar_url}
                />
              </Dropdown.Trigger>
            </NextUINavbar.Item>
            <Dropdown.Menu
              aria-label="User menu actions"
              color="secondary"
              onAction={(actionKey) =>
                handleDropdownAction(actionKey as string)
              }
            >
              <Dropdown.Item key="profile" css={{ height: "$18" }}>
                <Text b color="inherit" css={{ d: "flex" }}>
                  Signed in as
                </Text>
                <Text
                  b
                  color="inherit"
                  css={{
                    d: "flex",
                  }}
                >
                  {user?.user_metadata?.name || user.email}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="dashboard" withDivider>
                <NextLink href={"/dashboard"}>
                  <Text b>Dashboard</Text>
                </NextLink>
              </Dropdown.Item>
              <Dropdown.Item key="logout" color="error">
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button onClick={onLogin} color={"secondary"}>
            Login
          </Button>
        )}
      </NextUINavbar.Content>
      <NextUINavbar.Collapse>
        {collapseItems.map((item) => (
          <NextUINavbar.CollapseItem key={item} activeColor="secondary">
            <Link
              color="inherit"
              css={{
                minWidth: "100%",
              }}
              href="#"
            >
              {item}
            </Link>
          </NextUINavbar.CollapseItem>
        ))}
      </NextUINavbar.Collapse>
    </NextUINavbar>
  );
};

export default Navbar;
