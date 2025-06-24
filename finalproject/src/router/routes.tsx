// src/routes.tsx
import React from "react";
import {
    createBrowserRouter,
    RouteObject,
  } from "react-router-dom";
  
  import EmployeeLoginForm from "../component/page/EmployeePage/EmployeeLoginForm";
  import SAHomepage from "../component/page/EmployeePage/SystemAdminPage/SAHomepage";
  import SAAccountPage from "../component/page/EmployeePage/SystemAdminPage/SAAccountPage";
  import SATablePage from "../component/page/EmployeePage/SystemAdminPage/SATablePage";
  import SATransactionPage from "../component/page/EmployeePage/SystemAdminPage/SATransactionPage";
  import SAIngredientPage from "../component/page/EmployeePage/SystemAdminPage/SAIngredientPage";
  import SAIngredientStockPage from "../component/page/EmployeePage/SystemAdminPage/SAIngredientStockPage";
  import SAMenuPage from "../component/page/EmployeePage/SystemAdminPage/SAMenuPage";
  import SAIngredientbase from "../component/page/EmployeePage/SystemAdminPage/SAIngredientbase";
  import SAReadyMadeMenu from "../component/page/EmployeePage/SystemAdminPage/SAReadyMadePage";
  import ISHomepage from "../component/page/EmployeePage/InventorySupervisorPage/ISHomepage";
  import ISIngredientPage from "../component/page/EmployeePage/InventorySupervisorPage/ISIngredientpage";
  import ISIngredientStockPage from "../component/page/EmployeePage/InventorySupervisorPage/ISIngredientStockPage";
  import CHHomepage from "../component/page/EmployeePage/CashierPage/CashierHomePage";
  import SAOrderPage from "../component/page/EmployeePage/SystemAdminPage/SAOrderPage";
  import SAOrderItemPage from "../component/page/EmployeePage/SystemAdminPage/SAOrderItemPage";
  import SAReservationPage from "../component/page/EmployeePage/SystemAdminPage/SAReservationPage";
  import ISTransactionPage from "../component/page/EmployeePage/InventorySupervisorPage/ISTransactionPage";
  import ISMenuPage from "../component/page/EmployeePage/InventorySupervisorPage/ISMenuPage";
  import ISReadyMadeMenu from "../component/page/EmployeePage/InventorySupervisorPage/ISReadyMadePage";
  import ISIngredientbasePage from "../component/page/EmployeePage/InventorySupervisorPage/ISIngredientbasePage";
  import ISAddMenuPage from "../component/page/EmployeePage/InventorySupervisorPage/ISAddMenuPage";
  import CHMenuPage from "../component/page/EmployeePage/CashierPage/CashierMenuPage";
  import CHReservation from "../component/page/EmployeePage/CashierPage/CashierReservation";
  import CHOrderPage from "../component/page/EmployeePage/CashierPage/CashierOrderPage";
  import CHBillPage from "../component/page/EmployeePage/CashierPage/CashierBillPage";
  import CHOrderItemPage from "../component/page/EmployeePage/CashierPage/CashierOrderItem";
import HomePage from "../component/page/CustomerPage/HomePage";
import CustomerTablePage from "../component/page/CustomerPage/CustomerTablePage";
import CHTablePage from "../component/page/EmployeePage/CashierPage/CashierTablePage";
import CustomerLoginForm from "../component/page/CustomerPage/CustomerLoginPage";
import CustomerSignUpForm from "../component/page/CustomerPage/CustomerSignUpPage";
import CustomerOrderSelectionPage from "../component/page/CustomerPage/CustomerOrderPage";
import CutomerOrderMenuPage from "../component/page/CustomerPage/CustomerOrderMenu";
import CutomerOrderItemPage from "../component/page/CustomerPage/CustomerOrderItem";
import SABillPage from "../component/page/EmployeePage/SystemAdminPage/SABillPage";
import CutomerOrderRemainPage from "../component/page/CustomerPage/CustomerOrderRemain";
import CHBillHistoryPage from "../component/page/EmployeePage/CashierPage/CashierBillHistory";
  
  // แยก route แบบ declarative
  export const routes: RouteObject[] = [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/customersignin",
      element: <CustomerLoginForm />, 
    },
    {
      path: "/customersignup",
      element: <CustomerSignUpForm />,
    },
    {
      path: "/table",
      element: <CustomerTablePage />,
    },
    {
      path: "/order",
      children: [
        { index: true, element: <CustomerOrderSelectionPage /> },
        { path: ":order_id/menu", element: <CutomerOrderMenuPage /> },
        { path: ":order_id/orderremain", element: <CutomerOrderRemainPage /> },
        { path: ":order_id", element: <CutomerOrderItemPage /> },
      ]
    },
    {
      path: "/employee",
      element: <EmployeeLoginForm />,
    },
    {
      path: "/systemadmin",
      children: [
        { index: true, element: <SAHomepage /> },
        { path: "account", element: <SAAccountPage /> },
        { path: "table", element: <SATablePage /> },
        { path: "transaction", element: <SATransactionPage /> },
        { path: "ingredient", element: <SAIngredientPage /> },
        { path: "ingredient/:ingrId", element: <SAIngredientStockPage /> },
        { path: "menu", element: <SAMenuPage /> },
        { path: "menu/readymade/:menuId", element: <SAReadyMadeMenu/> },
        { path: "menu/ingrbase/:menuId", element: <SAIngredientbase/> },
        { path: "reservation", element: <SAReservationPage /> },
        { path: "order", element: <SAOrderPage /> },
        { path: "order/:orderId", element: <SAOrderItemPage /> },
        { path: "bill", element: <SABillPage /> },
      ],
    },
    {
      path: "/inventorysupervisor",
      children: [
        { index: true, element: <ISHomepage /> },
        { path: "menu", element: <ISMenuPage /> },
        { path: "menu/addMenu", element: <ISAddMenuPage /> },
        { path: "menu/readymade/:menuId", element: <ISReadyMadeMenu/> },
        { path: "menu/ingrbase/:menuId", element: <ISIngredientbasePage/> },
        { path: "ingredient", element: <ISIngredientPage /> },
        { path: "ingredient/:ingrId", element: <ISIngredientStockPage /> },
        { path: "transaction", element: <ISTransactionPage /> },
      ],
    },
    {
      path: "/cashier",
      children: [
        { index: true, element: <CHHomepage /> },
        { path: "menu", element: <CHMenuPage /> },
        { path: "table", element: <CHTablePage /> },
        { path: "reservation", element: <CHReservation /> },
        { path: "order", element: <CHOrderPage /> },
        { path: "order/:order_id", element: <CHOrderItemPage /> },
        { path: "bill", element: <CHBillPage /> },
        { path: "history", element: <CHBillHistoryPage /> },
      ],
    },
  ];
  