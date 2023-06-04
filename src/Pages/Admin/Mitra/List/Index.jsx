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

export default function Mitra() {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [mitra, setMitra] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);
  useEffect(() => {
    (async function fetchData() {
      try {
        setMainLoading(true);
        const $sql = `SELECT mitra.*, users.name as pic
          FROM mitra
          INNER JOIN users
          ON mitra.user_id = users.id`;
        const $resp = await useApi.get(`/mitra/q/${$sql}`);
        console.log($resp);
        setMitra($resp.result);
      } finally {
        setMainLoading(false);
      }
    })();
  }, []);
  return (
    <>
      <AtomsContainer size="100%" p={0} pl={25}>
        <Title order={3}>Daftar Mitra</Title>

        {!mainLoading && mitra ? (
          <>
            {mitra.map((mt, idx) => (
              <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
                <Flex
                  gap={25}
                  direction={$isMobile ? "column" : "row"}
                  align={$isMobile ? "flex-start" : "center"}
                >
                  <Avatar radius="xl" size="lg" src={mt.logo} />
                  <div>
                    <Text weight={700}>{mt.name}</Text>
                    <Text underline color="blue">
                      {mt.pic} sebagai PIC
                    </Text>
                    <Text>
                      Terdaftar pada{" "}
                      {new Date(mt.created_at).toISOString().slice(0, 10)}
                    </Text>
                  </div>
                  <Button
                    fullWidth={$isMobile}
                    ml="auto"
                    onClick={() => $navigate(`/admin/mitra/${mt.id}`)}
                  >
                    Edit
                  </Button>
                </Flex>
              </Paper>
            ))}
            <br />
            <Pagination total={10} mt="xl" />
            <br />
            <br />
          </>
        ) : (
          <Text mt="md">Loading...</Text>
        )}
      </AtomsContainer>
    </>
  );
}
