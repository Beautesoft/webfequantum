import { generateQuery } from "./helperFunctions";
import { getStaffBranchwise } from "redux/actions/staff";

export const authApi = {
  login: {
    api: "login",
    method: "post",
    baseURL: "normal",
  },
  logout: {
    api: "logout",
    method: "post",
    baseURL: "token",
  },
  getSaloon: {
    api: "branchlogin/",
    method: "get",
    baseURL: "nomal",
  },
  // login: {
  //   api: 'user/login',
  //   method: 'post',
  //   baseURL: 'normal',
  // },
  forgotPassword: {
    api: "otp/",
    method: "post",
    baseURL: "normal",
  },
  verifyOtp: {
    url: "otpvalidate/",
    id: "",
    method: "post",
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "normal",
  },
  resetPassword: {
    url: "passwordreset/",
    method: "post",
    id: "",
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "normal",
  },
  getTokenDetails: {
    api: "userlist/",
    method: "get",
    baseURL: "token",
  },
  // changePassword: {
  //   url: 'user/reset_password',
  //   method: 'post',
  //   query: {
  //     token: null,
  //   },
  //   get api() {
  //     return this.url + generateQuery(this.query);
  //   },
  //   set addQuery({ key, payload }) {
  //     this.query[key] = payload;
  //   },
  //   baseURL: 'token',
  // },
};

