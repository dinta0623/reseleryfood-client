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
        const $sql = "SELECT * FROM users WHERE roles LIKE '%kurir%'";
        const $resp = await useApi.get(`/users/q/${$sql}`);
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
      <Flex justify="space-between" align="center">
        <Title order={2}>Daftar Kurir Resto</Title>

        {/* <Button onClick={() => $navigate("/admin/kurir/submit")}>
          Tambah Kurir
        </Button> */}
      </Flex>

      {!mainLoading && users?.length > 0 ? (
        <>
          {users.map((_user, idx) => (
            <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
              <Flex
                gap={25}
                direction={$isMobile ? "column" : "row"}
                align={$isMobile ? "flex-start" : "center"}
              >
                <Avatar radius="xl" size="lg" src={_user.avatar} />
                <div>
                  <Text weight={700}>Kurir {_user.name}</Text>
                  <Text underline color="blue">
                    {_user.email}
                  </Text>
                </div>
                {/* <Button
                  fullWidth={$isMobile}
                  ml="auto"
                  onClick={() => $navigate(`/admin/user/${_user.id}`)}
                >
                  Update Status
                </Button> */}
              </Flex>
            </Paper>
          ))}
          <br />
          <Pagination total={10} mt="xl" />
        </>
      ) : mainLoading ? (
        <Text mt="md">Loading...</Text>
      ) : (
        <Text mt="md">Tidak ada kurir yang ditemukan</Text>
      )}
    </>
  );
}
