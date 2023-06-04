import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function Guard({ isRouteAccessible, children, redirectRoute }) {
  const $user = useSelector((state) => state);
  if (!isRouteAccessible($user)) {
    return <Navigate to={redirectRoute} replace />;
  }
  return children;
}
