import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  useMap,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import { nprogress } from "@mantine/nprogress";
import { Modal, Select, Text, Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

const unramPos = [-8.5869073, 116.0921869];

const MapContent = ({ currMarker, setMainMarker }) => {
  const $map = useMap();
  const $mapEvent = useMapEvents({
    async click(payload) {
      nprogress.start();
      const pos = [payload.latlng.lat, payload.latlng.lng];
      setMainMarker({
        payload: {
          ...payload,
          ...(await (
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos[0]}&lon=${pos[1]}`
            )
          ).json()),
        },
        pos,
      });
      nprogress.complete();
    },
  });

  useEffect(() => {
    $mapEvent.flyTo(currMarker.pos, $mapEvent.getZoom());
  }, [currMarker.pos]);
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={currMarker.pos}></Marker>
    </>
  );
};

export default function AddMarker({
  title: titleMarker,
  isMapMarker,
  setMapMarkerClose,
  setAddress,
}) {
  const [search, setSearch] = useState("");
  const [dataSearch, setDataSearch] = useState(null);
  const [currMarker, setCurrMarker] = useState({
    payload: null,
    pos: unramPos,
  });
  const $isMobile = useMediaQuery("(max-width: 80em)");

  const searchAddress = async (payload) => {
    nprogress.start();
    const search = payload.currentTarget.value;
    if (search) {
      const result = await (
        await fetch(
          `https://nominatim.openstreetmap.org/search/${search}?format=json&limit=10&polygon_svg=1`
        )
      ).json();
      if (result?.length > 0) {
        setSearch("");
        setDataSearch(
          result.map((item) => ({
            value: item,
            label: item.display_name,
          }))
        );
      }
    }
    nprogress.complete();
  };

  const onAddressSelected = (payload) => {
    if (payload) {
      setCurrMarker({
        payload,
        pos: [payload.lat, payload.lon],
      });
    }
  };

  return (
    <>
      <Modal
        opened={isMapMarker}
        onClose={setMapMarkerClose}
        title={titleMarker || "Set Poin Lokasi Resto"}
        size={$isMobile ? "100%" : "70%"}
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
      >
        <MapContainer
          center={unramPos}
          zoom={18}
          style={{ width: "100%", minHeight: "350px", cursor: "pointer" }}
        >
          <MapContent currMarker={currMarker} setMainMarker={setCurrMarker} />
        </MapContainer>
        <br />
        <Text>
          <strong>Lokasi : </strong>latitude ({currMarker.pos[0]}) dengan
          longtitude, ({currMarker.pos[1]})
        </Text>
        <Text>
          <strong>Alamat :</strong> {currMarker?.payload?.display_name}
        </Text>
        <Select
          mt="md"
          searchable
          clearable
          label="Cari Berdasarkan Alamat"
          placeholder="Ketikkan alamat, lalu tekan `Enter` untuk mencari"
          searchValue={search}
          onSearchChange={setSearch}
          onChange={onAddressSelected}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchAddress(e);
            }
          }}
          data={dataSearch || []}
        />
        <Button
          disabled={!currMarker.payload || !currMarker.pos}
          type="submit"
          mt="xl"
          fullWidth
          onClick={() => {
            setAddress(currMarker);
            setMapMarkerClose();
          }}
        >
          Simpan Lokasi
        </Button>
      </Modal>
    </>
  );
}
