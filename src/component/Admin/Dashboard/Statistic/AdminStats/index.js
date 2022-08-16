import React from "react";
import {
  QuickStats,
  CustomerStats,
  StaffServices,
  IncomeStats,
  SalesBySalon,
  SalesByProduct,
  SalesByCategory,
  CustomerByCountry,
  InvoicesStats,
  Logs,
  NewQuickStats,
  NewQuickChart,
  NewQuickTopSale,
  NewStaffStats,
} from "../index";

export class AdminStats extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        {/* <QuickStats /> */}
        <NewStaffStats />
        <NewQuickStats />
        <NewQuickChart />
        <NewQuickTopSale />
      </div>
    );
  }
}