export const appointment = {
  addAppointment: {
    api: "appointment/",
    method: "post",
    baseURL: "token",
  },
  addTreatment: {
    api: "treatmentdetails/",
    method: "post",
    baseURL: "token",
  },
  addBooking: {
    url: "treatment/",
    method: "patch",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateTreatment: {
    url: "itemcart/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  holdTreatment: {
    url: "itemcart/",
    method: "patch",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  deleteTreatment: {
    url: "itemcart/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  getTreatment: {
    url: "itemdept/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getTreatmentDetailList: {
    url: "stocklist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getTreatmentDetail: {
    url: "treatmentstock/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getOutletDetail: {
    url: "treatmentdetails/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  getCartList: {
    url: "itemcart/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  updateAppointment: {
    url: "appointment/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteAppointment: {
    url: "appointment/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getAppointment: {
    url: "appointment/",
    method: "get",
    id: "",
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const saloon = {
  addSaloon: {
    api: "salon/",
    method: "post",
    baseURL: "token",
  },
  updateSaloon: {
    url: "salon/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteSaloon: {
    url: "salon/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getSaloon: {
    url: "salon/",
    method: "get",
    id: "",
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const staff = {
  addStaff: {
    api: "staffs/",
    method: "post",
    baseURL: "normal",
  },
  updateStaff: {
    url: "staffs/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteStaff: {
    url: "staffs/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getStaff: {
    url: "staffs/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getStaffAvailability: {
    url: "shiftdatewise/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getStaffBranchwise: {
    url: "employeebranchwise/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const customer = {
  addCustomer: {
    api: "customer/",
    method: "post",
    baseURL: "token",
  },
  updateCustomer: {
    url: "customer/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getCustomer: {
    url: "customer/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id + "/";
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  addHoldItem: {
    api: "holditem/issued/",
    method: "post",
    baseURL: "token",
  },
};

export const services = {
  addServices: {
    api: "services/",
    method: "post",
    baseURL: "token",
  },
  updateServices: {
    url: "services/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteServices: {
    url: "services/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getServices: {
    url: "services/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getComboServices: {
    url: "comboservices/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const payment = {
  addPayment: {
    url: "postaud/",
    method: "post",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updatePayment: {
    url: "postaud/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deletePayment: {
    url: "postaud/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getPayment: {
    url: "postaud/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const Products = {
  addProduct: {
    api: "add_product",
    method: "post",
    baseURL: "normal",
  },
};

export const common = {
  addBranch: {
    api: "branch/",
    method: "post",
    baseURL: "normal",
  },
  updateBranch: {
    url: "branch/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  commonPatch: {
    url: "",
    method: "patch",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getCommon: {
    url: "",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  addCommon: {
    url: "",
    method: "post",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateCommon: {
    url: "",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteCommon: {
    url: "",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getBranch: {
    url: "branch/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getJobtitle: {
    api: "jobtitle/",
    method: "get",
    baseURL: "token",
  },
  getShift: {
    url: "shiftlist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getCategory: {
    api: "category/",
    method: "get",
    baseURL: "token",
  },
  getSkills: {
    api: "skills",
    method: "get",
    baseURL: "token",
  },
  getCustomer: {
    api: "customers/all/",
    method: "get",
    baseURL: "token",
  },
};

export const staffPlus = {
  addStaff: {
    api: "staffPlus/",
    method: "post",
    baseURL: "normal",
  },
  updateEmpInfo: {
    url: "/EmpInfo/",
    method: "put",
    id: null,
    get api() {
      return "staffPlus/" + this.id + this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateStaff: {
    url: "staffPlus/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteStaff: {
    url: "staffPlus/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getWorkSchedule: {
    url: "/WorkSchedule/",
    method: "get",
    id: null,
    get api() {
      return "staffPlus/" + this.id + this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateWorkSchedule: {
    url: "/WorkSchedule/",
    method: "put",
    id: null,
    get api() {
      return "staffPlus/" + this.id + this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getSchedule: {
    url: "WorkScheduleMonth/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateSchedule: {
    url: "WorkScheduleMonth/",
    method: "post",
    get api() {
      return this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getAllEmpSchedule: {
    url: "MonthlyAllSchedule/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getStaff: {
    url: "staffPlus/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getStaffPlus: {
    url: "staffPlus/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getSkillList: {
    url: "EmployeeSkills/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getEmpSkillList: {
    url: "staffPlus/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id + "/StaffSkills/";
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateEmpSkillList: {
    url: "staffPlus/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id + "/StaffSkills/";
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getSecurityAuthorizationSettings: {
    url: "EmployeeSecuritySettings/",
    method: "get",
    get api() {
      return this.url;
    },
    baseURL: "token",
  },
  updateSecurityAuthorizationSettings: {
    url: "EmployeeSecuritySettings/",
    method: "post",
    get api() {
      return this.url;
    },
    baseURL: "token",
  },
  getIndividualAuthorizationSettings: {
    url: "IndividualEmpSettings/",
    id: null,
    method: "get",
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateIndividualAuthorizationSettings: {
    url: "IndividualEmpSettings/",
    id: null,
    method: "post",
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const customerPlus = {
  getMGMdetails: {
    url: "CustomerPlus/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id + "/MGM";
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  addCustomerPlus: {
    api: "CustomerPlus/",
    method: "post",
    baseURL: "token",
  },
  updateCustomerPlus: {
    url: "CustomerPlus/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getCustomerPlus: {
    url: "CustomerPlus/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getCustomerPlusSettings: {
    url: "CustomerFormSettings/",
    method: "get",
    id: null,
    get api() {
      if (this.id == null) return this.url;
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateCustomerPlusSettings: {
    url: "CustomerFormSettings/",
    method: "put",
    get api() {
      return this.url;
    },
    baseURL: "token",
  },
  getDiagnosisPhotos: {
    url: "CustomerPlus/",
    method: "get",
    id: null,
    params: "",
    get api() {
      return this.url + this.id + "/photoDiagnosis/" + this.params;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  addDiagnosisPhoto: {
    url: "PhotoDiagnosis/",
    method: "post",
    get api() {
      return this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateDiagnosisPhoto: {
    url: "PhotoDiagnosis/",
    id: null,
    method: "put",
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getDiagnosisHistory: {
    url: "CustomerPlus/",
    method: "get",
    id: null,
    params: "",
    get api() {
      return this.url + this.id + "/photoDiagnosisCompare/" + this.params;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  addDiagnosisHistory: {
    url: "DiagnosisCompare/",
    method: "post",
    get api() {
      return this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateDiagnosisHistory: {
    url: "DiagnosisCompare/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  customerProjectList:{
    url:"customerprojectlist/",
    method:"get",
    get api() {
      return this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  }
};

export const lpManagement = {
  getCustomerPoints: {
    url: "CustomerPlus/",
    method: "get",
    id: null,
    params: "",
    get api() {
      return this.url + this.id + "/CustomerPoints" + this.params;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  addManualPoints: {
    url: "CustomerPlus/",
    method: "post",
    id: null,
    params: "",
    get api() {
      return this.url + this.id + "/CustomerPoints/" + this.params;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getRewardPolicy: {
    url: "RewardPolicy",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  addRewardPolicy: {
    url: "RewardPolicy/",
    method: "post",
    get api() {
      return this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateRewardPolicy: {
    url: "RewardPolicy/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getRedeemPolicy: {
    url: "RedeemPolicy",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  addRedeemPolicy: {
    url: "RedeemPolicy/",
    method: "post",
    get api() {
      return this.url;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  updateRedeemPolicy: {
    url: "RedeemPolicy/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const multiLanguage = {
  getMultiLanguage: {
    api: "MultiLanguage",
    method: "get",
    baseURL: "normal",
  },
};

/*         ********************* BACKEND  ***********************             */

export const Backend = {
  ReverseTrmtReason: {
    url: "ReverseTrmtReasons",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  updateCommon: {
    url: "",
    method: "post",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "backend",
  },

  Newappointreason: {
    url: "ReverseTrmtReasons",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Diagnosissetups: {
    url: "Diagnosissetups",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewDiagosissetup: {
    url: "Diagnosissetups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Myequipments: {
    url: "Myequipments",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewMyequipments: {
    url: "Myequipments",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Rooms: {
    url: "Rooms",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewRooms: {
    url: "Rooms",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  BlockReason: {
    url: "BlockReasons",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewBlockReason: {
    url: "BlockReasons",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  AppointmentGroups: {
    url: "AppointmentGroups",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewAppointmentGroups: {
    url: "AppointmentGroups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ApptBookingStatuses: {
    url: "ApptBookingStatuses",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewApptBookingStatuses: {
    url: "ApptBookingStatuses",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ApptTypes: {
    url: "ApptTypes",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewApptTypes: {
    url: "ApptTypes",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ApptSecondaryStatuses: {
    url: "ApptSecondaryStatuses",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewApptSecondaryStatuses: {
    url: "ApptSecondaryStatuses",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemStatusGroups: {
    url: "ItemStatusGroups",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemStatusGroups: {
    url: "ItemStatusGroups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemStatuses: {
    url: "ItemStatuses",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemStatuses: {
    url: "ItemStatuses",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  PaymentRemarks: {
    url: "PaymentRemarks",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewPaymentRemarks: {
    url: "PaymentRemarks",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  FocReasons: {
    url: "FocReasons",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewFocReasons: {
    url: "FocReasons",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Occupationtypes: {
    url: "Occupationtypes",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewOccupationtypes: {
    url: "Occupationtypes",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Sources: {
    url: "Sources",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewSources: {
    url: "Sources",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  TransactionReasons: {
    url: "TransactionReasons",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewTransactionReasons: {
    url: "TransactionReasons",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  VoidReasons: {
    url: "VoidReasons",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewVoidReasons: {
    url: "VoidReasons",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Businesshrs: {
    url: "Businesshrs",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewBusinesshrs: {
    url: "Businesshrs",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  TaxType1TaxCodes: {
    url: "TaxType1TaxCodes",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewTaxType1TaxCodes: {
    url: "TaxType1TaxCodes",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  TaxType2TaxCodes: {
    url: "TaxType2TaxCodes",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewTaxType2TaxCodes: {
    url: "TaxType2TaxCodes",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  BrManuals: {
    url: "BrManuals",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewBrManuals: {
    url: "BrManuals",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  getStocks: {
    url: "Stocks",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewStocks: {
    url: "Stocks",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemDivs: {
    url: "ItemDivs",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemUom: {
    url: "ItemUoms",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemUom: {
    url: "ItemUoms",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  SiteGroups: {
    url: "SiteGroups",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemSitelists: {
    url: "ItemSitelists",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  /*
  VoucherConditions:
  {
    url:"VoucherConditions",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },*/

  ItemBrands: {
    url: "ItemBrands",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemBrands: {
    url: "ItemBrands",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemSupplies: {
    url: "ItemSupplies",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemSupplies: {
    url: "ItemSupplies",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemDepts: {
    url: "ItemDepts",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemDepts: {
    url: "ItemDepts",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  ItemStocklists: {
    url: "ItemStocklists",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewItemStocklists: {
    url: "ItemStocklists",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemLinks: {
    url: "ItemLinks",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemLinks: {
    url: "ItemLinks",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemClasses: {
    url: "ItemClasses",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemClasses: {
    url: "ItemClasses",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  RewardPolicies: {
    url: "RewardPolicies",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewRewardPolicies: {
    url: "RewardPolicies",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  RedeemLists: {
    url: "RedeemLists",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewRedeemLists: {
    url: "RedeemLists",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Securities: {
    url: "Securities",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewSecurities: {
    url: "Securities",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Cities: {
    url: "Cities",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewCities: {
    url: "Cities",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  States: {
    url: "States",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewStates: {
    url: "States",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Countries: {
    url: "Countries",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewCountries: {
    url: "Countries",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  CommGroupHdrs: {
    url: "CommGroupHdrs",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  EmpLevels: {
    url: "EmpLevels",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewEmpLevels: {
    url: "EmpLevels",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewSiteGroups: {
    url: "SiteGroups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemSitelists: {
    url: "ItemSitelists",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  rangelists: {
    url: "rangelists",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Newrangelists: {
    url: "rangelists",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  PayGroups: {
    url: "PayGroups",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewPayGroups: {
    url: "PayGroups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemTypes: {
    url: "ItemTypes",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemUomprices: {
    url: "ItemUomprices",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemUomprices: {
    url: "ItemUomprices",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Itemusagelists: {
    url: "Itemusagelists",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewItemusagelists: {
    url: "Itemusagelists",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Usagelevels: {
    url: "Usagelevels",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewUsagelevels: {
    url: "Usagelevels",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewPrepaidOpenConditions: {
    url: "PrepaidOpenConditions",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  PrepaidOpenConditions: {
    url: "PrepaidOpenConditions",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ItemBatches: {
    url: "ItemBatches",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  ItemRanges: {
    url: "ItemRanges",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewItemRanges: {
    url: "ItemRanges",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  GstSettings: {
    url: "GstSettings",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewGstSettings: {
    url: "GstSettings",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  Races: {
    url: "Races",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewRaces: {
    url: "Races",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Agegroups: {
    url: "Agegroups",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewAgegroups: {
    url: "Agegroups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Corporatecustomers: {
    url: "Corporatecustomers",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewCorporatecustomers: {
    url: "Corporatecustomers",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  SkinTypes: {
    url: "SkinTypes",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewSkinTypes: {
    url: "SkinTypes",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  NewCommGroupHdrs: {
    url: "CommGroupHdrs",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Languages: {
    url: "Languages",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewLanguages: {
    url: "Languages",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Locations: {
    url: "Locations",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewLocations: {
    url: "Locations",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Genders: {
    url: "Genders",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewGenders: {
    url: "Genders",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  CustomerClasses: {
    url: "CustomerClasses",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewCustomerClasses: {
    url: "CustomerClasses",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  CustomerTypes: {
    url: "CustomerTypes",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewCustomerTypes: {
    url: "CustomerTypes",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  CustomerGroups: {
    url: "CustomerGroups",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewCustomerGroups: {
    url: "CustomerGroups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  CustomerGroup2s: {
    url: "CustomerGroup2s",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewCustomerGroup2s: {
    url: "CustomerGroup2s",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  CustomerGroup3s: {
    url: "CustomerGroup3s",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewCustomerGroup3s: {
    url: "CustomerGroup3s",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  ProductGroups: {
    url: "ProductGroups",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewProductGroups: {
    url: "ProductGroups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Departmentaldiscounts: {
    url: "Departmentaldiscounts",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewDepartmentaldiscounts: {
    url: "Departmentaldiscounts",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  CommissionSiteGroups: {
    url: "CommissionSiteGroups",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  CommGroupDtls: {
    url: "CommGroupDtls",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  getCommGroupDtls: {
    url: "CommGroupDtls",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  Paytables: {
    url: "Paytables",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewPaytables: {
    url: "Paytables",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  PackageDtls: {
    url: "PackageDtls",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewPackageDtls: {
    url: "PackageDtls",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  PackageItemDetails: {
    url: "PackageItemDetails",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewPackageItemDetails: {
    url: "PackageItemDetails",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },

  PackageHdrs: {
    url: "PackageHdrs",
    method: "get",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
  NewPackageHdrs: {
    url: "PackageHdrs",
    method: "post",
    baseURL: "backend",
    get api() {
      return this.url;
    },
  },
};

export const Tcm = {
  getTcm: {
    url: "",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "tcm",
  },
  postTCM: {
    url: "",
    method: "post",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "tcm",
  },

  updateTCM: {
    url: "",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "tcm",
  },

  patchTcm: {
    url: "",
    method: "patch",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "tcm",
  },
};

export const project = {
  addActivity: {
    api: "activitylist/",
    method: "post",
    baseURL: "normal",
  },
  updateProject: {
    url: "projectlist/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  addProject: {
    api: "projectlist/",
    method: "post",
    baseURL: "normal",
  },

  getProject: {
    url: "projectlist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteProject: {
    url: "projectlist/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const quotation = {
  updateQuotation: {
    url: "quotationlist/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  addQuotation: {
    api: "quotationlist/",
    method: "post",
    baseURL: "normal",
  },
  addPaymentSchedule: {
    api: "quotationpayment/",
    method: "post",
    baseURL: "normal",
  },
  addManualPaymentSchedule: {
    api: "manualpayment/",
    method: "post",
    baseURL: "normal",
  },
  removeManualPaymentSchedule: {
    url: "manualpayment/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  removePaymentSchedule: {
    url: "quotationpayment/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  getQuotation: {
    url: "quotationlist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteQuotation: {
    url: "quotationlist/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const manualinvoice = {
  updatemanualinvoice: {
    url: "manualinvoicelist/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  addmanualinvoice: {
    api: "manualinvoicelist/",
    method: "post",
    baseURL: "normal",
  },

  getmanualinvoice: {
    url: "manualinvoicelist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deletemanualinvoice: {
    url: "manualinvoicelist/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const workorderinvoice = {
  updateworkorderinvoice: {
    url: "workorderinvoicelist/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  addworkorderinvoice: {
    api: "workorderinvoicelist/",
    method: "post",
    baseURL: "normal",
  },

  getworkorderinvoice: {
    url: "workorderinvoicelist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteworkorderinvoice: {
    url: "workorderinvoicelist/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};
export const deliveryorder = {
  updatedeliveryorderinvoice: {
    url: "deliveryorderlist/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  adddeliveryorderinvoice: {
    api: "deliveryorderlist/",
    method: "post",
    baseURL: "normal",
  },

  getdeliveryorderinvoice: {
    url: "deliveryorderlist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deletedeliveryorderinvoice: {
    url: "deliveryorderlist/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};
export const equipment = {
  updateequipmentinvoice: {
    url: "equipmentusagelist/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  addequipmentinvoice: {
    api: "equipmentusagelist/",
    method: "post",
    baseURL: "normal",
  },

  getequipmentinvoice: {
    url: "equipmentusagelist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deleteequipmentinvoice: {
    url: "equipmentusagelist/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const PO = {
  updatePO: {
    url: "polist/",
    method: "put",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },

  addPO: {
    api: "polist/",
    method: "post",
    baseURL: "normal",
  },

  getPO: {
    url: "polist/",
    method: "get",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
  deletePO: {
    url: "polist/",
    method: "delete",
    id: null,
    get api() {
      return this.url + this.id;
    },
    set addQuery({ key, payload }) {
      this[key] = payload;
    },
    baseURL: "token",
  },
};

export const Commission = {
  Amountapplicable: {
    url: "CommissionProfiles",
    method: "post",
    baseURL: "commission",
    get api() {
      return this.url;
    },
  },
  getAmountapplicable: {
    url: "CommissionProfiles",
    method: "get",
    baseURL: "commission",
    get api() {
      return this.url;
    },
  },
};
