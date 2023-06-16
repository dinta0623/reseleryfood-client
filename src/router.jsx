import { createBrowserRouter, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Daftar from "./Pages/Authentication/Daftar";
import NotMatch from "./Pages/Notmatch";
import Rekomendasi from "./Pages/Rekomendasi/Index";
import CariMenu from "./Pages/Rekomendasi/Detail/CariMenu";
import Masuk from "./Pages/Authentication/Masuk";
import Profil from "./Pages/Profil/Index";
import Keranjang from "./Pages/Keranjang/Index";

// admin page
import Admin from "./Pages/Admin/Index";
import EditUserAdmin from "./Pages/Admin/Users/Submit";
import SubmitMitraAdmin from "./Pages/Admin/Mitra/List/Submit";
import SubmitMenuAdmin from "./Pages/Admin/Mitra/Menu/Submit";

// resto page
import SubmitMenuResto from "./Pages/Resto/Menu/Submit";
import Resto from "./Pages/Resto/Index";
import { useSelector } from "react-redux";

import Guard from "./Components/Organism/Guard";
import Navbar from "./Components/Organism/Navbar";
import Layout from "./Components/Organism/Layout";

export const ROLES = {
  admin: "admin",
  mitra: "mitra",
  customer: "customer",
  kurir: "kurir",
};

export const router = createBrowserRouter([
  // {
  //   path: "/rekomendasi",
  //   meta: {
  //     name: "rekomendasi",
  //     navigator: true,
  //   },
  //   element: (
  //     <Guard isRouteAccessible={() => true} redirectRoute="/404">
  //       <Navbar />
  //       <Rekomendasi />
  //     </Guard>
  //   ),
  // },

  // {
  //   path: "/profil",
  //   element: (
  //     <Guard
  //       isRouteAccessible={(state) => state.user?.isLogged}
  //       redirectRoute="/404"
  //     >
  //       <Profil />
  //     </Guard>
  //   ),
  // },
  // admin

  // {
  //   path: "/admin/menu/:id",
  //   element: (
  //     <Guard
  //       isRouteAccessible={(state) =>
  //         state.user?.isLogged && state.user?.roles?.includes(ROLES.admin)
  //       }
  //       redirectRoute="/404"
  //     >
  //       <Navbar />
  //       <SubmitMenu />
  //     </Guard>
  //   ),
  //   meta: {
  //     name: "admin",
  //   },
  // },

  // {
  //   path: "/resto/menu/daftar",
  //   element: (
  //     <Guard
  //       isRouteAccessible={(state) =>
  //         state.user?.isLogged && state.user?.roles?.includes(ROLES.mitra)
  //       }
  //       redirectRoute="/404"
  //     >
  //       <Navbar />
  //       <SubmitMenuResto />
  //     </Guard>
  //   ),
  //   meta: {
  //     name: "submit menu by resto",
  //   },
  // },

  // {
  //   path: "/resto/menu/:id",
  //   element: (
  //     <Guard
  //       isRouteAccessible={(state) =>
  //         state.user?.isLogged && state.user?.roles?.includes(ROLES.mitra)
  //       }
  //       redirectRoute="/404"
  //     >
  //       <Navbar />
  //       <SubmitMenuResto />
  //     </Guard>
  //   ),
  //   meta: {
  //     name: "submit menu by resto",
  //   },
  // },
  {
    path: "/",
    element: () => <Layout element={<Home />} />,
    meta: {
      name: "Beranda",
      navigator: true,
    },
  },
  {
    path: "/rekomendasi",
    element: () => <Layout element={<Rekomendasi />} />,
    meta: {
      name: "rekomendasi",
      navigator: true,
    },
  },
  {
    path: "/rekomendasi/menu",
    element: () => <Layout element={<CariMenu />} />,
    meta: {
      name: "Rekomendas Menu",
    },
  },
  {
    path: "/tentang",
    element: () => <Layout element={<Home />} />,
    meta: {
      name: "Tentang",
      navigator: true,
    },
  },
  {
    path: "/masuk",
    element: () => <Masuk />,
    meta: {
      name: "Masuk",
      redirectRoute: "/",
      validate: ({ $state }) => !$state?.user?.isLogged,
    },
  },

  {
    path: "/keranjang",
    element: () => <Layout element={<Keranjang />} />,
    meta: {
      name: "Keranjang Anda",
      redirectRoute: "/",
      validate: ({ $state }) =>
        $state?.user?.isLogged && $state?.user?.roles?.includes(ROLES.customer),
    },
  },

  // admin
  {
    path: "/admin",
    element: () => <Layout element={<Admin />} />,
    meta: {
      name: "admin",
      navigator: true,
      validate: ({ $state }) =>
        $state?.user?.isLogged && $state?.user?.roles?.includes(ROLES.admin),
    },
  },
  {
    path: "/admin/user/:id",
    element: () => <Layout element={<EditUserAdmin />} />,
    meta: {
      name: "Admin - Edit User",
      validate: ({ $state }) =>
        $state?.user?.isLogged && $state?.user?.roles?.includes(ROLES.admin),
    },
  },
  {
    path: "/admin/mitra/daftar",
    element: () => <Layout element={<SubmitMitraAdmin />} />,
    meta: {
      name: "Admin - Tambah Mitra",
      validate: ({ $state }) =>
        $state?.user?.isLogged && $state?.user?.roles?.includes(ROLES.admin),
    },
  },
  {
    path: "/admin/mitra/:id",
    element: () => <Layout element={<SubmitMitraAdmin />} />,
    meta: {
      name: "Admin - Edit Mitra",
      validate: ({ $state }) =>
        $state?.user?.isLogged && $state?.user?.roles?.includes(ROLES.admin),
    },
  },
  {
    path: "/admin/menu/daftar",
    element: () => <Layout element={<SubmitMenuAdmin />} />,
    meta: {
      name: "Admin - Tambah Menu",
      validate: ({ $state }) =>
        $state?.user?.isLogged && $state?.user?.roles?.includes(ROLES.admin),
    },
  },

  // mitra/resto
  {
    path: "/resto",
    element: () => <Layout element={<Resto />} />,
    meta: {
      name: "Resto/Mitra",
      navigator: true,
      validate: ({ $state }) =>
        $state?.user?.isLogged &&
        $state?.user?.roles?.includes(ROLES.mitra) &&
        $state?.mitra?.id,
    },
  },

  {
    path: "/daftar",
    element: () => <Daftar />,
    meta: {
      name: "Daftar",
      redirectRoute: "/",
      validate: ({ $state }) => !$state?.user?.isLogged,
    },
  },
  {
    path: "/profil",
    element: () => <Layout element={<Profil />} />,
    meta: {
      name: "Profil Akun",
      validate: ({ $state }) => $state?.user?.isLogged,
    },
  },
  {
    path: "*",
    element: () => <NotMatch />,
  },
]);
