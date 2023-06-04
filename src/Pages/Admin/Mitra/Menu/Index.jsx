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

export default function Users() {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [users, setUsers] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);
  useEffect(() => {
    (async function fetchData() {
      try {
        setMainLoading(true);
        const $resp = await useApi.get(`/users`);
        setUsers($resp.result);
      } finally {
        setMainLoading(false);
      }
    })();
  }, []);
  return (
    <>
      <AtomsContainer size="100%" p={0} pl={25}>
        <Flex justify="space-between" align="center">
          <Title order={3}>Daftar Menu</Title>

          <Button
            variant="light"
            onClick={() => $navigate("/admin/menu/daftar")}
          >
            Tambah Menu
          </Button>
        </Flex>

        {!mainLoading && users ? (
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
            justify="center"
          >
            {Array.from({ length: 10 }).map((item, idx) => (
              <Grid.Col key={idx} span={$isMobile ? 12 : 4}>
                <Card shadow="sm" p="lg">
                  <Card.Section
                    component="a"
                    href="https://mantine.dev"
                    target="_blank"
                  >
                    <Image
                      src="https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/5474d317-d794-4ef3-b370-5de2a5fd3f55_Go-Biz_20221226_150811.jpeg?auto=format"
                      height={160}
                      alt="Norway"
                    />
                  </Card.Section>

                  <Group
                    position="apart"
                    style={{ marginBottom: 5, marginTop: "25px" }}
                  >
                    <Text weight={700}>Nasi Campur Mak Odeng</Text>
                    <Badge color="brand" variant="light">
                      Status
                    </Badge>
                  </Group>
                  <br />
                  <Text size="sm" style={{ lineHeight: 1.5 }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Eos labore voluptate aut nesciunt inventore rerum eveniet
                    incidunt eaque perspiciatis.
                  </Text>

                  <Button variant="light" fullWidth style={{ marginTop: 14 }}>
                    Edit Menu
                  </Button>
                  <Button color="red" fullWidth style={{ marginTop: 14 }}>
                    Nonaktifkan
                  </Button>
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
