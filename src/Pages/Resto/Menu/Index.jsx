import {
  Text,
  Paper,
  Flex,
  Avatar,
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
import { useSelector } from "react-redux";

export default function Users() {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [menu, setMenu] = useState(null);
  const $mitra = useSelector((state) => state.mitra);

  const [mainLoading, setMainLoading] = useState(false);
  useEffect(() => {
    if ($mitra)
      (async function fetchData() {
        try {
          setMainLoading(true);
          const $query = `SELECT * FROM menu WHERE mitra_id = '${$mitra.id}'`;
          const $resp = await useApi.get(`/menu/q/${$query}`);
          if ($resp.success) setMenu($resp.result);
          console.log(menu);
        } catch (error) {
          // console.log(error);
        } finally {
          setMainLoading(false);
        }
      })();
  }, []);
  return (
    <>
      <AtomsContainer size="100%" p={0}>
        <br />
        <Flex justify="space-between" align="center">
          <Title order={2}>Daftar Menu</Title>

          <Button
            variant="light"
            onClick={() => $navigate("/resto/menu/daftar")}
          >
            Tambah Menu
          </Button>
        </Flex>

        {!mainLoading && menu ? (
          //   users.map((user, idx) => (
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
                <Card shadow="sm" p="lg">
                  <Card.Section
                    component="a"
                    // href="https://mantine.dev"
                    // target="_blank"
                  >
                    <Image
                      width="100%"
                      height={250}
                      src={item?.picture}
                      alt="Random image"
                      withPlaceholder
                    />
                  </Card.Section>

                  <Group
                    position="apart"
                    style={{ marginBottom: 5, marginTop: "25px" }}
                  >
                    <Text weight={700}>{item.name}</Text>
                    <Badge color="brand" variant="light">
                      Status
                    </Badge>
                  </Group>
                  <br />
                  <Text size="sm" style={{ lineHeight: 1.5 }}>
                    {item.desc}
                  </Text>

                  <Button
                    onClick={() => $navigate(`/resto/menu/${item.id}`)}
                    variant="light"
                    fullWidth
                    style={{ marginTop: 14 }}
                  >
                    Edit Menu
                  </Button>
                  {!item.disable && (
                    <Button color="red" fullWidth style={{ marginTop: 14 }}>
                      Nonaktifkan
                    </Button>
                  )}
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
