import {
  Text,
  ActionIcon,
  Flex,
  Menu as MantineMenu,
  Button,
  Title,
  Grid,
  Badge,
  Card,
  Group,
  Image,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useApi } from "@/utility/api";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { AtomsContainer } from "@/Components/Atoms";

export default function Menu() {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [menu, setMenu] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);
  useEffect(() => {
    (async function fetchData() {
      try {
        setMainLoading(true);
        const $resp = await useApi.get(`/menu`);
        setMenu($resp.result);
        console.log($resp.result);
      } finally {
        setMainLoading(false);
      }
    })();
  }, []);
  return (
    <>
      <AtomsContainer size="100%" p={0} pl={25}>
        <Flex justify="flex-start" align="center" gap={25}>
          <Title order={3}>Daftar Menu</Title>

          <Button
            compact
            variant="light"
            onClick={() => $navigate("/admin/menu/daftar")}
          >
            Tambah Menu
          </Button>
        </Flex>

        {!mainLoading && menu ? (
          //   menu.map((user, idx) => (
          //     <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
          //       <Flex
          //         gap={25}
          //         direction={$isMobile ? "column" : "row"}
          //         align={$isMobile ? "flex-start" : "center"}
          //       >
          //         <Avatar radius="xl" size="lg" src={user.avatar} />
          //         <div>
          //           <Text weight={700}>
          //             {user.name} {user.roles ? `(${user.roles})` : ""}
          //           </Text>
          //           <Text underline color="blue">
          //             {user.email}
          //           </Text>
          //         </div>
          //         <Button
          //           fullWidth={$isMobile}
          //           ml="auto"
          //           onClick={() => $navigate(`/admin/user/${user.id}`)}
          //         >
          //           Edit
          //         </Button>
          //       </Flex>
          //     </Paper>
          //   ))
          <Grid
            direction="column"
            py=".5rem"
            my="0"
            gutter="xl"
            justify="flex-start"
          >
            {menu.map((item, idx) => (
              <Grid.Col key={idx} span={$isMobile ? 12 : 4}>
                <Card shadow="sm" p="lg" h="100%">
                  <Card.Section
                    component="a"
                    // href="https://mantine.dev"
                    // target="_blank"
                  >
                    <Image
                      withPlaceholder
                      src={item.picture}
                      height={160}
                      alt="Gambar Menu"
                    />
                  </Card.Section>

                  <Group
                    position="apart"
                    style={{ marginBottom: 5, marginTop: "25px" }}
                  >
                    <Flex justify="space-between" align="center" w="100%">
                      <Badge color="brand" variant="light">
                        {item.qty > 0 ? "Tersedia" : "Tidak Tersedia"}
                      </Badge>
                      <div>
                        <MantineMenu width={200} shadow="md">
                          <MantineMenu.Target>
                            <ActionIcon>
                              <i className="ri-more-2-fill ri-lg"></i>
                            </ActionIcon>
                          </MantineMenu.Target>

                          <MantineMenu.Dropdown>
                            <MantineMenu.Item
                              onClick={() =>
                                $navigate(`/admin/menu/${item.id}`)
                              }
                            >
                              Edit
                            </MantineMenu.Item>
                            <MantineMenu.Item>Nonaktifkan</MantineMenu.Item>
                          </MantineMenu.Dropdown>
                        </MantineMenu>
                      </div>
                    </Flex>
                    <div>
                      <Text weight={700}>{item.name}</Text>
                      <Text
                        underline
                        color="blue"
                        size="sm"
                        style={{ lineHeight: 1.5 }}
                      >
                        {item.mitra || "-"}
                      </Text>
                      <Text size="xs">Stok : {item.qty || 0}</Text>
                    </div>
                  </Group>
                  <br />
                  <Text size="sm" style={{ lineHeight: 1.5 }}>
                    {item.desc || "Tidak ada keterangan"}
                  </Text>
                  <br />
                  {/* <div>
                      <Button
                        style={{ marginTop: "auto !important" }}
                        onClick={() => $navigate(`/admin/menu/${item.id}`)}
                        variant="light"
                        fullWidth
                      >
                        Edit Menu
                      </Button>
                      <Button color="red" fullWidth style={{ marginTop: 14 }}>
                        Nonaktifkan
                      </Button>
                    </div> */}
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Text mt="md">Loading...</Text>
        )}
      </AtomsContainer>
    </>
  );
}
