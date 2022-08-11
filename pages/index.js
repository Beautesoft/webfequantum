/* Auth Layout */
export { Login, ForgotPassword, ChangePassword } from "./Auth";

/* Admin Layout */

export {
  ListAppointment,
  CreateAppointment,
  AppointmentDetail,
  SelectTreatment,
} from "./Appointment";
export { Dashboard } from "./Dashboard";
export { NewDashboard } from "./NewDashboard";
export { Billing } from "./Billing";
export { CustomerReceipt } from "./Customer";
export {
  TransactionReceipt,
  TransactionPriceChange,
} from "./TransactionHistory";

export { Cart, CartNew, CartHome, TreatmentDone, BillOps } from "./Cart";
export { Catalog } from "./Catalog";
export { AddCustomer, ListCustomer, CustomerDetails } from "./Customer";
export { Payment } from "./Payment";
export { ListStaff, AddStaff, StaffDetails, StaffAvailability } from "./Staff";

export { ListSalons, CreateSalon, SalonDetails } from "./Saloon";
export { ListService, CreateService, ServiceDetails } from "./Services";
export { ListProduct, CreateProduct, ProductDetails } from "./Product";
export { Review } from "../component/Admin/Review";

export {
  NewListAppointment,
  NewCreateAppointment,
  NewAppointmentDetail,
  NewSelectTreatment,
  SMSReply,
  ConfirmBooking,
} from "./NewAppointment";

export { DayEndReport } from "./DayEndReport";

export {
  InventoryMainPage,
  AddStockMemo,
  AddStockReport,
  AddStockTake,
  AddStocksAdjustment,
  AddStocksDO,
  AddStocksGRN,
  AddStocksPO,
  AddStocksPOApproved,
  AddStocksPOHQ,
  AddStocksRTN,
  AddStocksTransferIn,
  AddStocksTransferOut,
  ListStockMemo,
  ListStockReport,
  ListStocksAdjustment,
  ListStocksDO,
  ListStocksGRN,
  ListStocksPO,
  ListStocksPOApproved,
  ListStocksPOHQ,
  ListStocksRTN,
  ListStocksTransferIn,
  ListStockTake,
  ListStocksTransferOut,
} from "./Inventory";

export { TransactionHistory } from "./TransactionHistory";

export {
  SmtpSettings,
  SmtpCreate,
  SmtpDetails,
  SetupTransDetails,
  SetupTransaction,
  SetupTransCreate,
  TermsCondition
} from "./Settings";

export {
  AddStaffPlus,
  ListStaffPlus,
  EmployeeInfo,
  StaffSchedule,
  SecurityAuthorization,
  StaffSkillList,
  AddStaffSkill,
  StaffPlusDetails,
  StaffPlusAvailability,
} from "./StaffPlus";

export {
  AddCustomerPlus,
  CustomerDetailsPlus,
  ListCustomerPlus,
  AccountDetails,
  TreatmentDetails,
  TreatmentCourseDetails,
  HoldSections,
  InvoiceHistorys,
  LoyaltyPointsManagement,
  AddRedeemPolicy,
  AddRewardPolicy,
  AddManualPoints,
  Settings,
  LoyaltyPointsManagementSettings,
  CustomerPlusEditLayout,
  OutstandingCustomerPlus,
} from "./CustomerPlus";
export {
  ItemMaster,
  DataEntry,
  Inventory,
  Backend,
  Division,
  Departmentlist,
  Departmentdata,
  Itemclasslist,
  Itemclassdata,
  Brandlist,
  Branddata,
  ItemUOM,
  CommissionData,
  Commissionlist,
  Itemclassproduct,
  Itemrangeproduct,
  Itemclassservice,
  Itemrangeservice,
  Itemclassvoucher,
  Itemrangevoucher,
  Itemclassprepaid,
  Itemrangeprepaid,
  Itemclasscompound,
  Itemrangecompound,
  Equipment,
  Equipmentdetails,
  Bookingstatus,
  Bookingstatuslist,
  Secondarystatus,
  Secondarystatuslist,
  Customermasterone,
  Customermasterdetails,
  Corporatedetails,
  Vendormaster,
  Vendordetails,
  EditItem,
  Editequiment,
  Editbookingstatus,
  Editsecondarystatus,
  Editproduct,
  Editservice,
  Editvoucher,
  Editprepaid,
  Editcompound,
  Editdepartment,
  EditItemclassdata,
  EditBrand,
  EditCommission,
  EditCorporate,
  EditCustomermaster,
  EditVendor,
} from "./Backend";

export { TCM, TCMCustomerList, TCMPaymentList } from "./TCM";

export {
  MobileListAppointment,
  MobileCreateAppointment,
  MobileSelectTreatment,
} from "./MobileAppointment";

export { ListProject, AddProject } from "./Project";

export {
  Commission,
  Amountsetting,
  Staffcommission,
  Managercommission,
  Monthlycommission,
} from "./Commission";

export { PayrollMain, Addpayroll } from "./Payroll";

export {
  ListPO,
  AddPO,
  AddQuotation,
  ListQuotation,
  QuantumMainPage,
  ManualAddQuotation,
  ManualListQuotation,
  ListWorkOrderInvoice,
  AddWorkOrderInvoice,
  ListDeliveryOrderModule,
  AddDeliveryOrder,
  PrintDeliverModule,
  PrintQuotationModule,
  ListEquipment,
  AddEquipment
} from "./Quantum";
