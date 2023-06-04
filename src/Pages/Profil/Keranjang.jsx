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
        <Title order={3}>Keranjang Anda</Title>

        {!mainLoading && users ? (
          <>
            {users.map((user, idx) => (
              <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
                <Flex
                  gap={25}
                  direction={$isMobile ? "column" : "row"}
                  align={$isMobile ? "flex-start" : "center"}
                >
                  <Avatar
                    radius="md"
                    size="xl"
                    src="https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/47918e8b-9ab7-46b0-9d63-2920cc251ab9_Go-Biz_20210908_120627.jpeg"
                  />
                  <div>
                    <Text weight={700}>Mie goreng</Text>
                    <Text>Pukul ####</Text>
                  </div>
                  <Button
                    fullWidth={$isMobile}
                    ml="auto"
                    onClick={() => $navigate(`/admin/user/${user.id}`)}
                  >
                    Detail
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
      </AtomsContainer>
    </>
  );
}
