import { useEffect, useState } from "react";
import { useApi } from "@/utility/api";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { AtomsContainer } from "@/Components/Atoms";
import {
  Grid,
  Skeleton,
  Modal,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineTheme,
  Divider,
  Card,
  Group,
  Badge,
  Avatar,
  Button,
  Image,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

import { addDays, mySqlDate } from "../../utility/date";
import { statusTransaksi } from "../../utility/types";
import { useSelector } from "react-redux";
import { ROLES } from "../../router";

export default function Category({}) {
  const { hovered, ref } = useHover();
  const $theme = useMantineTheme();
  const $navigate = useNavigate();
  const $user = useSelector((state) => state.user);
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedMitra, setSelectedMitra] = useState(null);
  const [state, setState] = useState();
  const [catatan, setCatatan] = useState("");
  const [phonenum, setPhoneNum] = useState("");
  const [date, setDate] = useState("");
  const [duedate, setDuedate] = useState("");

  const fetchCategory = async () => {
    try {
      const $query = "SELECT * FROM mitra ORDER BY updated_at ASC LIMIT 3";
      const resp = await useApi.get(`/mitra/q/${encodeURIComponent($query)}`);

      //   console.log(resp);
      if (resp?.result) setState(resp?.result);
    } catch (error) {}
  };

  const $onSubmit = async (e) => {
    if (!$user.id) {
      $navigate("/masuk");
      return;
    }
    nprogress.start();
    try {
      const curr_date = new Date();

      const $body = {
        no: `INV/${Date.now()}/${curr_date.getFullYear()}-${curr_date.getMonth()}-${
          curr_date.getDate() + 1
        }`,
        date: mySqlDate(date),
        duedate: mySqlDate(addDays(1, duedate)),
        mitra_id: selectedMitra?.id,
        user_id: $user?.id,
        status: statusTransaksi.proses,
        description: catatan,
        phonenum,
        isMenu: 0,
      };

      console.log($body);

      if ($body?.mitra_id && $body?.user_id) {
        const $resp = await useApi.post("/transaksi", $body);
        if ($resp?.success) {
          setPhoneNum("");
          setCatatan("");
          setDate("");
          setDuedate("");
          showNotification({
            title: "Berhasil",
            message: `Berhasil membuat reservasi ke resto ${selectedMitra?.name}`,
            top: true,
          });
          close();
        } else {
          throw new Error("Gagal membuat reservasi");
        }
      }

      // } else {
      //   throw new Error("Gagal menyimpan");
      // }
    } catch (error) {
      // console.log(error);
      showNotification({
        title: "Gagal",
        message: "Terdapat kesalahan ketika memproses checkout",
        top: true,
        autoClose: 2000,
        color: "red",
      });
    } finally {
      nprogress.complete();
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Buat Reservasi"
        size={$isMobile ? "100%" : "70%"}
      >
        {selectedMitra?.id && (
          <>
            <br />
            <Group>
              <Avatar radius="xl" size="lg" src={selectedMitra.logo} />
              <div>
                <Text weight={700}>Restoran {selectedMitra.name}</Text>
                <Text
                  sx={(theme) => ({ cursor: "pointer" })}
                  underline
                  mb="md"
                  color="brand"
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/maps?q=${selectedMitra.lat},${selectedMitra.lng}&z=20&output=embed`
                    )
                  }
                >
                  {selectedMitra.address}
                </Text>
                <iframe
                  width="100%"
                  height="150"
                  src={`https://maps.google.com/maps?q=${selectedMitra.lat},${selectedMitra.lng}&z=18&output=embed`}
                ></iframe>
              </div>
            </Group>
            <Divider my="md" />
            <TextInput
              label="Nomor Telepon"
              type="number"
              value={phonenum}
              onChange={(e) => setPhoneNum(e.target.value)}
              placeholder="Tuliskan nomor Anda yang dapat dihubungi"
              required
            />
            <DateInput
              mt="md"
              w="100%"
              valueFormat="YYYY-MMM-DD HH:mm:ss"
              label="Dari Tanggal"
              placeholder="Pilih Tanggal"
              value={date}
              onChange={setDate}
              mx="auto"
              required
              minDate={new Date()}
            />
            <DateInput
              w="100%"
              mt="md"
              valueFormat="YYYY-MMM-DD HH:mm:ss"
              label="Sampai Tanggal"
              placeholder="Pilih Tanggal"
              minDate={new Date()}
              value={duedate}
              onChange={setDuedate}
              mx="auto"
              required
            />
            <Textarea
              mt="md"
              placeholder={
                "Catatan pesanan / Jika tidak ada, ketikkan `tidak ada`"
              }
              label="Catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              required
            />
            <Button
              disabled={!phonenum || !catatan || !date || !duedate || !$user.id}
              onClick={() => $onSubmit()}
              fullWidth
              mt="xl"
              ml="auto"
              bg="brand"
            >
              Reservasi Sekarang
            </Button>
            <br />
          </>
        )}
      </Modal>
      <>
        <Title order={2}>#Restoran Terbaru</Title>
        <Grid direction="column" py=".5rem" my="0" gutter="xl" justify="center">
          {state?.length > 0 ? (
            state?.map((_item, idx) => (
              <Grid.Col key={idx} span={$isMobile ? 12 : 4}>
                <Card
                  shadow="sm"
                  p="lg"
                  h="100%"
                  style={{ overflow: "hidden" }}
                >
                  <Card.Section
                    component="a"
                    // href="https://mantine.dev"
                    // target="_blank"
                  >
                    <Image src={_item.logo} height={160} alt="Norway" />
                  </Card.Section>

                  <Group position="apart" mt="lg">
                    <Text weight={700}>{_item.name}</Text>
                    {_item.is_open ? (
                      <Badge color="brand" variant="light">
                        Buka
                      </Badge>
                    ) : (
                      <Badge color="red" variant="light">
                        Tutup
                      </Badge>
                    )}
                  </Group>

                  <Button
                    disabled={!$user?.roles?.includes(ROLES.customer)}
                    onClick={() => {
                      if (!$user.id) {
                        $navigate("/masuk");
                        return;
                      }
                      setSelectedMitra(_item);
                      open();
                    }}
                    mt="md"
                  >
                    Reservasi
                  </Button>
                </Card>
              </Grid.Col>
            ))
          ) : (
            <>
              <Skeleton visible h={250}>
                Lorem ipsum dolor sit amet...
                {/* other content */}
              </Skeleton>
            </>
          )}
        </Grid>

        {state?.length > 0 && (
          <Group position="center">
            <Button mt="md" variant="outline">
              Lihat Lebih Banyak
            </Button>
          </Group>
        )}
      </>
    </>
  );
}
