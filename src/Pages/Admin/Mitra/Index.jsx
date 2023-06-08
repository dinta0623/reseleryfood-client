import { Text, Tabs, Paper, Flex, Avatar, Button, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useApi } from "@/utility/api";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ListMitra from "./List/Index";
import ListProduk from "./Menu/Index";

export default function Users() {
  const $navigate = useNavigate();
  const $user = useSelector((state) => state.user);
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [activeTab, setActiveTab] = useState("pengguna");
  const [mainLoading, setMainLoading] = useState(false);
  // useEffect(() => {
  //   console.log("test", $user);
  //   (async function fetchData() {
  //     try {
  //       setMainLoading(true);
  //       // const $resp = await useApi.get(`/mitra/${id}`);
  //       // setUsers($resp.result);
  //     } finally {
  //       setMainLoading(false);
  //     }
  //     //
  //   })();
  // }, []);
  return (
    <>
      <br />
      <Flex justify="space-between" align="center">
        <Title order={2}>Halaman Mitra</Title>

        <Button onClick={() => $navigate("/admin/mitra/daftar")}>
          Daftarkan Mitra
        </Button>
      </Flex>
      <br />
      <Tabs
        grow
        orientation="vertical"
        tabPadding="xl"
        value={activeTab}
        onTabChange={setActiveTab}
      >
        {!$isMobile && (
          <Tabs.List>
            <Tabs.Tab
              miw={200}
              h={50}
              value="pengguna"
              icon={<i className="ri-building-fill ri-lg"></i>}
            >
              Daftar Mitra
            </Tabs.Tab>
            <Tabs.Tab
              miw={200}
              h={50}
              value="mitra"
              icon={<i className="ri-store-fill ri-lg"></i>}
            >
              Daftar Menu
            </Tabs.Tab>
          </Tabs.List>
        )}

        <Tabs.Panel value="pengguna">
          {activeTab == "pengguna" && <ListMitra />}
        </Tabs.Panel>
        <Tabs.Panel value="mitra">
          {activeTab == "mitra" && <ListProduk />}
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
