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
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const $dispatch = useDispatch();
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const $cart = useSelector((state) => state.cart);
  const $user = useSelector((state) => state.user);

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

  const addToCart = (item, total) => {
    let isSameMitra = Boolean(item?.mitra_id == $cart?.mitra_id);

    if ($cart?.mitra_id && !isSameMitra) {
      $dispatch(resetCartPersist());
      showNotification({
        title: "Gagal",
        message: `Menu tidak bisa berasal dari 2 restoran yang berbeda`,
        color: "red",
        top: true,
      });
      return;
    }

    let isAlreadyOnCart = $cart.items?.find((it) => it.id == item.id);

    if (isAlreadyOnCart) {
      isAlreadyOnCart = Object.assign({}, isAlreadyOnCart);
    }

    if (!isAlreadyOnCart) {
      $dispatch(
        setCartPersist({
          mitra_id: item.mitra_id,
          items: [
            ...($cart?.items || []),
            {
              ...item,
              total: total || 1,
            },
          ],
        })
      );
      showNotification({
        title: "Berhasil",
        message: `Menu ${item.name} ditambahkan ke keranjang Anda`,
        top: true,
      });
    }

    if (isAlreadyOnCart?.id && total == 0) {
      const items = $cart?.items?.filter((it) => it.id !== isAlreadyOnCart.id);
      $dispatch(
        setCartPersist({
          items,
        })
      );
      showNotification({
        title: "Berhasil",
        message: `Menu ${isAlreadyOnCart.name} telah dihapus dari keranjang Anda`,
        color: "orange",
        top: true,
      });
      if (items?.length <= 0) $dispatch(resetCartPersist());
      return;
    }

    if (isAlreadyOnCart?.id) {
      $dispatch(
        setCartPersist({
          items: [
            {
              ...item,
              total: total || isAlreadyOnCart.total + 1,
            },
            ...($cart?.items?.filter((it) => it.id !== isAlreadyOnCart.id) ||
              []),
          ],
        })
      );
    }

    // console.log("add-to-cart", item, total);
  };

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

  useEffect(() => {
    if ($cart.mitra_id || $cart.items?.[0]?.mitra_id) {
      (async function fetchData() {
        try {
          nprogress.start();
          const $resp = await useApi.get(
            `/mitra/${$cart.mitra_id || $cart.items?.[0]?.mitra_id}`
          );
          setMitra($resp.result);
        } finally {
          setTimeout(() => nprogress.complete(), 2000);
        }
        //
      })();
      $dispatch(setCartPersist($cart));
    }
  }, [$cart.mitra_id]);

  useEffect(() => {
    setFee(2500);
    setHarga(
      $cart?.items?.reduce(
        (accumulator, curr) =>
          Number(accumulator) + Number(curr.price * curr.total),
        0
      )
    );
    setOngkir(
      $cart?.items?.reduce((accumulator, curr) => Number(accumulator) + 1, 0) *
        5000
    );
  }, [$cart.items, $cart.items?.length]);

  useEffect(() => {
    setTotal(Number(harga + ongkir + fee));
  }, [harga, ongkir, fee]);

  useEffect(() => {
    if (!$isGrantedGeolocation()) {
      setPosition(null);
    } else {
      $getGeoPosition();
    }
  }, []);

  return (
    <>
      <AddMarker
        title="Set Lokasi Alamat Pengiriman Anda"
        isMapMarker={isMapMarker}
        setMapMarkerClose={setMapMarkerClose}
        setAddress={(result) =>
          setPosition({
            ...result,
            coords: { latitude: result?.pos?.[0], longitude: result?.pos?.[1] },
          })
        }
      />
      <AtomsContainer mt="xl">
        <Title>Keranjang Anda</Title>
        {/*  mitra */}
        {mitra?.id && $cart.mitra_id && (
          <>
            <br />
            <Group mt="xl">
              <Avatar radius="xl" size="lg" src={mitra.logo} />
              <div>
                <Text weight={700}>Restoran {mitra.name}</Text>
                <Group>
                  {!$isMobile && <i className="ri-map-pin-fill ri-lg"></i>}

                  <Text
                    sx={(theme) => ({ cursor: "pointer" })}
                    underline
                    color="brand"
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/maps?q=${mitra.lat},${mitra.lng}&z=20&output=embed`
                      )
                    }
                  >
                    {mitra.address}
                  </Text>
                </Group>
              </div>
            </Group>
            <Divider my="md" />
          </>
        )}
        {/*  alamat */}

        <div>
          <Group>
            <Text weight={700}>Alamat Pengantaran Anda</Text>

            <Group ml="auto" w={$isMobile ? "100%" : "auto"}>
              <Button
                leftIcon={<i className="ri-map-pin-fill ri-xl"></i>}
                disabled={!mitra?.id}
                fullWidth={$isMobile}
                variant="light"
                ml="auto"
                onClick={$openUserLocation}
              >
                Lokasi Saya
              </Button>
              <Button
                onClick={() => setMapMarkerOpen()}
                disabled={!mitra?.id}
                fullWidth={$isMobile}
                ml="auto"
              >
                Ganti Lokasi
              </Button>
            </Group>
          </Group>
          {mitra?.id && $cart.mitra_id && (
            <Alert
              mt="md"
              icon={<i className="ri-map-pin-fill ri-xl"></i>}
              title="Perhatian"
              color="teal"
            >
              Pastikan detail alamat yang diperlukan agar kurir dapat dengan
              mudah menemukan lokasimu untuk antar pesanan.
            </Alert>
          )}

          {$cart.mitra_id && position?.payload && (
            <Text mt="md">
              <strong>Alamat</strong> : {position?.payload?.display_name}
            </Text>
          )}
          <Group position="center" mih={150} mt="md">
            {mitra?.id && $cart.mitra_id && position?.coords ? (
              <iframe
                width="100%"
                height="150"
                src={`https://maps.google.com/maps?q=${position?.coords?.latitude},${position?.coords?.longitude}&z=18&output=embed`}
              ></iframe>
            ) : (
              <>
                <i className="ri-map-pin-line ri-xl"></i>
                <Text>Anda belum menambah alamat pengiriman</Text>
              </>
            )}
          </Group>
        </div>

        <Divider my="md" />

        {$cart?.items?.length > 0 ? (
          <>
            <Text weight={700}>Pesanan Anda</Text>
            {$cart.items.map((item, idx) => (
              <Paper key={idx} p="md" mt="md" shadow="sm" radius="md">
                <Flex
                  gap={25}
                  direction={$isMobile ? "column" : "row"}
                  align={$isMobile ? "flex-start" : "center"}
                  justify="space-between"
                >
                  <Group>
                    <Avatar size="lg" src={item.picture} />
                    <div>
                      <Text weight={700}>{item.name}</Text>
                      <Text color="brand">
                        Rp {$addSeparator(Number(item.price))}
                      </Text>
                    </div>
                  </Group>
                  <Group align="center" w={$isMobile ? "100%" : "auto"}>
                    <NumberInput
                      defaultValue={0}
                      w={$isMobile ? "50%" : "auto"}
                      value={
                        $cart.items?.find((it) => it.id == item.id)?.total || 0
                      }
                      stepHoldDelay={500}
                      onChange={(value) => {
                        addToCart(item, value);
                      }}
                      min={0}
                      max={100}
                    />
                    <Button
                      onClick={() => $deleteSingleItemOnCart(item.id)}
                      w={$isMobile ? "45%" : "auto"}
                      ml="auto"
                    >
                      Hapus
                    </Button>
                  </Group>
                </Flex>
                <Textarea
                  mt="md"
                  w="100%"
                  placeholder={"Catatan pesanan"}
                  label="Catatan (bila ada)"
                  value={
                    catatanMenu?.find((_it) => _it.id == item.id)?.value || ""
                  }
                  onChange={(e) =>
                    setCatatanMenu((_items) => {
                      const _newBody = {
                        id: item.id,
                        value: e.target.value,
                      };
                      if (_items?.length > 0) {
                        if (_items.find((_item) => _item.id == _newBody.id))
                          return [
                            ..._items.filter(
                              (_item) => _item.id != _newBody.id
                            ),
                            _newBody,
                          ];
                        else return [..._items, _newBody];
                      } else return [_newBody];
                    })
                  }
                />
              </Paper>
            ))}
            {/* <br />
            <Text weight={700}>Pengiriman</Text>
            <Group position="apart">
              <Text>Metode</Text>
              <Select
                data={["Ambil Sendiri", "Diantar"]}
                defaultValue={"Diantar"}
                placeholder={"Tentukan cara menerima pesanan Anda"}
              />
            </Group> */}
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
                <Text>{$addSeparator(harga)}</Text>
                <Text>{$addSeparator(ongkir)}</Text>
                <Text>{$addSeparator(fee)}</Text>
              </div>
            </Group>
            <Divider my="md" />
            <Group position="apart">
              <Text weight={700}>Total Bayar</Text>
              <Text weight={700}>{$addSeparator(total)}</Text>
            </Group>
            <Textarea
              mt="md"
              placeholder={"Catatan pesanan"}
              label="Catatan (bila ada)"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
            <Group mt="lg">
              <Button
                onClick={() => $onSubmit()}
                disabled={
                  !position?.coords ||
                  !$cart?.items ||
                  !mitra?.id ||
                  !$cart.mitra_id
                }
                fullWidth
                mt="xl"
                ml="auto"
                bg="brand"
              >
                Pesan Sekarang
              </Button>
            </Group>
            <br />
            <br />
            <br />
          </>
        ) : (
          <Group position="center" mih={500}>
            <i className="ri-shopping-cart-fill ri-xl"></i>
            <Text>Keranjang Anda Kosong</Text>
          </Group>
        )}
      </AtomsContainer>
    </>
  );
}
