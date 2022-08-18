import { AppointmentActionType } from "redux/actions/actionType";

const initialState = {
  customerDetail: {
    customerName: "",
    appointmentDate: "",
    appointmentTime: "",
    bookingStatus: "",
  },
  appointmentDetail: {
    // "cust_noid": 3,
    // "cust_refer": null,
    // "emp_name": "Narsim",
    // "emp_noid": 3,
    // "id": 15,
    // "cust_name": "Charu",
    // "Appt_date": "2020-08-03",
    // "Appt_Fr_time": "04:00",
    // "Appt_Status": "booking"
  },
  treatmentList: [],
  treatmentStockList: [],
  treatmentResponse: {},
  selectedTreatment: {
    products_used: "",
    recurring_appointment: "",
  },
  treatmentOutletDetail: {},
  treatmentDetail: {
    outlet: "",
    emp_no: "",
    Trmt_Room_Code: "",
    cus_requests: "",
    Treatment_No: "",
  },
  selectedTreatmentList: [],
  confirmedBookedList: [],
  bookAppointmentList: [],
  appointmentCartList: [],
  multipleCustomerForm: {
    noOfCustomer: 1,
    treatment: "",
    room: "",
  },
  appointmentTreatmentList: [],
  appointmentCustomerDetail: {},
  basicApptDetail: {},
  AppointmentCopy: {},
  SchedulerSetting: {},
  CartPaymentDate: {},
  SelectedPackage: "",
  SelectedInventoryMenu: "/",
  SelectedQuantumMenu: "/",
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case "customerDetail":
      return {
        ...state,
        customerDetail: payload,
      };
    case "multipleCustomerForm":
      return {
        ...state,
        multipleCustomerForm: payload,
      };
    case AppointmentActionType.appointmentDetail:
      return {
        ...state,
        appointmentDetail: payload,
      };
    case AppointmentActionType.getTreatmentDetail:
      return {
        ...state,
        treatmentResponse: payload,
      };
    case "selectedTreatment":
      return {
        ...state,
        selectedTreatment: payload,
      };
    case AppointmentActionType.getOutletDetail:
      return {
        ...state,
        treatmentOutletDetail: payload,
      };
    case "treatmentDetail":
      return {
        ...state,
        treatmentDetail: payload,
      };
    case AppointmentActionType.getSelectedTreatmentList:
      return {
        ...state,
        selectedTreatmentList: payload,
      };
    case AppointmentActionType.getConfirmedBookingList:
      return {
        ...state,
        confirmedBookedList: payload,
      };
    case AppointmentActionType.getBookAppointmentList:
      return {
        ...state,
        bookAppointmentList: payload,
      };
    case AppointmentActionType.getAppointmentCartList:
      return {
        ...state,
        appointmentCartList: payload,
      };
    case "appointmentCustomerDetail":
      return {
        ...state,
        appointmentCustomerDetail: payload,
      };
    case "treatmentList":
      return {
        ...state,
        appointmentTreatmentList: payload,
      };
    case "basicApptDetail":
      return {
        ...state,
        basicApptDetail: payload,
      };
    case "AppointmentCopy":
      return {
        ...state,
        AppointmentCopy: payload,
      };
    case "SchedulerSetting":
      return {
        ...state,
        SchedulerSetting: payload,
      };
    case "CartPaymentDate":
      return {
        ...state,
        CartPaymentDate: payload,
      };
    case "Select_Package":
      return {
        ...state,
        Select_Package: payload,
      };
    case "SelectedInventoryMenu":
      return {
        ...state,
        SelectedInventoryMenu: payload,
      };
    case "SelectedQuantumMenu":
      return {
        ...state,
        SelectedQuantumMenu: payload,
      };
    default:
      return state;
  }
};
