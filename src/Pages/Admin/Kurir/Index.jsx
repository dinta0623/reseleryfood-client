import {
  Text,
  Paper,
  Flex,
  Avatar,
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
      <Title order={2}>Daftar Kurir</Title>

      {!mainLoading && users ? (
        <>
          {users.map((user, idx) => (
            <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
              <Flex
                gap={25}
                direction={$isMobile ? "column" : "row"}
                align={$isMobile ? "flex-start" : "center"}
              >
                <Avatar radius="xl" size="lg" src="" />
                <div>
                  <Text weight={700}>Kurir Pesanan ######</Text>
                  <Text underline color="blue">
                    Proses
                  </Text>
                </div>
                <Button
                  fullWidth={$isMobile}
                  ml="auto"
                  onClick={() => $navigate(`/admin/user/${user.id}`)}
                >
                  Update Status
                </Button>
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
