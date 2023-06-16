import {
  Text,
  Paper,
  Flex,
  Avatar,
  Group,
  Button,
  Title,
  Pagination,
  Accordion,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useApi } from "@/utility/api";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { $addSeparator } from "../../utility/separator";
import { statusTransaksi } from "../../utility/types";

export default function RiwayatTransaksi() {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const $user = useSelector((state) => state?.user);
  const [mainLoading, setMainLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    (async function fetchData() {
      try {
        setMainLoading(true);
        if ($user.id) {
          const $sql = `SELECT * FROM transaksi WHERE user_id = '${$user.id}'`;
          const $resp = await useApi.get(`/transaksi/q/${$sql}`);
          console.log($resp);
          if ($resp?.success) {
            setTransaction($resp?.result);
          }
          // setUsers($resp.result);
        }
      } finally {
        setMainLoading(false);
      }

      //
    })();
  }, []);
  return (
    <>
      <br />
      <Title order={2}>Riwayat Transaksi</Title>
      {!mainLoading && transaction ? (
        <>
          {transaction.map((_item, idx) => (
            <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
              <Flex
                gap={25}
                direction={$isMobile ? "column" : "row"}
                align={$isMobile ? "flex-start" : "center"}
              >
                {/* <Avatar radius="xl" size="lg" src={_item.avatar} /> */}
                <div>
                  {_item.isMenu ? (
                    <>
                      <Text weight={700} color="brand">
                        Pesanan {_item.no}
                      </Text>
                      <Text mt="sm">
                        Ongkir : {$addSeparator(_item.ongkir)}
                      </Text>
                      <Text>Platform : {$addSeparator(_item.fee)}</Text>
                      <Text weight={700}>
                        Total : {$addSeparator(_item.total)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text weight={700} color="brand">
                        Reservasi {_item.no}
                      </Text>
                      <Text>
                        <strong>Dari Tanggal :</strong> {_item.date}{" "}
                        <strong>Sampai</strong> {_item.duedate}
                      </Text>
                    </>
                  )}
                </div>
                <Group ml="auto">
                  <Text
                    color="white"
                    bg={
                      _item.status == statusTransaksi.done ? "brand" : "orange"
                    }
                    px={10}
                  >
                    Status : {_item.status}
                  </Text>
                </Group>
              </Flex>
              <Button mt="md" fullWidth={$isMobile} ml="auto">
                Detail
              </Button>
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
