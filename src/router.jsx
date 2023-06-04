import { createBrowserRouter, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Daftar from "./Pages/Authentication/Daftar";
import NotMatch from "./Pages/Notmatch";
import Rekomendasi from "./Pages/Rekomendasi";
import Masuk from "./Pages/Authentication/Masuk";
import Profil from "./Pages/Profil/Index";
import Admin from "./Pages/Admin/Index";
import EditUser from "./Pages/Admin/Users/Edit";
import SubmitMitra from "./Pages/Admin/Mitra/List/Submit";
import SubmitMenu from "./Pages/Admin/Mitra/Menu/Submit";
import Guard from "./Components/Organism/Guard";
import Navbar from "./Components/Organism/Navbar";
import Resto from "./Pages/Resto/Index";

export const ROLES = {
  admin: "admin",
  mitra: "mitra",
};

export const router = createBrowserRouter([
  {
    path: "/",
    meta: {
      name: "beranda",
      navigator: true,
    },
    element: <Home />,
  },
  {
    path: "/rekomendasi",
    meta: {
      name: "rekomendasi",
      navigator: true,
    },
    element: <Rekomendasi />,
  },

  {
    path: "/tentang",
    meta: {
      name: "tentang",
      navigator: true,
    },
    element: <Home />,
  },

  {
    path: "/profil",
    element: (
      <Guard
        isRouteAccessible={(state) => state.user?.isLogged}
        redirectRoute="/404"
      >
        <Profil />
      </Guard>
    ),
  },
  // admin
  {
    path: "/admin",
    element: (
      <Guard
        isRouteAccessible={(state) =>
          state.user?.isLogged && state.user?.roles?.includes(ROLES.admin)
        }
        redirectRoute="/404"
      >
        <Admin />
      </Guard>
    ),
    meta: {
      name: "admin",
      navigator: true,
      roles: [ROLES.admin],
    },
  },
  {
    path: "/admin/user/:id",
    element: (
      <Guard
        isRouteAccessible={(state) =>
          state.user?.isLogged && state.user?.roles?.includes(ROLES.admin)
        }
        redirectRoute="/404"
      >
        <Navbar />
        <EditUser />
      </Guard>
    ),
    meta: {
      name: "admin",
    },
  },
  {
    path: "/admin/mitra/daftar",
    element: (
      <Guard
        isRouteAccessible={(state) =>
          state.user?.isLogged && state.user?.roles?.includes(ROLES.admin)
        }
        redirectRoute="/404"
      >
        <Navbar />
        <SubmitMitra />
      </Guard>
    ),
    meta: {
      name: "admin",
    },
  },
  {
    path: "/admin/menu/daftar",
    element: (
      <Guard
        isRouteAccessible={(state) =>
          state.user?.isLogged && state.user?.roles?.includes(ROLES.admin)
        }
        redirectRoute="/404"
      >
        <Navbar />
        <SubmitMenu />
      </Guard>
    ),
    meta: {
      name: "admin",
    },
  },

  {
    path: "/resto",
    element: (
      <Guard
        isRouteAccessible={(state) =>
          state.user?.isLogged && state.user?.roles?.includes(ROLES.mitra)
        }
        redirectRoute="/404"
      >
        <Resto />
      </Guard>
    ),
    meta: {
      name: "resto",
      navigator: true,
      roles: [ROLES.mitra],
    },
  },

  // {
  //   path: "/resto",
  //   meta: {
  //     name: "resto",
  //   },
  //   element: <Home />,
  // },

  {
    path: "/daftar",
    element: <Daftar />,
  },
  {
    path: "/masuk",
    element: (
      <Guard
        isRouteAccessible={(state) => !state.user.isLogged}
        redirectRoute="/"
      >
        <Masuk />
      </Guard>
    ),
  },
  {
    path: "*",
    element: <NotMatch />,
  },
]);
