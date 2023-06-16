import { useEffect, useState } from "react";
import { useApi } from "@/utility/api";
import { useMediaQuery, useHover } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { AtomsContainer } from "@/Components/Atoms";
import {
  Grid,
  Skeleton,
  NumberInput,
  Text,
  Flex,
  Title,
  useMantineTheme,
  ActionIcon,
  Card,
  Group,
  Badge,
  Rating,
  Button,
  Image,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_CART,
  RESET_CART,
  resetCartPersist,
  setCartPersist,
} from "../../store/CartSlice";
import { ROLES } from "../../router";

export default function Category({}) {
  const { hovered, ref } = useHover();
  const $dispatch = useDispatch();
  const $navigate = useNavigate();
  const $cart = useSelector((state) => state.cart);
  const $user = useSelector((state) => state.user);
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [state, setState] = useState();

  const fetchCategory = async () => {
    try {
      const $query =
        "SELECT menu.*, __.name as mitra FROM menu INNER JOIN mitra __ ON __.id = menu.mitra_id WHERE menu.disable = 0 ORDER BY menu.updated_at ASC LIMIT 3";

      const resp = await useApi.get(`/menu/q/${encodeURIComponent($query)}`);
      if (resp?.result) setState(resp?.result);
    } catch (error) {}
  };

  const addToCart = (item, total) => {
    if (!$user.id) {
      $navigate("/masuk");
      return;
    }
    let isSameMitra = Boolean(item?.mitra_id == $cart?.mitra_id);

    if ($cart?.mitra_id && !isSameMitra) {
      $dispatch(resetCartPersist());
      // $dispatch(RESET_CART());
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
      // $dispatch(
      //   SET_CART({
      //     mitra_id: item.mitra_id,
      //     items: [
      //       ...($cart?.items || []),
      //       {
      //         ...item,
      //         total: total || 1,
      //       },
      //     ],
      //   })
      // );
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
      // $dispatch(
      //   SET_CART({
      //     items,
      //   })
      // );
      showNotification({
        title: "Berhasil",
        message: `Menu ${isAlreadyOnCart.name} telah dihapus dari keranjang Anda`,
        color: "orange",
        top: true,
      });

      if (items?.length <= 0) $dispatch(resetCartPersist()); //RESET_CART());
      return;
    }

    if (isAlreadyOnCart?.id) {
      $dispatch(
        setCartPersist({
          items: [
            ...($cart?.items?.filter((it) => it.id !== isAlreadyOnCart.id) ||
              []),
            {
              ...item,
              total: total || isAlreadyOnCart.total + 1,
            },
          ],
        })
      );
      // $dispatch(
      //   SET_CART({

      //   })
      // );
    }

    // console.log("add-to-cart", item, total);
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  return (
    <>
      <>
        <Title order={2}>#Menu Terbaru</Title>
        <Grid direction="column" py=".5rem" my="0" gutter="xl" justify="center">
          {state?.length > 0 ? (
            state?.map((item, idx) => (
              <Grid.Col key={idx} span={$isMobile ? 12 : 4}>
                <Card
                  shadow="sm"
                  sx={(theme) => ({
                    borderLeft: $cart.items?.find((it) => it.id == item.id)
                      ? `5px solid`
                      : "none",
                    borderLeftColor: theme.colors.brand[6],
                  })}
                  p="lg"
                  h="100%"
                  style={{ overflow: "hidden" }}
                >
                  <Card.Section
                    component="a"
                    // href="https://mantine.dev"
                    // target="_blank"
                  >
                    <Image
                      src={item.picture}
                      height={160}
                      alt="Norway"
                      withPlaceholder
                    />
                  </Card.Section>

                  <Group spacing="sm" mt="xl">
                    <Text size="sm">{item.mitra}</Text>
                  </Group>

                  <Group position="apart" style={{}}>
                    <Text weight={700}>{item.name}</Text>
                    <Badge color="brand" variant="light">
                      {item.qty > 0 ? "Tersedia" : "Tidak Tersedia"}
                    </Badge>
                  </Group>

                  <Group spacing="sm">
                    <Rating defaultValue={4.5} />
                    <Text weight={700} size="sm">
                      4.5
                    </Text>
                  </Group>

                  <Group
                    position="apart"
                    style={{ marginBottom: 5, marginTop: "25px" }}
                  >
                    <NumberInput
                      mt="md"
                      disabled={!$user?.roles?.includes(ROLES.customer)}
                      defaultValue={0}
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
                      disabled={!$user?.roles?.includes(ROLES.customer)}
                      onClick={() => addToCart(item, undefined)}
                      mt="md"
                    >
                      Tambah Pesanan
                    </Button>
                  </Group>

                  {/* <Text size="sm" style={{ lineHeight: 1.5 }}>
                    {item.desc}
                  </Text> */}
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
            <Button
              onClick={() => $navigate("/rekomendasi/menu")}
              mt="md"
              variant="outline"
            >
              Lihat Lebih Banyak
            </Button>
          </Group>
        )}
      </>
    </>
  );
}
