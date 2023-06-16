import { useState } from "react";
import { Tabs, Text } from "@mantine/core";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "@/Components/Organism/Navbar";
import ItemBiodata from "./Biodata";
import RiwayatTransaksi from "./Transaksi";
import Keranjang from "./Keranjang";

export default function Profil() {
  const [activeTab, setActiveTab] = useState("biodata");
  return (
    <>
      <AtomsContainer mt="lg">
        <Tabs value={activeTab} onTabChange={setActiveTab}>
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
              Riwayat Pembelian
            </Tabs.Tab>
            <Tabs.Tab
              value="bantuan"
              icon={<i className="ri-logout-circle-fill ri-lg"></i>}
            >
              Pusat Bantuan
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="biodata" pt="xs">
            {activeTab == "biodata" && (
              <>
                <ItemBiodata></ItemBiodata>
              </>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="transaksi" pt="xs">
            {activeTab == "transaksi" && (
              <>
                <RiwayatTransaksi></RiwayatTransaksi>
              </>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="bantuan" pt="xs">
            {activeTab == "bantuan" && (
              <>
                <Text>email kami di :</Text>
                <Text underline color="blue">
                  id@reseleryfood.com
                </Text>
              </>
            )}
          </Tabs.Panel>
        </Tabs>
      </AtomsContainer>
    </>
  );
}
