import { useEffect, useState, useLayoutEffect } from "react";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { Flex, Image, Box } from "@mantine/core";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";

import { useApi } from "@/utility/api";
import { useStorage, useJwtDecode } from "@/utility/storage";
import { SET_USER, RESET_USER } from "@/store/UserSlice";
import { SET_MITRA } from "@/store/MitraSlice";
import { setCartPersist, name as CartName } from "@/store/CartSlice";
import { useSelector, useDispatch } from "react-redux";
import { router } from "@/router";
import Guard from "./Components/Organism/Guard";
import { SET_CART } from "./store/CartSlice";
import { nprogress } from "@mantine/nprogress";

function App() {
  const $state = useSelector((state) => state);
  const $user = useSelector((state) => state.user);
  const $location = useLocation();
  const $dispatch = useDispatch();
  const [mainLoading, setLoading] = useState(true);

  async function fetchData() {
    const payload = await useStorage("credentials");
    const user =
      (payload?.access_token && useJwtDecode(payload?.access_token)) || null;
    if (payload?.access_token && payload?.refresh_token && user?.payload?.id) {
      const $resp = await useApi.get(`/users/${user?.payload?.id}`);
      console.log(user?.payload);
      $dispatch(
        SET_USER({
          ...user?.payload, // mitra_id here
          ...$resp?.result,
          mitra_id: user?.payload?.mitra_id,
          isLogged: true,
        })
      );
    } else {
      $dispatch(RESET_USER());
    }

    if ($user?.mitra_id) {
      const $resp = await useApi.get(`/mitra/${$user.mitra_id}`);
      $dispatch(SET_MITRA($resp.result));
    }
    await fetchCart();
  }

  async function fetchCart() {
    nprogress.start();
    try {
      const $cart = await useStorage(CartName);
      if ($cart) {
        $dispatch(
          SET_CART({
            ...$cart,
          })
        );
      }
    } finally {
      nprogress.complete();
    }
  }
  useLayoutEffect(() => {
    (async function _() {
      setLoading(true);
      await fetchData();
      setTimeout(() => setLoading(false), 1000);
    })();
  }, []);
  useEffect(() => {
    fetchData();
  }, [$location, $user.isLogged]);
  return (
    <div style={{ minHeight: "100vh" }}>
      {!mainLoading ? (
        <>
          <NavigationProgress progressLabel="Loading Page" />
          <Notifications position="top-right" />
          <Routes>
            {...router.routes?.map(({ element: Element, ...rest }, idx) => {
              if (typeof rest.meta?.validate == "function") {
                return (
                  <Route
                    key={idx}
                    element={
                      <Guard
                        isRouteAccessible={() =>
                          rest.meta.validate({ $state, $meta: rest.meta })
                        }
                        redirectRoute={rest.meta.redirectRoute}
                      >
                        <Element />
                      </Guard>
                    }
                    {...rest}
                  />
                );
              }
              return <Route key={idx} element={<Element />} {...rest} />;
            })}
          </Routes>
        </>
      ) : (
        <Flex w="100%" h="100vh" justify="center" align="center">
          <Image width={150} fit="contain" src="/logo.png" />
        </Flex>
      )}
    </div>
  );
}

export default App;
