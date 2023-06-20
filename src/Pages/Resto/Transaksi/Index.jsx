import {
  Text,
  Paper,
  Flex,
  Avatar,
  Group,
  Button,
  Title,
  Pagination,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useApi } from "@/utility/api";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { $addSeparator } from "@/utility/separator";
import { statusTransaksi } from "@/utility/types";

export default function Transaksi() {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const $user = useSelector((state) => state?.user);
  const $mitra = useSelector((state) => state?.mitra);
  const [mainLoading, setMainLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const $changeFilter = async (status) => {
    setMainLoading(true);
    try {
      if ($mitra.id) {
        let $sql = `SELECT * FROM transaksi WHERE mitra_id = '${$mitra?.id}'`;

        if (status) {
          $sql += ` AND status LIKE '%${status || statusTransaksi.proses}%'`;
        }
        const $resp = await useApi.get(`/transaksi/q/${$sql}`);

        setTransaction($resp?.result);
      }
    } finally {
      setMainLoading(false);
    }
  };

  const $updateStatus = async (id, payload = statusTransaksi.done) => {
    try {
      setMainLoading(true);
      if (id) {
        const $resp = await useApi.put("/transaksi", {
          id,
          status: payload,
        });
        console.log($resp);
        if ($resp?.success) {
          setTransaction($resp?.result);
        }
      }
    } finally {
      setMainLoading(false);
    }
  };

  useEffect(() => {
    (async function fetchData() {
      try {
        setMainLoading(true);
        // if ($user.id) { WHERE user_id = '${$user.id}'
        if ($mitra?.id) {
          const $sql = `SELECT * FROM transaksi WHERE mitra_id = '${$mitra?.id}'`;
          const $resp = await useApi.get(`/transaksi/q/${$sql}`);
          if ($resp?.success) {
            setTransaction($resp?.result);
          }
        }
        // setUsers($resp.result);
        // }
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
        <Title order={2}>Semua Riwayat Transaksi</Title>

        <Select
          mt="md"
          data={
            Object.entries(statusTransaksi)?.map(([_key, _value]) => ({
              label: _value.substring(0, 1).toUpperCase() + _value.substring(1),
              value: _value,
            })) || []
          }
          searchable
          clearable
          placeholder={"Filter Status"}
          onChange={(payload) => $changeFilter(payload)}
        />
      </Flex>
      {!mainLoading && transaction?.length > 0 ? (
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
                      <Text underline color="brand">
                        {_item.user?.name || "-"}
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
                      <Text underline color="brand">
                        {_item.user?.name || "-"}
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
              <Button
                mt="md"
                fullWidth={$isMobile}
                ml="auto"
                onClick={() => $navigate("/transaksi/detail/" + _item.id)}
              >
                Detail
              </Button>
              <Button
                mt={$isMobile ? "md" : "0"}
                mx={$isMobile ? "0" : "md"}
                variant="gradient"
                fullWidth={$isMobile}
                ml="auto"
                onClick={() =>
                  $updateStatus(
                    _item.id,
                    _item.status == statusTransaksi.done
                      ? statusTransaksi.proses
                      : statusTransaksi.done
                  )
                }
              >
                Tandai{" "}
                {_item.status == statusTransaksi.done ? "Proses" : "Selesai"}
              </Button>
            </Paper>
          ))}
          <br />
          <Pagination total={10} mt="xl" />
        </>
      ) : mainLoading ? (
        <Text mt="md">Loading...</Text>
      ) : (
        <Text mt="md">Tidak ada riwayat pembelian yang ditemukan</Text>
      )}
    </>
  );
}
