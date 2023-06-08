import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function Guard({ isRouteAccessible, children, redirectRoute }) {
  if (!isRouteAccessible()) {
    return <Navigate to={redirectRoute || "/404"} replace />;
  }
  return children;
}
