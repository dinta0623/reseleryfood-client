import { useDispatch, useSelector } from "react-redux";
import { AtomsContainer } from "@/Components/Atoms";
import {
  Group,
  Text,
  Title,
  Paper,
  Flex,
  Avatar,
  Button,
  Divider,
  NumberInput,
  Alert,
  Select,
  Textarea,
} from "@mantine/core";
import { useApi } from "@/utility/api";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { nprogress } from "@mantine/nprogress";
import { showNotification } from "@mantine/notifications";
import AddMarker from "@/Components/Molecules/AddMarker";

import {
  SET_CART,
  RESET_CART,
  setCartPersist,
  resetCartPersist,
} from "@/store/CartSlice";
import { $addSeparator } from "@/utility/separator";

import "leaflet/dist/leaflet.css";
import { addDays, mySqlDate } from "../../utility/date";
import { statusTransaksi } from "../../utility/types";
import { useNavigate, useParams } from "react-router-dom";

export default function Cart() {
  const $dispatch = useDispatch();
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const $cart = useSelector((state) => state.cart);
  const $user = useSelector((state) => state.user);
  const $params = useParams();

  const [mitra, setMitra] = useState();
  const [position, setPosition] = useState();
  const [fee, setFee] = useState(0);
  const [harga, setHarga] = useState(0);
  const [ongkir, setOngkir] = useState(0);
  const [total, setTotal] = useState(0);
  const [catatan, setCatatan] = useState("");
  const [catatanMenu, setCatatanMenu] = useState(null);
  const [isMapMarker, { open: setMapMarkerOpen, close: setMapMarkerClose }] =
    useDisclosure(false);

  const [transaction, setTransaction] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);

  const $deleteSingleItemOnCart = (id) => {
    const items = $cart?.items?.filter((it) => it.id !== id);
    $dispatch(
      setCartPersist({
        items,
      })
    );
    if (items?.length <= 0) $dispatch(resetCartPersist());
  };

  const $isGrantedGeolocation = async () => {
    if (
      (await navigator?.permissions?.query({ name: "geolocation" }))?.state ==
      "denied"
    ) {
      showNotification({
        title: "Gagal",
        message: `Pastikan Anda telah mengizinkan website untuk mengakses lokasi Anda`,
        color: "red",
        top: true,
      });
      return false;
    }
    return true;
  };

  const $getGeoPosition = async () => {
    try {
      console.log(navigator.geolocation);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          setPosition({
            payload: {
              ...(await (
                await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position?.coords?.latitude}&lon=${position?.coords?.longitude}`
                )
              ).json()),
            },
            coords: position.coords,
          });
        });
      } else {
        showNotification({
          title: "Gagal",
          message: `Pastikan fitur lokasi web mendukung perangkat Anda`,
          color: "red",
          top: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const $openUserLocation = async () => {
    if ($isGrantedGeolocation()) {
      await $getGeoPosition();
    }
  };

  const $onSubmit = async (e) => {
    nprogress.start();
    try {
      const curr_date = new Date();

      const $body = {
        no: `INV/${Date.now()}/${curr_date.getFullYear()}-${curr_date.getMonth()}-${
          curr_date.getDate() + 1
        }`,
        date: mySqlDate(curr_date),
        duedate: mySqlDate(addDays(1, curr_date)),
        mitra_id: mitra?.id,
        user_id: $user?.id,
        kurir_id: "",
        status: statusTransaksi.proses,
        description: catatan,
        address: position?.payload?.display_name,
        lat: position?.coords?.latitude,
        lng: position?.coords?.longitude,
        diskon: String(0),
        isMenu: 1,
        total: String(total),
        ongkir: String(ongkir),
        fee: String(fee),
        items: $cart.items,
      };

      if ($body?.items?.length > 0) {
        $body.items = $body.items.map((_item, _idx) => ({
          menu_id: _item.id,
          qty: Number(_item.total || 1),
          total: String(Number((_item.total || 1) * _item.price)),
          description:
            catatanMenu?.find((__item) => __item.id == _item.id)?.value || "",
        }));
        const $resp = await useApi.post("/transaksi", $body);

        if ($resp?.success) {
          $body.id = $resp?.result?.id;
        } else {
          throw new Error("Gagal menyimpan checkout");
        }
      } else {
        throw new Error("Gagal menyimpan");
      }

      if ($body?.id && $body?.items?.length > 0) {
        const $resp = await Promise.all(
          await $body.items.map(
            async (_item) =>
              await useApi.post("/transaksi-item", {
                ..._item,
                transaksi_id: $body.id,
              })
          )
        );

        $dispatch(resetCartPersist());

        $navigate("/rekomendasi");

        showNotification({
          title: "Berhasil",
          message: "Berhasil memproses checkout",
          top: true,
        });
      } else {
        throw new Error("Gagal menyimpan items");
      }
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

  //   useEffect(() => {
  //     if ($cart.mitra_id || $cart.items?.[0]?.mitra_id) {
  //       (async function fetchData() {
  //         try {
  //           nprogress.start();
  //           const $resp = await useApi.get(
  //             `/mitra/${$cart.mitra_id || $cart.items?.[0]?.mitra_id}`
  //           );
  //           setMitra($resp.result);
  //         } finally {
  //           setTimeout(() => nprogress.complete(), 2000);
  //         }
  //         //
  //       })();
  //       $dispatch(setCartPersist($cart));
  //     }
  //   }, [$cart.mitra_id]);

  //   useEffect(() => {
  //     setFee(2500);
  //     setHarga(
  //       $cart?.items?.reduce(
  //         (accumulator, curr) =>
  //           Number(accumulator) + Number(curr.price * curr.total),
  //         0
  //       )
  //     );
  //     setOngkir(
  //       $cart?.items?.reduce((accumulator, curr) => Number(accumulator) + 1, 0) *
  //         5000
  //     );
  //   }, [$cart.items, $cart.items?.length]);

  //   useEffect(() => {
  //     setTotal(Number(harga + ongkir + fee));
  //   }, [harga, ongkir, fee]);

  useEffect(() => {
    console.log($params.id);

    (async function fetchData() {
      try {
        setMainLoading(true);
        if ($params.id) {
          const $resp = await useApi.get(`/transaksi/${$params.id}`);
          console.log($resp);
          if ($resp?.success) {
            setTransaction($resp?.result);
          }
        } else {
          $navigate("/");
        }
      } finally {
        setMainLoading(false);
      }

      //
    })();
  }, []);

  return (
    <>
      {transaction?.id ? (
        <>
          <AtomsContainer mt="lg">
            <Flex justify="space-between" align="center">
              <div>
                <Title order={2}>Detail Transaksi </Title>
                <Text>{transaction.no}</Text>
                <Text>
                  <strong>Tanggal : </strong>
                  {transaction.created_at}
                </Text>
              </div>
              <Text bg="brand" color="white" px="sm">
                Status {transaction.status}
              </Text>
            </Flex>

            {/*  mitra */}
            {transaction?.mitra?.id && (
              <>
                <br />
                <Group mt="xl">
                  <Avatar radius="xl" size="lg" src={transaction.mitra?.logo} />
                  <div>
                    <Text weight={700}>Restoran {transaction.mitra?.name}</Text>
                    <Group>
                      <Text
                        sx={(theme) => ({ cursor: "pointer" })}
                        underline
                        color="brand"
                        onClick={() =>
                          window.open(
                            `https://maps.google.com/maps?q=${transaction.mitra?.lat},${transaction.mitra?.lng}&z=20&output=embed`
                          )
                        }
                      >
                        {transaction.mitra?.address}
                      </Text>
                    </Group>
                  </div>
                </Group>
                <Divider my="md" />
              </>
            )}

            {transaction.address && transaction.lat && transaction.lng && (
              <>
                <Group position="left" align="center" mih={150} mt="md">
                  <Avatar
                    radius="xl"
                    size="lg"
                    src={transaction.user?.avatar}
                  />
                  <div>
                    <Text>
                      <strong>Alamat Antar:</strong> {transaction.address}
                    </Text>
                    <Text>
                      <strong>Penerima:</strong> {transaction.user.name} /{" "}
                      {transaction.user.email}
                    </Text>
                  </div>
                  <iframe
                    className="no-print"
                    width="100%"
                    height="150"
                    src={`https://maps.google.com/maps?q=${transaction.lat},${transaction.lng}&z=18&output=embed`}
                  ></iframe>
                </Group>
              </>
            )}

            {transaction?.items?.length > 0 ? (
              <>
                <Divider my="md" />
                <Text weight={700}>Pesanan</Text>
                {transaction.items.map((_item, idx) => (
                  <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
                    <Flex
                      gap={25}
                      direction={$isMobile ? "column" : "row"}
                      align={$isMobile ? "flex-start" : "center"}
                      justify="space-between"
                    >
                      <Group>
                        <Avatar size="lg" src={_item.menu.picture} />
                        <div>
                          <Text weight={700}>{_item.menu.name}</Text>
                          <Text color="brand">
                            Rp {$addSeparator(Number(_item.total))}
                          </Text>
                        </div>
                      </Group>
                      <Group align="center" w={$isMobile ? "100%" : "auto"}>
                        <Text>
                          {_item.qty}x {$addSeparator(_item.menu?.price)}
                        </Text>
                      </Group>
                    </Flex>
                    <Textarea
                      mt="md"
                      disabled
                      value={_item.description || "Tidak ada catatan tambahan"}
                      // onChange={(e) => setCatatan(e.target.value)}
                    />
                  </Paper>
                ))}
                <br />
                <Text weight={700}>Ringkasan Pembayaran</Text>
                <Group mt="md" position="apart">
                  <div className="label">
                    <Text>Harga</Text>
                    <Text>Ongkir</Text>
                    <Text weight={700} italic color="brand">
                      Fee Platform
                    </Text>
                  </div>
                  <div className="price" style={{ textAlign: "right" }}>
                    <Text>
                      {$addSeparator(
                        transaction.total - transaction.ongkir - transaction.fee
                      )}
                    </Text>
                    <Text>{$addSeparator(transaction.ongkir)}</Text>
                    <Text>{$addSeparator(transaction.fee)}</Text>
                  </div>
                </Group>
                <Divider my="md" />
                <Group position="apart">
                  <Text weight={700}>Total Bayar</Text>
                  <Text weight={700}>{$addSeparator(transaction.total)}</Text>
                </Group>
                <Textarea
                  mt="md"
                  disabled
                  value={transaction.catatan || "Tidak ada catatan tambahan"}
                  // onChange={(e) => setCatatan(e.target.value)}
                />
                <Group mt="lg">
                  <Button
                    onClick={() => window.print()}
                    fullWidth
                    mt="xl"
                    ml="auto"
                    bg="brand"
                  >
                    Hasil Cetak
                  </Button>
                </Group>
                <br />
                <br />
                <br />
              </>
            ) : transaction.isMenu ? (
              <Group position="center" mih={500}>
                <i className="ri-shopping-cart-fill ri-xl"></i>
                <Text>Keranjang Anda Kosong</Text>
              </Group>
            ) : (
              <div>
                <Text weight={700}>Detail : Reservasi</Text>
                <br />
                <Text>Dari Tanggal : {transaction.date}</Text>
                <br />
                <Text>Sampai : {transaction.duedate}</Text>
                <Divider my="md" />
                <Text weight={700}>Pemesan :</Text>
                <Group position="left" mt="md">
                  <Avatar
                    radius="xl"
                    size="lg"
                    src={transaction.user?.avatar}
                  />
                  <div>
                    <Text>
                      <strong>Nama :</strong> {transaction.user.name} /{" "}
                      {transaction.user.email}
                    </Text>
                    <Text>
                      <strong>Nomor Telp:</strong> {transaction.phonenum}
                    </Text>
                  </div>
                </Group>
                <Group mt="lg">
                  <Button
                    onClick={() => window.print()}
                    fullWidth
                    mt="xl"
                    ml="auto"
                    bg="brand"
                  >
                    Hasil Cetak
                  </Button>
                </Group>
              </div>
            )}
          </AtomsContainer>
        </>
      ) : (
        <AtomsContainer>Detail pembelian tidak ditemukan</AtomsContainer>
      )}
    </>
  );
}
