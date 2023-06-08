import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, element }) {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh" }}>{element}</div>
      <br />
      <br />
      <Footer />
    </>
  );
}
