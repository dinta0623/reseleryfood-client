import {
  Text,
  Paper,
  Flex,
  Avatar,
  Group,
  Button,
  Title,
  Pagination,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useApi } from "@/utility/api";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

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
      //
    })();
  }, []);
  return (
    <>
      <br />
      <Title order={2}>Daftar Transaksi</Title>

      {!mainLoading && users ? (
        <>
          {users.map((user, idx) => (
            <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
              <Flex
                gap={25}
                direction={$isMobile ? "column" : "row"}
                align={$isMobile ? "flex-start" : "center"}
              >
                {/* <Avatar radius="xl" size="lg" src={user.avatar} /> */}
                <div>
                  <Text weight={700}>Transaksi 20-06-2023</Text>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Neque impedit eaque explicabo odit. Odit voluptatibus
                  </Text>
                </div>
                <Group ml="auto">
                  <Button
                    variant="light"
                    fullWidth={$isMobile}
                    onClick={() => $navigate(`/admin/user/${user.id}`)}
                  >
                    Cetak
                  </Button>
                  <Button
                    fullWidth={$isMobile}
                    ml="auto"
                    onClick={() => $navigate(`/admin/user/${user.id}`)}
                  >
                    Edit
                  </Button>
                </Group>
              </Flex>
            </Paper>
          ))}
          <br />
          <Pagination total={10} mt="xl" />
        </>
      ) : (
        <Text mt="md">Loading...</Text>
      )}
    </>
  );
}
