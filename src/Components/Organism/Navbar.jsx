import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Image,
  Flex,
  createStyles,
  Grid,
  Button,
  Burger,
  Avatar,
  Menu,
  Text,
  ActionIcon,
  Indicator,
} from "@mantine/core";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { AtomsContainer } from "@/Components/Atoms";
import { useSelector, useDispatch } from "react-redux";
import { useStorage, useJwtDecode } from "@/utility/storage";
import { SET_USER, RESET_USER } from "@/store/UserSlice";
import { logoutUser } from "@/store/UserSlice";
import { useApi } from "@/utility/api";
import { router, ROLES } from "@/router";
import { resetCartPersist } from "../../store/CartSlice";

const useStyles = createStyles((theme) => ({
  navbar: {
    background: "white",
    borderBottom: ".05rem",
    borderBottomColor: theme.colors.gray[2],
    borderBottomStyle: "solid",
  },
}));

export default function Navbar() {
  const $location = useLocation();
  const $state = useSelector((state) => state);
  const $user = useSelector((state) => state.user);
  const $cart = useSelector((state) => state.cart);
  const $dispatch = useDispatch();
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");

  const { classes } = useStyles();
  const [openHamburger, { toggle: toggleHamburger }] = useDisclosure(false);
  const { hoveredMenuProfile, setHoveredMenuProfile } = useHover();
  const [routes, setRoutes] = useState(null);

  useEffect(() => {
    // console.log(router?.routes?.filter((route) => route?.meta?.navigator));
    if (router?.routes)
      setRoutes(
        router.routes.filter(
          (route) =>
            route?.meta?.name &&
            route?.meta?.navigator &&
            (typeof route?.meta?.validate == "function"
              ? route.meta.validate({ $state, $meta: route?.meta })
              : true)
        )
      );
    // console.log(ROLES.mitra, $user);
  }, [$location, $user, $state.mitra]);

  return (
    <nav className={classes.navbar}>
      <AtomsContainer>
        <Grid grow py=".5rem" my="0">
          <Grid.Col span={$isMobile ? 6 : "auto"}>
            <Flex
              gap="xs"
              justify="start"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <Image width={150} fit="contain" src="/logo.png" />
            </Flex>
          </Grid.Col>

          {$isMobile && (
            <Grid.Col span={6}>
              <Flex
                gap="xs"
                justify="flex-end"
                align="center"
                style={{ height: "100%" }}
              >
                <Burger
                  style={{
                    marginLeft: "auto",
                  }}
                  opened={openHamburger}
                  onClick={toggleHamburger}
                  aria-label="Hamburger"
                />
              </Flex>
            </Grid.Col>
          )}
          {Boolean(($isMobile && openHamburger) || !$isMobile) && (
            <>
              <Grid.Col span={$isMobile ? 12 : "auto"}>
                <Flex
                  gap="xs"
                  justify="center"
                  align="center"
                  direction={$isMobile ? "column" : "row"}
                  style={{ height: "100%" }}
                >
                  {routes &&
                    routes.map(({ meta, path }, idx) => (
                      <Button
                        key={idx}
                        ta="start"
                        tt="capitalize"
                        compact={$isMobile ? false : true}
                        variant="subtle"
                        fullWidth={$isMobile ? true : false}
                        onClick={() => {
                          $navigate(path || "/");
                        }}
                      >
                        {meta.name}
                      </Button>
                    ))}
                </Flex>
              </Grid.Col>
              <Grid.Col span="auto">
                <Flex
                  justify="flex-end"
                  align="center"
                  direction="row"
                  wrap="wrap"
                  gap={15}
                >
                  {$user.isLogged ? (
                    <>
                      {$isMobile ? (
                        <Button fullWidth onClick={() => $navigate("/profil")}>
                          Lihat Akun Anda
                        </Button>
                      ) : (
                        <>
                          {$user?.roles?.includes(ROLES.customer) && (
                            <Indicator
                              inline
                              position="middle-start"
                              processing
                              disabled={Boolean(
                                !$cart?.items || $cart?.items?.length <= 0
                              )}
                              label={
                                $cart?.items?.length > 99
                                  ? "99+"
                                  : $cart?.items?.length
                              }
                              size={14}
                            >
                              <ActionIcon
                                onClick={() => $navigate("/keranjang")}
                                color="brand"
                                radius="xl"
                                p="lg"
                              >
                                <i className="ri-shopping-cart-fill ri-lg"></i>
                              </ActionIcon>
                            </Indicator>
                          )}

                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <Flex
                                justify={$isMobile ? "flex-start" : "flex-end"}
                                align="center"
                                direction="row"
                                w={$isMobile ? "100%" : "auto"}
                                gap={10}
                              >
                                {$isMobile && <br />}
                                <Avatar
                                  radius="xl"
                                  size={$isMobile ? "lg" : "md"}
                                  src={$user.avatar}
                                  sx={(theme) => ({
                                    cursor: "pointer",
                                  })}
                                />

                                {$isMobile && (
                                  <div>
                                    <Text tt="capitalize">{$user.name}</Text>
                                    <Text c="blue">{$user.email}</Text>
                                  </div>
                                )}
                              </Flex>
                            </Menu.Target>

                            <Menu.Dropdown>
                              <Menu.Label>
                                Profil : <Text c="blue">{$user.email}</Text>
                              </Menu.Label>
                              <Menu.Item
                                onClick={() => $navigate("/profil")}
                                icon={<i className="ri-user-fill ri-lg"></i>}
                              >
                                Edit Profil
                              </Menu.Item>
                              {$user?.roles?.includes(ROLES.customer) && (
                                <>
                                  <Menu.Item
                                    onClick={() => $navigate("/keranjang")}
                                    icon={
                                      <i className="ri-store-3-fill ri-lg"></i>
                                    }
                                  >
                                    Keranjang Anda
                                  </Menu.Item>
                                  <Menu.Item
                                    onClick={() => $navigate("/profil")}
                                    icon={
                                      <i className="ri-bill-fill ri-lg"></i>
                                    }
                                  >
                                    Riwayat Pembelian
                                  </Menu.Item>
                                </>
                              )}

                              <Menu.Item
                                onClick={() => $navigate("/profil")}
                                icon={
                                  <i className="ri-equalizer-fill ri-lg"></i>
                                }
                              >
                                Pengaturan
                              </Menu.Item>
                              {/* <Menu.Item
                 icon={<IconSearch size={14} />}
                 rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
               >
                 Search
               </Menu.Item> */}

                              <Menu.Divider />

                              <Menu.Label>Akun</Menu.Label>
                              {/* <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item> */}
                              <Menu.Item
                                onClick={() => {
                                  new Promise.all([
                                    $dispatch(logoutUser()),
                                    $dispatch(resetCartPersist()),
                                  ]).then(() => (location.href = "/"));
                                }}
                                color="red"
                                icon={
                                  <i className="ri-logout-circle-fill ri-lg"></i>
                                }
                              >
                                Keluar
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => $navigate("/masuk")}
                      variant="outline"
                      fullWidth={$isMobile ? true : false}
                    >
                      Masuk/Daftar
                    </Button>
                  )}
                </Flex>
              </Grid.Col>
            </>
          )}
        </Grid>
      </AtomsContainer>
    </nav>
  );
}
