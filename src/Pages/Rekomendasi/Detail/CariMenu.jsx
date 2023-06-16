import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Image,
  Flex,
  NumberInput,
  Grid,
  Rating,
  Badge,
  Group,
  Card,
  Skeleton,
  AspectRatio,
  Title,
  Button,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "@/Components/Organism/Navbar";
import { showNotification } from "@mantine/notifications";
import { useApi } from "@/utility/api";

import {
  SET_CART,
  RESET_CART,
  resetCartPersist,
  setCartPersist,
} from "@/store/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { ROLES } from "../../../router";

const CategorySection = lazy(() => import("../Category"));

export default function Rekomendasi(props) {
  const $dispatch = useDispatch();
  const $cart = useSelector((state) => state.cart);
  const $user = useSelector((state) => state.user);
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");

  const [menu, setMenu] = useState(null);
  const [category, setCategory] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const $searchMenu = async (term) => {
    try {
      setMainLoading(true);
      if (term) {
        const $sql = `SELECT * 
          FROM menu WHERE name LIKE '%${term}%'`;
        const $resp = await useApi.get(`/menu/q/${$sql}`);
        if ($resp?.result) setMenu($resp.result);
      } else {
        const $resp = await useApi.get(`/menu`);
        if ($resp?.result) setMenu($resp.result);
      }
      var access = document.getElementById("target-menu");
      access.scrollIntoView({ behavior: "smooth" }, true);

      // console.log($resp.result);
    } finally {
      setMainLoading(false);
    }
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
    $searchMenu();
  }, []);

  return (
    <>
      <div className="dotted">
        <AtomsContainer px={0}>
          <AspectRatio ratio={$isMobile ? 1 : 16 / 6}>
            <Flex
              gap={0}
              direction="column"
              justify="center"
              align="center"
              h="100%"
              px="2rem"
            >
              <Title order={1} size="h1">
                Cari Makanan Yang Anda Inginkan
              </Title>
              <br />
              <TextInput
                w={$isMobile ? "100%" : "50%"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tuliskan menu yang Anda cari"
                required
              />
              <Button
                mt="md"
                w={$isMobile ? "100%" : "50%"}
                bg="brand"
                onClick={() => $searchMenu(searchTerm)}
              >
                Cari Menu
              </Button>
            </Flex>
          </AspectRatio>
        </AtomsContainer>
        <AtomsContainer>
          <Suspense fallback={<p>load categories...</p>}>
            <CategorySection />
          </Suspense>
        </AtomsContainer>
        <br />
        <br />

        <AtomsContainer id="target-menu">
          <Grid
            direction="column"
            py=".5rem"
            my="0"
            gutter="xl"
            justify="center"
          >
            {menu?.length > 0 ? (
              menu?.map((item, idx) => (
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
                        disabled={!$user?.roles?.includes(ROLES.customer)}
                        mt="md"
                        defaultValue={0}
                        value={
                          $cart.items?.find((it) => it.id == item.id)?.total ||
                          0
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
        </AtomsContainer>
      </div>

      <br />
    </>
  );
}
