import { useEffect, useState, useLayoutEffect } from "react";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { LoadingOverlay, Box } from "@mantine/core";
import { useLocation, Route, Routes } from "react-router-dom";

import { useApi } from "@/utility/api";
import { useStorage, useJwtDecode } from "@/utility/storage";
import { SET_USER, RESET_USER } from "@/store/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { router } from "@/router";

function App() {
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
      $dispatch(
        SET_USER({
          ...user?.payload,
          ...$resp?.result,
          isLogged: true,
        })
      );
    } else {
      $dispatch(RESET_USER());
    }
  }
  useLayoutEffect(() => {
    (async function _() {
      setLoading(true);
      await fetchData();
      setLoading(false);
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
            {router.routes.map((item, idx) => (
              <Route key={idx} {...item} />
            ))}
          </Routes>
        </>
      ) : (
        <Box maw={400} pos="relative">
          Loading...
        </Box>
      )}
    </div>
  );
}

export default App;
