import { useState } from "react";
import { Tabs, Title } from "@mantine/core";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "@/Components/Organism/Navbar";
import Users from "./Users/Index";
import Mitra from "./Mitra/Index";
import Transaksi from "./Transaksi/Index";
import Kurir from "./Kurir/Index";
import Ulasan from "./Ulasan/Index";

export default function Profil() {
  const [activeTab, setActiveTab] = useState("pengguna");

  return (
    <>
      <AtomsContainer mt="lg">
        <Title order={1}>Admin</Title>
        <br />
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="pengguna"
              icon={<i className="ri-user-fill ri-lg"></i>}
            >
              Pengguna
            </Tabs.Tab>
            <Tabs.Tab
              value="mitra"
              icon={<i className="ri-building-line ri-lg"></i>}
            >
              Mitra
            </Tabs.Tab>
            <Tabs.Tab
              value="transaksi"
              icon={<i className="ri-bill-fill ri-lg"></i>}
            >
              Transaksi
            </Tabs.Tab>
            <Tabs.Tab
              value="kurir"
              icon={<i className="ri-car-fill ri-lg"></i>}
            >
              Kurir Aktif
            </Tabs.Tab>
            <Tabs.Tab
              value="ulasan"
              icon={<i className="ri-star-half-fill ri-lg"></i>}
            >
              Ulasan/Feedback
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pengguna" pt="xs">
            {activeTab == "pengguna" && <Users />}
          </Tabs.Panel>
          <Tabs.Panel value="mitra" pt="xs">
            {activeTab == "mitra" && <Mitra />}
          </Tabs.Panel>
          <Tabs.Panel value="transaksi" pt="xs">
            {activeTab == "transaksi" && <Transaksi />}
          </Tabs.Panel>
          <Tabs.Panel value="kurir" pt="xs">
            {activeTab == "kurir" && <Kurir />}
          </Tabs.Panel>
          <Tabs.Panel value="ulasan" pt="xs">
            {activeTab == "ulasan" && <Ulasan />}
          </Tabs.Panel>
        </Tabs>
      </AtomsContainer>
    </>
  );
}
