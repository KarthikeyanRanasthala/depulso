import {
  Navbar as NextUINavbar,
  Link,
  Text,
  Avatar,
  Dropdown,
} from "@nextui-org/react";

const collapseItems = ["Dashboard", "Log Out"];

const Navbar = () => {
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
        <Dropdown placement="bottom-right">
          <NextUINavbar.Item>
            <Dropdown.Trigger>
              <Avatar
                bordered
                as="button"
                color="secondary"
                size="md"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </Dropdown.Trigger>
          </NextUINavbar.Item>
          <Dropdown.Menu
            aria-label="User menu actions"
            color="secondary"
            onAction={(actionKey) => console.log({ actionKey })}
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                zoey@example.com
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="dashboard" withDivider>
              Dashboard
            </Dropdown.Item>
            <Dropdown.Item key="logout" color="error">
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </NextUINavbar.Content>
      <NextUINavbar.Collapse>
        {collapseItems.map((item, index) => (
          <NextUINavbar.CollapseItem
            key={item}
            activeColor="secondary"
            css={{
              color: index === collapseItems.length - 1 ? "$error" : "",
            }}
            isActive={index === 2}
          >
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
