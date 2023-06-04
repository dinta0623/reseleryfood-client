import { useState } from "react";
import { Tabs, Text } from "@mantine/core";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "@/Components/Organism/Navbar";
import ItemBiodata from "./ItemBiodata";
import RiwayatTransaksi from "./Transaksi";
import Keranjang from "./Keranjang";

export default function Profil() {
  const [state, setState] = useState();
  return (
    <>
      <Navbar />
      <br />

      <AtomsContainer>
        <Tabs defaultValue="biodata">
          <Tabs.List>
            <Tabs.Tab
              value="biodata"
              icon={<i className="ri-user-fill ri-lg"></i>}
            >
              Biodata Anda
            </Tabs.Tab>
            <Tabs.Tab
              value="transaksi"
              icon={<i className="ri-bill-fill ri-lg"></i>}
            >
              Riwayat Transaksi
            </Tabs.Tab>
            <Tabs.Tab
              value="keranjang"
              icon={<i className="ri-store-3-fill ri-lg"></i>}
            >
              Keranjang Anda
            </Tabs.Tab>
            <Tabs.Tab
              value="bantuan"
              icon={<i className="ri-logout-circle-fill ri-lg"></i>}
            >
              Pusat Bantuan
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="biodata" pt="xs">
            <ItemBiodata></ItemBiodata>
          </Tabs.Panel>

          <Tabs.Panel value="transaksi" pt="xs">
            <RiwayatTransaksi></RiwayatTransaksi>
          </Tabs.Panel>

          <Tabs.Panel value="keranjang" pt="xs">
            <Keranjang></Keranjang>
          </Tabs.Panel>
          <Tabs.Panel value="bantuan" pt="xs">
            <Text>email kami di :</Text>
            <Text underline color="blue">
              id@reseleryfood.com
            </Text>
          </Tabs.Panel>
        </Tabs>
      </AtomsContainer>
    </>
  );
}
