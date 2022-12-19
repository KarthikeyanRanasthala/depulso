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
import { useRouter } from "next/router";
import { useState } from "react";

const collapseItems = [
  {
    name: "Home",
    link: "/",
    isTargetBlank: false,
  },
  {
    name: "Features",
    link: "#features",
    isTargetBlank: false,
  },
  {
    name: "GitHub",
    link: "https://github.com/KarthikeyanRanasthala/depulso",
    isTargetBlank: true,
  },
];

// @todo: add error state

const Navbar = () => {
  const user = useUser();
  const router = useRouter();
  const isDashboard = router.asPath === "/dashboard";

  const hash = router.asPath?.split("#")[1] || "";

  const client = useSupabaseClient();
  const onLogin = async () => {
    await client.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/dashboard/` },
    });
  };

  const handleDropdownAction = async (actionName: string) => {
    if (actionName === "logout") {
      await client.auth.signOut();
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <NextUINavbar isBordered variant="sticky" maxWidth="fluid">
      {isDashboard ? null : (
        <NextUINavbar.Toggle
          showIn="xs"
          isSelected={isOpen}
          onChange={handleOpen}
        />
      )}
      <NextUINavbar.Brand
        css={{
          "@xs": {
            w: "12%",
          },
        }}
      >
        <NextLink href="/">
          <Text
            css={{
              fontWeight: "$extrabold",
              letterSpacing: "4px",
              color: "White",
              display: isDashboard ? "block" : "none",
              "@xsMin": {
                display: "block",
              },
            }}
            color="inherit"
            size="24px"
          >
            Depulso
          </Text>
        </NextLink>
      </NextUINavbar.Brand>
      {isDashboard ? null : (
        <NextUINavbar.Content
          enableCursorHighlight
          activeColor="secondary"
          hideIn="xs"
          variant="highlight-rounded"
        >
          <NextLink href="/" legacyBehavior passHref>
            <NextUINavbar.Link isActive={!hash} href="/">
              Home
            </NextUINavbar.Link>
          </NextLink>
          <NextLink href="#features" legacyBehavior passHref>
            <NextUINavbar.Link isActive={hash === "features"} href="#features">
              Features
            </NextUINavbar.Link>
          </NextLink>
          <NextUINavbar.Link
            target={"_blank"}
            rel="noopener noreferrer"
            href="https://github.com/KarthikeyanRanasthala/depulso"
          >
            Github
          </NextUINavbar.Link>
        </NextUINavbar.Content>
      )}
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
          <Button onClick={onLogin} bordered color="gradient" auto shadow>
            <Text css={{ display: "none", "@xsMin": { display: "block" } }}>
              Login with GitHub
            </Text>
            <Text css={{ display: "block", "@xsMin": { display: "none" } }}>
              Login
            </Text>
          </Button>
        )}
      </NextUINavbar.Content>
      {isOpen ? (
        <NextUINavbar.Collapse>
          {collapseItems.map((item) => (
            <NextUINavbar.CollapseItem key={item.name} activeColor="secondary">
              {item.isTargetBlank ? (
                <Link
                  color="inherit"
                  css={{
                    minWidth: "100%",
                  }}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpen}
                >
                  {item.name}
                </Link>
              ) : (
                <NextLink onClick={handleOpen} href={item.link}>
                  <Text size={"18px"} css={{ color: "White" }}>
                    {item.name}
                  </Text>
                </NextLink>
              )}
            </NextUINavbar.CollapseItem>
          ))}
        </NextUINavbar.Collapse>
      ) : null}
    </NextUINavbar>
  );
};

export default Navbar;
