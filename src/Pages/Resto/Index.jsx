import { useState, useEffect } from "react";
import { Tabs, Title } from "@mantine/core";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "@/Components/Organism/Navbar";
import MenuResto from "./Menu/Index";
import KurirResto from "./Kurir/Index";
import TransaksiResto from "./Transaksi/Index";
import Ulasan from "./Ulasan/Index";
import { useApi } from "@/utility/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_MITRA } from "@/store/MitraSlice";
import { nprogress } from "@mantine/nprogress";

export default function Profil() {
  const $dispatch = useDispatch();
  const $user = useSelector((state) => state.user);
  const $mitra = useSelector((state) => state.mitra);
  const [activeTab, setActiveTab] = useState("menu");

  const [state, setState] = useState();
  useEffect(() => {
    // console.log("test", $user);
    (async function fetchData() {
      try {
        // setMainLoading(true);
        nprogress.start();
        const $resp = await useApi.get(`/mitra/${$user.mitra_id}`);
        $dispatch(SET_MITRA($resp.result));
      } finally {
        // setMainLoading(false);
        nprogress.complete();
      }
      //
    })();
  }, []);
  return (
    <>
      <Navbar />
      <br />

      <AtomsContainer>
        <Title order={1}>Resto {$mitra.name}</Title>
        <br />
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="menu"
              icon={<i className="ri-store-fill ri-lg"></i>}
            >
              Daftar Menu
            </Tabs.Tab>
            <Tabs.Tab
              value="transaksi"
              icon={<i className="ri-bill-fill ri-lg"></i>}
            >
              Pesanan (Transaksi)
            </Tabs.Tab>
            <Tabs.Tab
              value="kurir"
              icon={<i className="ri-car-fill ri-lg"></i>}
            >
              Kurir
            </Tabs.Tab>
            <Tabs.Tab
              value="ulasan"
              icon={<i className="ri-star-half-fill ri-lg"></i>}
            >
              Ulasan/Feedback
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="menu" pt="xs">
            {activeTab == "menu" && <MenuResto />}
          </Tabs.Panel>
          <Tabs.Panel value="transaksi" pt="xs">
            {activeTab == "transaksi" && <TransaksiResto />}
          </Tabs.Panel>
          <Tabs.Panel value="kurir" pt="xs">
            {activeTab == "kurir" && <KurirResto />}
          </Tabs.Panel>
          <Tabs.Panel value="ulasan" pt="xs">
            {activeTab == "ulasan" && <Ulasan />}
          </Tabs.Panel>
        </Tabs>
      </AtomsContainer>
    </>
  );
}
