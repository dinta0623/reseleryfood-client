import { useState } from "react";
import { Tabs, Title } from "@mantine/core";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "@/Components/Organism/Navbar";
import MenuResto from "./Menu/Index";
import KurirResto from "./Kurir/Index";
import TransaksiResto from "./Transaksi/Index";
import Ulasan from "./Ulasan/Index";

export default function Profil() {
  const [state, setState] = useState();

  return (
    <>
      <Navbar />
      <br />

      <AtomsContainer>
        <Title order={1}>Resto ###</Title>
        <br />
        <Tabs defaultValue="menu">
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
            <MenuResto></MenuResto>
          </Tabs.Panel>
          <Tabs.Panel value="transaksi" pt="xs">
            <TransaksiResto></TransaksiResto>
          </Tabs.Panel>
          <Tabs.Panel value="kurir" pt="xs">
            <KurirResto></KurirResto>
          </Tabs.Panel>
          <Tabs.Panel value="ulasan" pt="xs">
            <Ulasan></Ulasan>
          </Tabs.Panel>
        </Tabs>
      </AtomsContainer>
    </>
  );
}
