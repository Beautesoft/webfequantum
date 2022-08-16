import React, { Component } from "react";
import {
  NormalButton,
  TableWrapper,
  InputSearch,
  NormalDate,
  NormalSelect,
  NormalCheckbox,
  NormalInput,
  NormalTimePicker,
  NormalModal,
} from "component/common";
//import "./style.scss";
import ReactPaginate from "react-paginate";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { withTranslation } from "react-i18next";
import { Departmentpopup } from "../Itemdataentry/popup/department";
import { Brandpopup } from "../Itemdataentry/popup/brand";
import { Classpopup } from "../Itemdataentry/popup/gclass";
import { Newuompopup } from "../Itemdataentry/popup/adduom";
import { Newlinkpopup } from "../Itemdataentry/popup/addlink";
import { Editlinkpopup } from "../Itemdataentry/popup/editlink";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegHandPointUp } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { BiPencil } from "react-icons/bi";
import { DragFileUpload } from "../../../common";
import { displayImg } from "service/helperFunctions";
import { createStaffPlus } from "redux/actions/staffPlus";
import {
  ItemDivs,
  ItemUom,
  ItemSitelists,
  NewItemUomprices,
  VoucherConditions,
  ItemBatches,
  getStocks,
  ItemBrands,
  NewPrepaidOpenConditions,
  ItemSupplies,
  ItemStocklists,
  TaxType2TaxCodes,
  NewItemLinks,
  TaxType1TaxCodes,
  ItemDepts,
  NewItemRanges,
  PrepaidOpenConditions,
  ItemUomprices,
  ItemClasses,
  CommGroupHdrs,
  ItemLinks,
  ItemRanges,
  ItemTypes,
  NewStocks,
  PackageDtls,
  PackageItemDetails,
  PackageHdrs,
  NewPackageHdrs,
  Itemusagelists,
  NewItemusagelists,
  updateCommon,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export class EditItemClass extends Component {
  state = {
    stkbalanceDetails: [{ label: "No" }, { label: "Qty" }],
    LinkcodeDetails: [
      { label: "Link Code" },
      { label: "Link Description" },
      { label: "Rpt Code" },
      { label: "Action" },
    ],
    StockDetails: [
      { label: "Store Code" },
      { label: "Store Description" },
      { label: "All" },
    ],
    UOMoneDetails: [
      { label: "No" },
      { label: "UOMC Code" },
      { label: "UOMC Description" },
      { label: "=" },
      { label: "UOM Unit" },
      { label: "UOM Code" },
      { label: "UOM Description" },
      { label: "Action" },
    ],
    packageDetails: [
      { label: "StackName" },
      { label: "Division" },
      { label: "Dept" },
      { label: "Brand" },
      { label: "range" },
      { label: "UOM" },
      { label: "UOM unit" },
      { label: "Price" },
      { label: "  " },
    ],
    packagetwoDetails: [
      { label: "Item Code" },
      { label: "Description" },
      { label: "Qty" },
      { label: "U.Price" },
      { label: "Total" },
      { label: "Unit.Disc" },
      { label: "P.Price " },
      { label: "Total Amount" },
      { label: "UOM" },
      { label: "Active" },
      { label: "Action" },
    ],
    UOMtwoDetails: [
      { label: "No" },
      { label: "UOMC Desc" },
      { label: "Price" },
      { label: "Cost" },
      { label: "Min Margin %" },
      { label: "Action" },
    ],
    ItemoneDetails: [
      { label: "Description", sortKey: true },
      { label: "Item Code", sortKey: true },
      { label: "Bar code", sortKey: true },
      { label: "Action", sortKey: true },
    ],
    ItemtwoDetails: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "Quality" },
      { label: "UOM" },
      { label: "Active" },
      { label: "Action" },
    ],
    prepaidDetails: [
      { label: "Type" },
      { label: "Condition Type 1" },
      { label: "Condition Type 2" },
      { label: "Amount" },
      { label: "Rate" },
      { label: "Active" },
      { label: "Action" },
    ],
    pageMeta: {},
    staffList: [],
    stocklist: [],
    option: [
      { label: 10, value: 10 },
      { label: 25, value: 25 },
      { label: 50, value: 50 },
      { label: 100, value: 100 },
    ],
    stock_type: [],
    validperiod: [
      { label: "30 days", value: 30 },
      { label: "60 days", value: 60 },
      { label: "90 days", value: 90 },
      { label: "180 days", value: 180 },
      { label: "360 days", value: 360 },
      { label: "720 days", value: 720 },
      { label: "1080 days", value: 1080 },
      { label: "120 days", value: 120 },
    ],
    Inclusive_type: [
      { label: "Product Only", value: "Product Only" },
      { label: "Service Only", value: "Service Only" },
      { label: "All", value: "All" },
    ],
    exclusive_type: [
      { label: "Product Only", value: "Product Only" },
      { label: "Service Only", value: "Service Only" },
    ],
    pricetracker: [
      { label: "Item Code" },
      { label: "Item Description" },
      { label: "Date" },
      { label: "Time" },
      { label: "Isactive" },
      { label: "Price" },
    ],
    runing_no: null,
    Division: [],
    Uoms: [],
    sitegroup: [],
    count: 10,
    subitemusage: [],
    stock_data: [],
    isoption: false,
    isgeneral: false,
    validvoucherdate: new Date(),
    idval: null,
    isstk: false,
    supply_itemsval: null,
    isstock: false,
    reoreder_level: false,
    prepaidamount: 0.0,
    itemClassIdId: null,
    taxone: null,
    taxtwo: null,
    itemDeptIdId: null,
    itemDivIdId: null,
    istaxcode: true,
    itemRangeIdId: null,
    itemTypeIdId: 3,
    itemusage_qty: null,
    itemusage_des: null,
    taxoneop: [],
    taxtwoop: [],
    itemusage_uom: null,
    itemusage_code: null,
    customer_replan: false,
    islink: false,
    isvoucher: false,
    isopenrange: false,
    isaccode: false,
    min_qty: 0,
    Replenishment: 0,
    Remind_advance: 0,
    isuom: false,
    isitem: false,
    isprepaid: false,
    images: null,
    stockdivision: null,
    dept: null,
    brand: null,
    account_no: null,
    addrangeoption: [],
    linkcount: null,
    stockname: null,
    stocktype: "SINGLE",
    range_desc: null,
    range_active: false,
    range_brand: null,
    range_code: null,
    stockprice: null,
    uomprice: null,
    uomcost: null,
    uommargin: null,
    floorprice: null,
    disclimit: 0,
    stockclass: null,
    range: null,
    description: null,
    duration: null,
    priceceiling: null,
    sitecode: null,
    uomcode: null,
    validity: null,
    vouchervalue: 0,
    isOpendepartment: false,
    isOpenbrand: false,
    isOpenclass: false,
    isopenlinkedit: false,
    isopenitemedit: false,
    editid: null,
    editval: null,
    isOpenuom: false,
    isOpenlink: false,
    prepaidamountone: 0.0,
    valid: null,
    inclusivetype: [],
    brandlist: [],
    inclusive: null,
    card_noacc: false,
    exclusive: null,
    supplyitem: [],
    depts: [],
    uomsde: [],
    prepaidinclusive: null,
    prepaidexclusive: null,
    classoption: [],
    vouchervalid: false,
    prepaid_inclusive: [],
    prepaid_exclusive: [],
    iscommission: false,
    itemusage: [],
    prepaidall: false,
    prepaidprice: null,
    rangeoption: [],
    prepaidftable: [],
    linklist: [],
    percent: true,
    auto_cust_disc: true,
    tax: false,
    allow_foc: false,
    open_prepaid: false,
    commissionable: false,
    redeem_item: false,
    item_active: true,
    salescommissiongroup: [],
    workcommissiongroup: [],
    work_point: 0,
    Sales_commission: "",
    work_commission: "",
    sales_point: 0,
    item_desc: null,
    start_time: null,
    to_time: null,
    from_date: new Date(),
    to_date: new Date().setFullYear(new Date().getFullYear() + 3),
    Appt_TDT: false,
    appt: null,
    package_dept: [],
    packagedeptvalue: null,
    package_details: [],
    package_code: null,
    package_name: null,
    package_uom: null,
    package_price: null,
    package_qty: null,
    package_discount: 0,
    content_total: null,
    disc_amount: null,
    package_total: null,
    salon: true,
    retail: false,
    package_content: [],
    evenly_method: true,
    manual_method: false,
    disc_method: null,
    item_seq: 1,
    search: "",
    filterdata: [],
    itemusage_barcode: null,
    itemusage_dept: null,
    itemusage_div: null,
    itemId: null,
    temp_maincontent: [],
    searchone: "",
    filterdataone: [],
    rptcode: null,
    ishistory: false,
    tracker: [],
  };
  componentDidMount = () => {
    let { itemId } = this.state;
    itemId = window.location.pathname.split("/")[4];
    this.setState({ itemId });
    console.log(itemId);
    this.Listofstocks({});
    this.Listofmenu({});
    this.listuoms({});
    this.listofsitegropus({});
    this.listofStockListing({});
    // this.listofinclusive({});
    this.listofbrand({});
    this.listofsupply({});
    this.listofitemusage({});
    this.listofclasses({});
    this.listofcommonhrds({});
    this.listtaxone({});
    this.listtaxtwo({});
    this.listofpackagedtl({});
    this.listofdept({});
    this.Listofitemtype({});
    this.Listofitemrange({});
    this.listprepaid({});
    this.listoflinklistitem({});
    this.listofsubitemuage({});
    this.listofedituomlist({});
    this.packagehrdsvalues({});
    this.packageDetailsvalue({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  Listofstocks = async () => {
    await this.props.getStocks().then((res) => {
      console.log(res);
      let { stock_data, temp_maincontent } = this.state;
      let objIndex = res.findIndex((obj) => obj.itemCode == this.state.itemId);
      temp_maincontent = res[objIndex];
      console.log(temp_maincontent);
      stock_data = res;
      console.log(stock_data);
      this.setState({
        stock_data,
      });
      console.log(this.state.itemId, temp_maincontent);
      this.assignall(temp_maincontent);
    });
  };

  assignall = (data) => {
    let {
      stockdivision,
      dept,
      brand,
      control_no,
      stockname,
      stocktype,
      stockprice,
      floorprice,
      supply_itemsval,
      disclimit,
      commissionable,
      redeem_item,
      stockclass,
      range,
      item_desc,
      duration,
      priceceiling,
      percent,
      auto_cust_disc,
      open_prepaid,
      tax,
      allow_foc,
      item_seq,
      taxone,
      taxtwo,
      uomcost,
      uommargin,
      item_active,
      Replenishment,
      Remind_advance,
      Sales_commission,
      work_commission,
      reoreder_level,
      min_qty,
      sales_point,
      work_point,
      vouchervalue,
      vouchervalid,
      validity,
      prepaidamountone,
      prepaidamount,
      valid,
      account_no,
      itemClassIdId,
      itemDeptIdId,
      itemDivIdId,
      itemRangeIdId,
      itemTypeIdId,
      tracker,
    } = this.state;
    control_no = data.itemCode;
    stockdivision = data.itemDiv;
    dept = data.itemDept;
    brand = data.itemBrand;
    stockname = data.itemName;
    stocktype = data.itemType;
    supply_itemsval = data.itemSupp;
    disclimit = data.disclimit;
    commissionable = data.commissionable;
    stockclass = data.itemClass;
    auto_cust_disc = data.autocustdisc;
    range = data.itemRange;
    item_desc = data.itemDesc;
    item_seq = data.item_seq;
    allow_foc = data.isAllowFoc;
    tax = data.isHaveTax;
    taxone = data.t1TaxCode;
    taxtwo = data.t2TaxCode;
    uomcost = data.onhandCst;
    uommargin = data.itemMargin;
    item_active = data.itemIsactive;
    Replenishment = data.custReplenishDays;
    Remind_advance = data.custAdvanceDays;
    Sales_commission = data.salescomm;
    work_commission = data.workcomm;
    reoreder_level = data.reorderActive;
    min_qty = data.reorderMinqty;
    sales_point = data.salescommpoints;
    work_point = data.workcommpoints;
    vouchervalue = data.voucherValue;
    vouchervalid = data.voucherValueIsAmount;
    validity = data.voucherValidPeriod;
    prepaidamountone = data.prepaidValue;
    prepaidamount = data.prepaidSellAmt;
    valid = data.prepaidValidPeriod;
    account_no = data.accountCodeTd;
    itemClassIdId = data.itemClassIdId;
    itemDeptIdId = data.itemDeptIdId;
    itemDivIdId = data.itemDivIdId;
    itemRangeIdId = data.itemRangeIdId;
    itemTypeIdId = data.itemTypeIdId;
    stockprice = data.itemPrice;
    floorprice = data.itemPriceFloor;
    priceceiling = data.itemPriceCeiling;
    let temp = {
      item_code: data.itemCode,
      item_desc: data.itemName,
      stockprice: data.itemPrice,
    };

    tracker.push(temp);
    this.setState({
      tracker,
      stockdivision,
      dept,
      brand,
      control_no,
      stockname,
      stocktype,
      stockprice,
      floorprice,
      supply_itemsval,
      disclimit,
      commissionable,
      redeem_item,
      stockclass,
      range,
      item_desc,
      duration,
      priceceiling,
      percent,
      auto_cust_disc,
      open_prepaid,
      tax,
      allow_foc,
      item_seq,
      taxone,
      taxtwo,
      uomcost,
      uommargin,
      item_active,
      Replenishment,
      Remind_advance,
      Sales_commission,
      work_commission,
      reoreder_level,
      min_qty,
      sales_point,
      work_point,
      vouchervalue,
      vouchervalid,
      validity,
      prepaidamountone,
      prepaidamount,
      valid,
      account_no,
      itemClassIdId,
      itemDeptIdId,
      itemDivIdId,
      itemRangeIdId,
      itemTypeIdId,
      Itemdata: [],
      offset: 0,
      data: [],
      perPage: 10,
      currentPage: 0,
    });
    console.log(dept, priceceiling);
  };
  pagination = ({ target: { value, name } }) => {
    let { count, perPage } = this.state;
    if (name == "count") {
      count = value;
      perPage = value;
      this.setState({ count, perPage });
      console.log(count, perPage);
      this.listofitemusage();
    }
  };
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.listofitemusage();
      }
    );
  };
  listprepaid = async () => {
    await this.props.PrepaidOpenConditions().then((res) => {
      console.log(res);
      let { prepaidftable, validity, prepaidamountone, prepaidamount } =
        this.state;
      let objIndex = res.findIndex((obj) => obj.itemCode == this.state.itemId);
      console.log(res[objIndex]);
      if (objIndex != -1) {
        prepaidftable = res[objIndex];
        validity = res[objIndex].prepaidValidPeriod;
        prepaidamount = res[objIndex].prepaidSellAmt;
        prepaidamountone = res[objIndex].prepaidValue;
      }
      console.log(prepaidftable);
      this.setState({
        prepaidftable,
        validity,
        prepaidamountone,
        prepaidamount,
      });
      console.log(prepaidftable.length);
    });
  };
  listofpackagedtl = async () => {
    await this.props.PackageItemDetails().then((res) => {
      console.log(res);
      let { package_details } = this.state;

      package_details = res;
      console.log(package_details);
      this.setState({
        package_details,
      });
      console.log(package_details.length);
    });
  };

  listofcommonhrds = async () => {
    let { salescommissiongroup, workcommissiongroup } = this.state;
    await this.props.CommGroupHdrs().then((res) => {
      for (let key of res) {
        if (key.type == "Sales") {
          salescommissiongroup.push({
            value: key.code,
            label: key.description,
            id: key.id,
          });
        } else {
          workcommissiongroup.push({
            value: key.code,
            label: key.description,
            id: key.id,
          });
        }
      }
      this.setState({
        salescommissiongroup,
        workcommissiongroup,
      });
    });
  };

  listtaxone = async () => {
    let { taxoneop } = this.state;
    taxoneop = [];
    await this.props.TaxType1TaxCodes().then((res) => {
      for (let key of res) {
        taxoneop.push({
          value: key.taxCode,
          label: key.taxDesc,
          id: key.itemCode,
        });
      }
      console.log(taxoneop);
      this.setState({
        taxoneop,
      });
      console.log(taxoneop.length);
    });
  };

  listtaxtwo = async () => {
    let { taxtwoop } = this.state;
    taxtwoop = [];
    await this.props.TaxType2TaxCodes().then((res) => {
      for (let key of res) {
        taxtwoop.push({
          value: key.taxCode,
          label: key.taxDesc,
          id: key.itemCode,
        });
      }
      console.log(taxtwoop);
      this.setState({
        taxtwoop,
      });
      console.log(taxtwoop.length);
    });
  };

  Listofmenu = async () => {
    let { Division } = this.state;
    Division = [];
    await this.props.ItemDivs().then((res) => {
      for (let key of res) {
        Division.push({
          value: key.itmCode,
          label: key.itmDesc,
          id: key.itmId,
        });
      }
      console.log(Division);
      this.setState({
        Division,
      });
      console.log(Division.length);
    });
  };

  /* DEPARTMENT */
  listofdept = async () => {
    let { depts, package_dept } = this.state;
    depts = [];
    console.log(this.state.stockdivision);
    await this.props.ItemDepts().then((res) => {
      for (let key of res) {
        package_dept.push({
          value: key.itmDesc,
          label: key.itmDesc,
          id: key.itmId,
        });
      }
      if (this.state.stockdivision == "1") {
        for (let key of res) {
          if (key.isRetailproduct == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }
      if (this.state.stockdivision == 2) {
        for (let key of res) {
          if (key.isSalonproduct == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }
      if (this.state.stockdivision == 3) {
        for (let key of res) {
          if (key.isService == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }
      if (this.state.stockdivision == 4) {
        for (let key of res) {
          if (key.isVoucher == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }
      if (this.state.stockdivision == 5) {
        for (let key of res) {
          if (key.isPrepaid == true) {
            depts.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
        console.log(depts);
      }

      console.log(depts);
      this.setState({
        depts,
        package_dept,
      });
      console.log(depts.length);
    });
  };

  /* CLASSSES */
  listofclasses = async () => {
    let { classoption } = this.state;
    classoption = [];
    await this.props.ItemClasses().then((res) => {
      for (let key of res) {
        classoption.push({
          value: key.itmCode,
          label: key.itmDesc,
          id: key.itmId,
        });
      }
      console.log(classoption);
      this.setState({
        classoption,
      });
      console.log(classoption.length);
    });
  };

  listofbrand = async () => {
    let { brandlist } = this.state;
    brandlist = [];
    await this.props.ItemBrands().then((res) => {
      for (let key of res) {
        brandlist.push({
          value: key.itmCode,
          label: key.itmDesc,
          id: key.itmId,
        });
      }
      console.log(brandlist);
      this.setState({
        brandlist,
      });
      console.log(brandlist.length);
    });
  };

  listofsupply = async () => {
    let { supplyitem } = this.state;
    supplyitem = [];
    await this.props.ItemSupplies().then((res) => {
      for (let key of res) {
        supplyitem.push({ value: key.splyCode, label: key.supplydesc });
      }
      console.log(supplyitem);
      this.setState({
        supplyitem,
      });
      console.log(supplyitem.length);
    });
  };

  listuoms = async () => {
    let { Uoms } = this.state;
    Uoms = [];
    await this.props.ItemUom().then((res) => {
      for (let key of res) {
        Uoms.push({ value: key.uomCode, label: key.uomDesc });
      }
      console.log(Uoms);
      this.setState({
        Uoms,
      });
      console.log(Uoms.length);
    });
  };

  Listofitemtype = async () => {
    let { stock_type } = this.state;
    stock_type = [];
    await this.props.ItemTypes().then((res) => {
      if (
        this.state.stockdivision == "1" ||
        this.state.stockdivision == "4" ||
        this.state.stockdivision == "5"
      ) {
        for (let key of res) {
          if (key.itmName == "SINGLE") {
            stock_type.push({
              value: key.itmName,
              label: key.itmName,
              id: key.itmId,
            });
          }
        }
      }
      if (this.state.stockdivision == "2") {
        for (let key of res) {
          if (key.itmName !== "COURSE") {
            stock_type.push({
              value: key.itmName,
              label: key.itmName,
              id: key.itmId,
            });
          }
        }
      }
      if (this.state.stockdivision == "3") {
        for (let key of res) {
          stock_type.push({
            value: key.itmName,
            label: key.itmName,
            id: key.itmId,
          });
        }
      }

      console.log(stock_type);
      this.setState({
        stock_type,
      });
      console.log(stock_type.length);
    });
  };

  /*RANGE */
  Listofitemrange = async () => {
    let { rangeoption, addrangeoption } = this.state;
    rangeoption = [];
    await this.props.ItemRanges().then((res) => {
      addrangeoption = res;
      if (this.state.stockdivision == "3") {
        for (let key of res) {
          console.log(this.state.dept);
          console.log(key.itmDept);
          if (this.state.dept == key.itmDept) {
            rangeoption.push({
              value: key.itmCode,
              label: key.itmDesc,
              id: key.itmId,
            });
          }
        }
      } else {
        for (let key of res) {
          rangeoption.push({
            value: key.itmCode,
            label: key.itmDesc,
            id: key.itmId,
          });
        }
      }

      console.log(rangeoption);
      this.setState({
        rangeoption,
        addrangeoption,
      });
      console.log(rangeoption.length);
    });
  };

  listofsitegropus = async () => {
    let { sitegroup } = this.state;
    sitegroup = [];
    await this.props.ItemSitelists().then((res) => {
      for (let key of res) {
        if (key.itemsiteIsactive == true) {
          sitegroup.push({ value: key.itemsiteCode, label: key.itemsiteDesc });
        }
      }
      console.log(sitegroup);
      this.setState({
        sitegroup,
      });
      console.log(sitegroup.length);
    });
  };

  listofStockListing = async () => {
    let { stocklist } = this.state;
    stocklist = [];
    await this.props.ItemSitelists().then((res) => {
      for (let key of res) {
        if (key.itemsiteIsactive == true) {
          stocklist.push({
            itemsiteCode: key.itemsiteCode,
            itemsiteDesc: key.itemsiteDesc,
            itemsiteIsactive: key.itemsiteIsactive,
          });
        }
      }
      console.log(stocklist);
      this.setState({
        stocklist,
      });
      console.log(stocklist.length);
    });
  };

  listofitemusage = async () => {
    let { itemusage, Itemdata, pageCount } = this.state;
    itemusage = [];
    await this.props.getStocks().then((res) => {
      for (let key of res) {
        if (key.itemDiv == "1" || key.itemDiv == "2") {
          itemusage.push({
            itemDiv: key.itemDiv,
            itemDesc: key.itemDesc,
            itemCode: key.itemCode,
            itemBarcode: key.itemBarcode,
            itemdept: key.itemDept,
            itemUom: key.itemUom,
            itemIsactive: key.itemIsactive,
          });
        }
      }

      Itemdata = itemusage.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      pageCount = Math.ceil(itemusage.length / this.state.perPage);
      console.log(itemusage);
      this.setState({
        itemusage,
        Itemdata,
        pageCount,
      });
      console.log(itemusage.length);
    });
  };

  //Item UOM//
  listofuomprices = async () => {
    let { uomsde } = this.state;
    await this.props.ItemUomprices().then((res) => {
      let temp = {
        id: res[res.length - 1].id,
        itemCode: res[res.length - 1].itemCode,
        itemUom: res[res.length - 1].itemUom,
        uomDesc: res[res.length - 1].uomDesc,
        uomUnit: res[res.length - 1].uomUnit,
        itemUom2: res[res.length - 1].itemUom2,
        uom2Desc: res[res.length - 1].uom2Desc,
        itemPrice: res[res.length - 1].itemPrice,
        itemCost: res[res.length - 1].itemCost,
        minMargin: res[res.length - 1].minMargin,
        isactive: res[res.length - 1].isactive,
        itemUompriceSeq: res[res.length - 1].itemUompriceSeq,
        deleteUser: res[res.length - 1].deleteUser,
        deleteDate: res[res.length - 1].deleteDate,
      };
      uomsde.push(temp);
      this.setState({
        uomsde,
      });
    });
  };

  listofedituomlist = async () => {
    let { uomsde } = this.state;

    await this.props.ItemUomprices().then((res) => {
      for (let key of res) {
        if (key.itemCode == this.state.itemId) {
          uomsde.push({
            id: key.id,
            itemCode: key.itemCode,
            itemUom: key.itemUom,
            uomDesc: key.uomDesc,
            uomUnit: key.uomUnit,
            itemUom2: key.itemUom2,
            uom2Desc: key.uom2Desc,
            itemPrice: key.itemPrice,
            itemCost: key.itemCost,
            minMargin: key.minMargin,
            isactive: key.isactive,
            itemUompriceSeq: key.itemUompriceSeq,
            deleteUser: key.deleteUser,
            deleteDate: key.deleteDate,
          });
        }
      }
      this.setState({
        uomsde,
      });
      console.log(uomsde);
    });
  };

  listoflinklistitem = async () => {
    let { linklist } = this.state;

    await this.props.ItemLinks().then((res) => {
      for (let key of res) {
        if (key.itemCode == this.state.itemId) {
          linklist.push({
            linkCode: key.linkCode,
            itemCode: key.itemCode,
            linkDesc: key.linkDesc,
            linkFactor: key.linkFactor,
            linkType: key.linkType,
            itmIsactive: key.itmIsactive,
            rptCodeStatus: key.rptCodeStatus,
            itmId: key.itmId,
          });
        }
      }
      this.setState({
        linklist,
      });
      console.log(linklist);
    });
  };

  //Item Link //

  listoflinklist = async () => {
    let { linklist } = this.state;

    await this.props.ItemLinks().then((res) => {
      let temp = {
        linkCode: res[res.length - 1].linkCode,
        itemCode: res[res.length - 1].itemCode,
        linkDesc: res[res.length - 1].linkDesc,
        linkFactor: res[res.length - 1].linkFactor,
        linkType: res[res.length - 1].linkType,
        itmIsactive: res[res.length - 1].itmIsactive,
        rptCodeStatus: res[res.length - 1].rptCodeStatus,
        itmId: res[res.length - 1].itmId,
      };
      linklist.push(temp);
      this.setState({
        linklist,
      });
      console.log(linklist);
    });
  };

  listofEditlinklist = async () => {
    let { linklist, linkcount } = this.state;
    linklist.length = 0;
    this.setState({
      linklist,
    });
    console.log(linkcount, linklist);
    for (var i = linkcount; i > 0; i--) {
      await this.props.ItemLinks().then((res) => {
        let temp = {
          linkCode: res[res.length - i].linkCode,
          itemCode: res[res.length - i].itemCode,
          linkDesc: res[res.length - i].linkDesc,
          linkFactor: res[res.length - i].linkFactor,
          linkType: res[res.length - i].linkType,
          itmIsactive: res[res.length - i].itmIsactive,
          rptCodeStatus: res[res.length - i].rptCodeStatus,
          itmId: res[res.length - i].itmId,
        };
        linklist.push(temp);
        this.setState({
          linklist,
        });
        console.log(linklist);
      });
    }
  };

  Additemusage = (code, desc, dept, div, barcode, uom) => {
    let {
      itemusage_code,
      itemusage_des,
      itemusage_barcode,
      itemusage_dept,
      itemusage_div,
      itemusage_uom,
    } = this.state;
    itemusage_code = code;
    itemusage_des = desc;
    itemusage_barcode = barcode;
    itemusage_dept = dept;
    itemusage_div = div;
    itemusage_uom = uom;
    this.setState({
      itemusage_code,
      itemusage_des,
      itemusage_barcode,
      itemusage_dept,
      itemusage_div,
      itemusage_uom,
    });
    this.handleEdititemDialog();
  };

  listofsubitemuage = async () => {
    let { subitemusage } = this.state;
    await this.props.Itemusagelists().then((res) => {
      for (let key of res) {
        if (key.itemCode == this.state.itemId) {
          subitemusage.push({
            ItemCode: key.itemCode,
            Description: key.itemCode,
            Quantity: key.itemCode,
            Active: "Yes",
            UOM: key.itemCode,
            barcode: key.itemBarcode,
            department: key.itemDept,
            division: key.itemDiv,
          });
        }
      }
      this.setState({
        subitemusage,
      });
      console.log(subitemusage);
    });
  };

  Additemusagetable = (code, desc, bar, dept, div, uom, qty) => {
    let { subitemusage } = this.state;
    let temp = {
      ItemCode: code,
      Description: desc,
      Quantity: uom,
      Active: "Yes",
      UOM: qty,
      barcode: bar,
      department: dept,
      division: div,
    };
    subitemusage.push(temp);
    this.setState({ subitemusage });
    console.log(subitemusage);
    this.handleEdititemDialog();
  };

  changelink = (id, val, count) => {
    let { editid, editval, linkcount } = this.state;
    editid = id;
    editval = val;
    linkcount = count;
    this.setState({ editval, editid, linkcount });
    this.handleEditlinkDialog();
  };
  //Prepaidd section //
  listofinclusive = async () => {
    let { inclusivetype } = this.state;
    inclusivetype = [];
    await this.props.VoucherConditions().then((res) => {
      for (let key of res) {
        if (key.conditiontype1 == "Service Only") {
          inclusivetype.push({ value: key.itemCode, label: key.description });
        }
      }
      inclusivetype = res;
      console.log(inclusivetype);
      this.setState({
        inclusivetype,
      });
      console.log(inclusivetype.length);
    });
  };

  Inclusivelist = async (ptype) => {
    if (ptype == "Product Only") {
      let { prepaid_inclusive } = this.state;
      prepaid_inclusive = [];
      await this.props.ItemBrands().then((res) => {
        for (let key of res) {
          prepaid_inclusive.push({ value: key.itmDesc, label: key.itmDesc });
        }
        this.setState({
          prepaid_inclusive,
        });
      });
    } else if (ptype == "Service Only") {
      let { prepaid_inclusive } = this.state;
      prepaid_inclusive = [];
      await this.props.ItemDepts().then((res) => {
        for (let key of res) {
          prepaid_inclusive.push({ value: key.itmCode, label: key.itmDesc });
        }
        this.setState({
          prepaid_inclusive,
        });
      });
    } else {
      let { prepaid_inclusive } = this.state;
      prepaid_inclusive = [];
      prepaid_inclusive.push({ value: "ALL", label: "ALL" });
      this.setState({
        prepaid_inclusive,
      });
    }
  };

  Exclusivelist = async (ptype) => {
    if (ptype == "Product Only") {
      let { prepaid_exclusive } = this.state;
      prepaid_exclusive = [];
      await this.props.ItemBrands().then((res) => {
        for (let key of res) {
          prepaid_exclusive.push({ value: key.itmDesc, label: key.itmDesc });
        }
        this.setState({
          prepaid_exclusive,
        });
      });
    } else {
      let { prepaid_exclusive } = this.state;
      prepaid_exclusive = [];
      await this.props.ItemDepts().then((res) => {
        for (let key of res) {
          prepaid_exclusive.push({ value: key.itmCode, label: key.itmDesc });
        }
        this.setState({
          prepaid_exclusive,
        });
      });
    }
  };

  prapaidtable = (type, cond1, cond2, price) => {
    console.log("check");
    let { prepaidftable, prepaidamount, prepaidamountone } = this.state;
    let tempreapidamount = 0;
    if (price == null) {
      Toast({
        type: "error",
        message: "Price value is empty",
      });
    } else {
      let temp = {
        pItemtype: type,
        conditiontype1: cond1,
        conditiontype2: cond2,
        prepaidSellAmt: price,
      };
      prepaidftable.push(temp);
      this.setState({ prepaidftable });
    }
    prepaidftable = prepaidftable.map(
      (x) => (tempreapidamount = Number(tempreapidamount) + Number(x.price))
    );
    prepaidamount = tempreapidamount.toFixed(2);
    prepaidamountone = tempreapidamount.toFixed(2);
    this.setState({ prepaidamount, prepaidamountone });
    console.log(prepaidftable);
  };

  prapaidtableone = (type, cond1, cond2) => {
    console.log("check");
    let { prepaidftable } = this.state;
    let temp = {
      pItemtype: type,
      conditiontype1: cond1,
      conditiontype2: cond2,
      prepaidSellAmt: "",
    };
    prepaidftable.push(temp);
    this.setState({ prepaidftable });
    console.log(prepaidftable);
  };

  Deleteprepaid = (id) => {
    console.log("delete");
    let { prepaidftable, prepaidamount, prepaidamountone } = this.state;
    let tempreapidamount = 0;
    prepaidftable = prepaidftable.filter(function (x, index) {
      return index !== id;
    });
    this.setState({ prepaidftable });
    prepaidftable = prepaidftable.map(
      (x) => (tempreapidamount = Number(tempreapidamount) + Number(x.price))
    );
    prepaidamount = tempreapidamount.toFixed(2);
    prepaidamountone = tempreapidamount.toFixed(2);
    this.setState({ prepaidamount, prepaidamountone });
  };

  aboutpopup() {
    this.setState({
      isoption: !this.state.isoption,
    });
  }
  generalcontent() {
    this.setState({
      isgeneral: !this.state.isgeneral,
    });
  }
  stkbalancecontent() {
    this.setState({
      isstk: !this.state.isstk,
    });
  }
  handlehistory() {
    this.setState({ ishistory: !this.state.ishistory });
  }
  Linkcontent() {
    this.setState({
      islink: !this.state.islink,
    });
  }
  stockcontent() {
    this.setState({
      isstock: !this.state.isstock,
    });
  }
  vouchercontent() {
    this.setState({
      isvoucher: !this.state.isvoucher,
    });
  }
  Accountcodecontent() {
    this.setState({
      isaccode: !this.state.isaccode,
    });
  }
  UOMcontent() {
    this.setState({
      isuom: !this.state.isuom,
    });
  }
  commissioncontent() {
    this.setState({ iscommission: !this.state.iscommission });
  }
  Itemusagecontent() {
    this.setState({
      isitem: !this.state.isitem,
    });
  }

  taxcodecontent() {
    this.setState({
      istaxcode: !this.state.istaxcode,
    });
  }
  Prepaidcontent() {
    this.setState({
      isprepaid: !this.state.isprepaid,
    });
  }

  handlecheckbox = ({ target: { value, name } }) => {
    let {
      percent,
      allow_foc,
      auto_cust_disc,
      tax,
      open_prepaid,
      item_active,
      redeem_item,
      commissionable,
    } = this.state;
    if (name == "percent") {
      percent = value;
      this.setState({ percent });
    }
    if (name == "allow_foc") {
      allow_foc = value;
      this.setState({ allow_foc });
    }
    if (name == "auto_cust_disc") {
      auto_cust_disc = value;
      this.setState({ auto_cust_disc });
    }
    if (name == "tax") {
      tax = value;
      this.setState({ tax });
    }
    if (name == "open_prepaid") {
      open_prepaid = value;
      this.setState({ open_prepaid });
    }
    if (name == "item_active") {
      item_active = value;
      this.setState({ item_active });
    }
    if (name == "redeem_item") {
      redeem_item = value;
      this.setState({ redeem_item });
    }
    if (name == "commissionable") {
      commissionable = value;
      this.setState({ commissionable });
    }
  };
  typeid = (type) => {
    let { itemDivIdId, Division } = this.state;
    for (var i = 0; i < Division.length; i++) {
      if (type == Division[i].value) {
        itemDivIdId = Division[i].id;
      }
    }
    this.setState({ itemDivIdId });
    console.log(itemDivIdId);
  };
  deptype = (type) => {
    let { itemDeptIdId, depts } = this.state;
    for (var i = 0; i < depts.length; i++) {
      if (type == depts[i].value) {
        itemDeptIdId = depts[i].id;
      }
    }
    this.setState({ itemDeptIdId });
    console.log(itemDeptIdId);
  };
  Divtype = (type) => {
    let { itemTypeIdId, stocktype } = this.state;

    if (stocktype == "SINGLE") {
      itemTypeIdId = 3;
    } else if (stocktype == "PACKAGE") {
      itemTypeIdId = 6;
    } else {
      itemTypeIdId = 7;
    }
    this.setState({ itemTypeIdId });
    console.log(itemTypeIdId);
  };
  classtype = (type) => {
    let { itemClassIdId, classoption } = this.state;
    for (var i = 0; i < classoption.length; i++) {
      if (type == classoption[i].value) {
        itemClassIdId = classoption[i].id;
      }
    }
    this.setState({ itemClassIdId });
    console.log(itemClassIdId);
  };
  rangetype = (type) => {
    let { itemRangeIdId, rangeoption } = this.state;
    for (var i = 0; i < rangeoption.length; i++) {
      if (type == rangeoption[i].value) {
        itemRangeIdId = rangeoption[i].id;
      }
    }
    this.setState({ itemRangeIdId });
    console.log(itemRangeIdId);
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let {
      stockdivision,
      dept,
      brand,
      stockname,
      stocktype,
      stockprice,
      floorprice,
      disclimit,
      item_seq,
      stockclass,
      item_desc,
      supply_itemsval,
      range,
      inclusive,
      exclusive,
      description,
      duration,
      count,
      valid,
      vouchervalid,
      validvoucherdate,
      priceceiling,
      control_no,
    } = this.state;
    if (name == "stockdivision") {
      stockdivision = value;
      this.setState({ control_no });
    }
    if (name == "supply_itemsval") {
      supply_itemsval = value;
      this.setState({ supply_itemsval });
    }
    if (name == "item_desc") {
      item_desc = value;
      this.setState({ item_desc });
    }
    if (name == "vouchervalid") {
      vouchervalid = value;
      this.setState({ vouchervalid });
    }
    if (name == "validvoucherdate") {
      validvoucherdate = value;
      this.setState({ validvoucherdate });
    }
    if (name == "inclusive") {
      inclusive = value;
      this.setState({ inclusive });
      console.log(inclusive);
      this.Inclusivelist(inclusive);
    }
    if (name == "exclusive") {
      exclusive = value;
      this.setState({ exclusive });
      this.Exclusivelist(exclusive);
    }
    if (name == "dept") {
      dept = value;
      control_no = stockdivision + dept;
      this.setState({ dept });
      this.setState({ control_no });
      this.Listofitemrange({});
    }
    if (name == "brand") {
      brand = value;
      this.setState({ brand });
    }
    if (name == "stockname") {
      stockname = value;
      item_desc = value;
      this.setState({ stockname, item_desc });
    }
    if (name == "stocktype") {
      stocktype = value;
      this.setState({ stocktype });
      console.log(stocktype);
      this.Divtype(stocktype);
    }
    if (name == "stockprice") {
      stockprice = value;
      this.setState({ stockprice });
    }
    if (name == "disclimit") {
      disclimit = value;
      this.setState({ disclimit });
    }
    if (name == "floorprice") {
      if (value > stockprice) {
        Toast({
          type: "error",
          message: "FloorPrice always less than or equal to price",
        });
      } else {
        floorprice = value;
        this.setState({ floorprice });
      }
    }
    if (name == "stockclass") {
      stockclass = value;
      this.setState({ stockclass });
      this.classtype(stockclass);
    }
    if (name == "range") {
      range = value;
      this.setState({ range });
      this.rangetype(range);
    }
    if (name == "description") {
      description = value;
      this.setState({ description });
    }
    if (name == "item_seq") {
      item_seq = value;
      this.setState({ item_seq });
    }
    if (name == "cost") {
      if (value > stockprice) {
        Toast({
          type: "error",
          message: "Cost always less than or equal to price",
        });
      } else {
        priceceiling = value;
        this.setState({ priceceiling });
      }
    }
    if (name == "duration") {
      duration = value;
      this.setState({ duration });
    }
    if (name == "count") {
      count = value;
      this.setState({ count });
    }
    if (name == "validdays") {
      valid = value;
      this.setState({ valid });
    }
  };

  handlechangestk = ({ target: { value, name } }) => {
    let {
      sitecode,
      uomcode,
      vouchervalue,
      validity,
      prepaidall,
      prepaidinclusive,
      prepaidamount,
      prepaidexclusive,
      prepaidprice,
      card_noacc,
      customer_replan,
      reoreder_level,
    } = this.state;
    console.log(name, value);
    if (name == "prepaidamount") {
      prepaidamount = value;
      this.setState({ prepaidamount });
    }
    if (name == "card_noacc") {
      card_noacc = value;
      this.setState({ card_noacc });
    }
    if (name == "customer_replan") {
      customer_replan = value;
      this.setState({ customer_replan });
    }
    if (name == "reoreder_level") {
      reoreder_level = value;
      this.setState({ reoreder_level });
    }
    if (name == "sitecode") {
      sitecode = value;
      this.setState({ sitecode });
    }
    if (name == "uomcode") {
      uomcode = value;
      this.setState({ uomcode });
    }
    if (name == "vouchervalue") {
      vouchervalue = value;
      this.setState({ vouchervalue });
    }
    if (name == "validity") {
      validity = value;
      this.setState({ validity });
    }
    if (name == "prepaidall") {
      prepaidall = value;
      this.setState({ prepaidall });
    }
    if (name == "prepaidinclusive") {
      prepaidinclusive = value;
      this.setState({ prepaidinclusive });
    }
    if (name == "prepaidexclusive") {
      prepaidexclusive = value;
      this.setState({ prepaidexclusive });
    }
    if (name == "prepaidprice") {
      prepaidprice = value;
      this.setState({ prepaidprice });
    }
  };

  handlestk = ({ target: { value, name } }) => {
    let { min_qty, Replenishment, Remind_advance } = this.state;
    if (name == "min_qty") {
      min_qty = value;
      this.setState({ min_qty });
    }
    if (name == "Replenishment") {
      Replenishment = value;
      this.setState({ Replenishment });
    }
    if (name == "Remind_advance") {
      Remind_advance = value;
      this.setState({ Remind_advance });
    }
  };

  sublist = ({ target: { value, name } }) => {
    let { work_commission, sales_point, work_point, Sales_commission } =
      this.state;
    if (name == "work_commission") {
      work_commission = value;
      this.setState({ work_commission });
    }
    if (name == "Sales_commission") {
      Sales_commission = value;
      this.setState({ Sales_commission });
    }
    if (name == "work_point") {
      work_point = value;
      this.setState({ work_point });
    }
    if (name == "sales_point") {
      sales_point = value;
      this.setState({ sales_point });
    }
  };

  Item_Code = ({ target: { value, name } }) => {
    let { itemusage_code, itemusage_des, itemusage_qty, itemusage_uom } =
      this.state;
    if (name == "itemusage_code") {
      itemusage_code = value;
      this.setState({ itemusage_code });
    }
    if (name == "itemusage_des") {
      itemusage_des = value;
      this.setState({ itemusage_des });
    }
    if (name == "itemusage_qty") {
      itemusage_qty = value;
      this.setState({ itemusage_qty });
    }
    if (name == "itemusage_uom") {
      itemusage_uom = value;
      this.setState({ itemusage_uom });
    }
  };

  handlerange = ({ target: { value, name } }) => {
    let { range_active, range_brand, range_code, range_desc } = this.state;
    if (name == "range_active") {
      range_active = value;
      this.setState({ range_active });
    }
    if (name == "range_brand") {
      range_brand = value;
      this.setState({ range_brand });
    }
    if (name == "range_code") {
      range_code = value;
      this.setState({ range_code });
    }
    if (name == "range_desc") {
      range_desc = value;
      this.setState({ range_desc });
    }
  };

  handleCheckboxone = async (item) => {
    let { stocklist } = this.state;
    for (let i = 0; i <= stocklist.length - 1; i++) {
      if (stocklist[i].itemsiteCode == item) {
        stocklist[i].itemsiteIsactive = !stocklist[i].itemsiteIsactive;
      }
    }
    this.setState({ stocklist });
  };

  handleCheckboxtwo = async (item) => {
    let { linklist, rptcode } = this.state;
    for (let i = 0; i <= linklist.length - 1; i++) {
      if (linklist[i].linkCode == item) {
        linklist[i].rptCodeStatus = !linklist[i].rptCodeStatus;
        rptcode = linklist[i].linkCode;
      } else {
        linklist[i].rptCodeStatus = false;
      }
    }
    this.setState({ linklist, rptcode });
  };

  // upload imag to formfield
  handleImageUpload = (file) => {
    debugger;
    let { images } = this.state;
    images = file;
    this.setState({
      images,
    });
    console.log(images);
  };

  handleDialog = () => {
    let { isOpendepartment } = this.state;
    this.setState({ isOpendepartment: !isOpendepartment });
  };
  handlebrandDialog = () => {
    let { isOpenbrand } = this.state;
    this.setState({ isOpenbrand: !isOpenbrand });
  };
  handleclassDialog = () => {
    let { isOpenclass } = this.state;
    this.setState({ isOpenclass: !isOpenclass });
  };
  handleuomDialog = () => {
    let { isOpenuom } = this.state;
    this.setState({ isOpenuom: !isOpenuom });
  };
  handlelinkDialog = () => {
    let { isOpenlink } = this.state;
    this.setState({ isOpenlink: !isOpenlink });
  };
  handleEditlinkDialog = () => {
    let { isopenlinkedit } = this.state;
    this.setState({ isopenlinkedit: !isopenlinkedit });
  };
  handleEdititemDialog = () => {
    let { isopenitemedit } = this.state;
    this.setState({ isopenitemedit: !isopenitemedit });
  };
  handlerangeDialog = () => {
    let { isopenrange, range_code, addrangeoption, tem_no } = this.state;
    if (addrangeoption.length > 0) {
      tem_no = addrangeoption[addrangeoption.length - 1].itmCode;
      console.log(tem_no);
      tem_no = Number(tem_no) + 1;
      range_code = range_code + tem_no;
      console.log(range_code);
    } else {
      range_code = 1;
      console.log(range_code);
    }
    this.setState({ isopenrange: !isopenrange, range_code });
  };

  Addrangeitems = async (code, desc, brand_id, active) => {
    let { brand, range_active, range_desc, range_code, range_brand } =
      this.state;
    if (code == null || desc == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newreason = {
        itmCode: code,
        itmDesc: desc,
        itmStatus: active,
        itmDept: brand,
        itmBrand: brand_id,
        isproduct: true,
        prepaidForProduct: false,
        prepaidForService: false,
        prepaidForAll: false,
        isservice: false,
        isvoucher: false,
        isprepaid: false,
        iscompound: false,
      };
      await this.props
        .NewItemRanges(newreason)
        .then((data) => {
          this.Listofitemrange();
          range_active = false;
          range_code = "";
          range_desc = "";
          range_brand = "";
          this.setState({ range_brand, range_code, range_desc, range_active });
        })
        .catch((e) => console.log(e));
      this.handlerangeDialog();
    }
  };

  deleteitem = (ind) => {
    console.log("deleteitem", ind);
    let { subitemusage } = this.state;

    subitemusage = subitemusage.filter((x, index) => index !== ind);
    this.setState({
      subitemusage,
    });
    console.log(subitemusage);
  };

  deleteuom = (id) => {
    let { uomsde } = this.state;

    uomsde = uomsde.filter((x) => x.id !== id);
    this.setState({
      uomsde,
    });
  };
  handleid = (id) => {
    let { idval } = this.state;
    console.log(id);
    idval = id;
    this.setState({ idval });
    console.log(idval);
    //this.handleuomprice(id);
  };

  handleuomarray = (uomitem, val) => {
    let { idval, uomsde } = this.state;
    console.log(uomitem, idval, val);
    let index = uomsde.findIndex((x) => x.id == idval);
    if (val == "1") {
      uomsde[index].itemPrice = uomitem;
    } else if (val == "2") {
      uomsde[index].itemCost = uomitem;
    } else {
      uomsde[index].minMargin = uomitem;
    }
    this.setState({
      uomsde,
    });
    console.log(uomsde);
  };
  handleuomprice = (idno) => {
    let { uomsde, idval, uomprice } = this.state;
    console.log(idno);
    let objIndex = uomsde.findIndex((obj) => obj.id == idno);
    uomsde[objIndex].itemPrice = uomprice;
    this.setState({
      uomsde,
    });
    console.log(uomsde);
  };
  linkcodecondition = (runningcode) => {
    let { linklist, linkcodenew, item_active } = this.state;

    if (linklist.length > 0) {
      linklist.map((x, index) => {
        linkcodenew = {
          linkCode: runningcode,
          itemCode: runningcode,
          linkDesc: x.linkDesc,
          linkFactor: 0,
          linkType: x.linkType,
          itmIsactive: item_active == true ? true : x.itmIsactive,
          rptCodeStatus: x.rptCodeStatus,
        };
        this.finallinkcode(linkcodenew);
      });
    }
  };

  finallinkcode = async (newitem) => {
    await this.props
      .NewItemLinks(newitem)
      .then((data) => {
        console.log("prepaiddsdsdsdsdd");
      })
      .catch((e) => console.log(e));
  };

  prepaidopencondition = (runningcode) => {
    let {
      prepaidftable,
      prepaidamount,
      prepaidamountone,
      card_noacc,
      validity,
      control_no,
      prepaidnew,
    } = this.state;
    if (prepaidftable.length > 0) {
      prepaidftable.map((x, index) => {
        prepaidnew = {
          pItemtype: x.type,
          itemCode: runningcode,
          conditiontype1: x.condition1,
          conditiontype2: x.condition2,
          prepaidValue: prepaidamountone,
          prepaidSellAmt: prepaidamount,
          prepaidValidPeriod: validity,
          rate: "Amount$",
          membercardnoaccess: card_noacc,
          uid: "",
          macUidRef: "",
          ppUidRef: null,
        };
        this.finalpre(prepaidnew);
      });
    }
  };

  finalpre = async (newitem) => {
    await this.props
      .NewPrepaidOpenConditions(newitem)
      .then((data) => {
        console.log("prepaiddsdsdsdsdd");
      })
      .catch((e) => console.log(e));
  };

  finaluomprice = (runningcode) => {
    let { uomsde, uomnew } = this.state;

    if (uomsde.length > 0) {
      uomsde.map((x, index) => {
        uomnew = {
          itemCode: runningcode,
          itemUom: x.itemUom,
          uomDesc: x.uomDesc,
          uomUnit: x.uomUnit,
          itemUom2: x.itemUom2,
          uom2Desc: x.uom2Desc,
          itemPrice: x.itemPrice,
          itemCost: x.itemCost,
          minMargin: x.minMargin,
          isactive: x.isactive,
          itemUompriceSeq: x.itemUompriceSeq,
          deleteUser: x.deleteUser,
          deleteDate: x.deleteDate,
        };
        this.finaluomlist(uomnew);
      });
      return true;
    } else {
      Toast({
        type: "error",
        message: "UOM should not empty ",
      });
      return false;
    }
  };

  finaluomlist = async (newitem) => {
    await this.props
      .NewItemUomprices(newitem)
      .then((data) => {
        console.log("uomlist");
      })
      .catch((e) => console.log(e));
  };

  updatebatch = async (no, site_code, uom1, uom2) => {
    console.log(site_code, no, uom1, uom2);
    let { newbatch, stocklist, item_active, newstock } = this.state;
    for (let i = 0; i <= stocklist.length - 1; i++) {
      if (uom1 == uom2) {
        newbatch = {
          itemCode: no,
          siteCode: stocklist[i].itemsiteCode,
          batchNo: "",
          uom: uom1,
          qty: 0,
          expDate: new Date(),
          batchCost: "",
          isActive: item_active == true ? true : stocklist[i].itemsiteIsactive,
        };
        await this.props
          .updateCommon(
            `ItemBatches/update?where=%7B%22itemCode%22%3A%20${no}%7D`,
            newbatch
          )
          .then((data) => {
            console.log("batchap updates");
          })
          .catch((e) => console.log(e));
      } else {
        if (uom1 != null) {
          newbatch = {
            itemCode: no,
            siteCode: stocklist[i].itemsiteCode,
            batchNo: "",
            uom: uom1,
            qty: 0,
            expDate: new Date(),
            batchCost: "",
            isActive:
              item_active == true ? true : stocklist[i].itemsiteIsactive,
          };
          await this.props
            .updateCommon(
              `ItemBatches/update?where=%7B%22itemCode%22%3A%20${no}%7D`,
              newbatch
            )
            .then((data) => {
              console.log("batchap updates");
            })
            .catch((e) => console.log(e));
        }
        if (uom2 != null) {
          newbatch = {
            itemCode: no,
            siteCode: stocklist[i].itemsiteCode,
            batchNo: "",
            uom: uom2,
            qty: 0,
            expDate: new Date(),
            batchCost: "",
            isActive:
              item_active == true ? true : stocklist[i].itemsiteIsactive,
          };
          await this.props
            .updateCommon(
              `ItemBatches/update?where=%7B%22itemCode%22%3A%20${no}%7D`,
              newbatch
            )
            .then((data) => {
              console.log("batchap updates");
            })
            .catch((e) => console.log(e));
        }
      }
      newstock = {
        itemCode: no,
        itemBarcode: no + "0000",
        itemsiteCode: stocklist[i].itemsiteCode,
        onhandQty: 0,
        itemstocklistMinqty: 0,
        itemstocklistMaxqty: 0,
        onhandCst: 0,
        itemstocklistOnhandcost: null,
        itemstocklistUnit: null,
        itemstocklistUser: "HS01100003",
        itemstocklistDatetime: new Date(),
        itemstocklistRemark: null,
        itemstocklistPosted: false,
        itemstocklistStatus: true,
        lstpoUcst: 0,
        lstpoNo: null,
        lstpoDate: new Date(),
        costPrice: 0,
        itmSeq: null,
      };
      await this.props
        .NewItemStocklists(newstock)
        .then((data) => {
          console.log("Itemstock");
        })
        .catch((e) => console.log(e));
    }
  };
  itembatchapi = (no) => {
    let { sitecode, uom1, uom2, uomsde } = this.state;
    if (uomsde.length > 0) {
      uomsde.map((x, index) => {
        uom1 = x.itemUom;
        uom2 = x.itemUom2;
        this.updatebatch(no, sitecode, uom1, uom2);
      });
    }
  };
  packageradio(event) {
    let { disc_method } = this.state;
    disc_method = event.target.value;
    this.setState({ disc_method });
    console.log(event.target.value, disc_method);
  }

  packagehrdsvalues = async () => {
    let { from_date, to_date, start_time, to_time, appt, disc_method } =
      this.state;
    await this.props.PackageHdrs().then((res) => {
      for (let key of res) {
        if (key.itemCode == this.state.itemId) {
          from_date = key.fromDate;
          to_date = key.toDate;
          start_time = key.fromTime;
          to_time = key.toTime;
          appt = key.istdt;
          disc_method = key.manualDisc;
        }
      }
      this.setState({
        from_date,
        to_date,
        start_time,
        to_time,
        appt,
        disc_method,
      });
    });
    console.log(
      from_date,
      to_date,
      "asa",
      start_time,
      "asa",
      to_time,
      "asa",
      appt,
      "asa",
      disc_method
    );
  };

  Itemusagelist = () => {
    let { subitemusage, newdetails } = this.state;
    subitemusage.map((x, index) => {
      newdetails = {
        itemcode: x.ItemCode,
        itemBarcode: x.barcode,
        itemname: x.Description,
        division: x.division,
        costprice: 0,
        sitecode: this.state.sitecode,
        packagediscount: 0,
        itemdept: x.department,
        itemdesc: x.Description,
      };
      this.finalitemusagelist(newdetails);
    });
  };

  finalitemusagelist = async (newitem) => {
    await this.props
      .NewItemusagelists(newitem)
      .then((data) => {
        console.log("Itemusagelist");
      })
      .catch((e) => console.log(e));
  };

  finalpackage = () => {
    let { package_content, newdtails } = this.state;

    package_content.map((x, index) => {
      newdtails = {
        code: x.Item_Code,
        description: x.Description,
        cost: null,
        price: x.U_Price,
        discount: x.package_discount,
        packageCode: x.Item_Code,
        qty: x.package_qty,
        uom: x.package_uom,
        itemDiv: null,
        packageBarcode: null,
        discPercent: null,
        unitPrice: x.P_Price,
        ttlUprice: x.Total_Amount,
        siteCode: this.state.sitecode,
        lineNo: 1,
        serviceExpireActive: false,
        serviceExpireMonth: null,
        treatmentLimitActive: false,
        treatmentLimitCount: null,
        limitserviceFlexionly: false,
        isactive: true,
      };
      this.finalpackagelist(newdtails);
    });
  };

  finalpackagelist = async (newitem) => {
    await this.props
      .NewPackageDtls(newitem)
      .then((data) => {
        console.log("Pacakkkakak");
      })
      .catch((e) => console.log(e));
  };

  packageDetailsvalue = async () => {
    let { package_content } = this.state;

    await this.props.PackageDtls().then((res) => {
      for (let key of res) {
        if (key.packageCode == this.state.itemId) {
          package_content.push({
            id: key.id,
            Item_Code: key.code,
            Description: key.description,
            Qty: key.qty,
            U_Price: key.unitPrice,
            Total: key.ttlUprice,
            Unit_Disc: key.discount,
            P_Price: key.price,
            Total_Amount: key.price,
            minMargin: key.minMargin,
            isactive: key.isactive,
            UOM: key.uom,
            Active: key.isactive == true ? "Yes" : "No",
          });
        }
      }
      this.setState({
        package_content,
      });
      console.log(package_content);
    });
  };

  totimechange = ({ target: { value, name } }) => {
    console.log(value);
    let { to_time } = this.state;
    to_time = value;
    this.setState({ to_time });
    console.log(to_time);
  };

  fromtimechange = ({ target: { value, name } }) => {
    console.log(value);
    let { start_time } = this.state;
    start_time = value;
    this.setState({ start_time });
    console.log(start_time);
  };

  finalPackageHdrs = async () => {
    let { newdtails, package_discount, package_price } = this.state;

    newdtails = {
      code: this.state.runing_no,
      description: this.state.dept,
      price: package_price,
      discount: package_discount,
      dateCreated: new Date(),
      timeCreated: new Date(),
      userName: null,
      packageBarcode: null,
      unitPrice: 0,
      fromDate: this.state.from_date,
      toDate: this.state.to_date,
      fromTime: this.state.start_time,
      toTime: this.state.to_time,
      siteCode: this.state.sitecode,
      manualDisc: this.state.disc_method !== "Manual" ? false : true,
      istdt: this.state.appt,
      apptlimit: 0,
    };

    await this.props
      .NewPackageHdrs(newdtails)
      .then((data) => {
        console.log("PackageHRd");
      })
      .catch((e) => console.log(e));
  };

  deletepackage = (Code) => {
    let {
      package_content,
      package_uom,
      package_qty,
      content_total,
      package_total,
      package_code,
      package_name,
      package_price,
      package_discount,
    } = this.state;

    package_content = package_content.filter((x) => x.Item_Code !== Code);
    this.setState({ package_content });

    console.log(package_content);

    package_code = "";
    package_name = "";
    package_uom = "";
    package_price = "";
    package_qty = "";
    package_discount = 0;
    this.setState({
      package_code,
      package_name,
      package_uom,
      package_price,
      package_qty,
      package_discount,
    });

    package_total = 0;
    this.setState({ package_total });
    package_content.map((x, index) => {
      console.log(x.P_Price);
      console.log(package_total);
      package_total = (Number(package_total) + Number(x.P_Price)).toFixed(2);
      console.log(package_total);
    });
    this.setState({ package_total });
    console.log(package_total);

    content_total = 0;
    package_total = 0;
    this.setState({ content_total, package_total });
    package_content.map((x, index) => {
      console.log(x.P_Price);
      console.log(content_total, package_content);
      content_total = (Number(content_total) + Number(x.P_Price)).toFixed(2);
      package_total = content_total;
      console.log(content_total);
    });
    this.setState({ content_total, package_total });
    console.log(content_total);
  };

  applydiscount = (discount) => {
    let { package_content, content_total, temp_tt, temp_tp, temp_dis } =
      this.state;

    temp_tt = (content_total - discount) / content_total;
    console.log(temp_tt);
    package_content.map((x, index) => {
      temp_tp = (temp_tt * x.Total).toFixed(2);
      temp_dis = (Number(discount) / Number(x.Qty)).toFixed(2);
      this.changepackage(index, temp_tp, temp_dis);
    });
  };

  changepackage = (id, price, discount) => {
    let { package_content, objIndex, package_total } = this.state;
    objIndex = package_content.findIndex((obj, index) => index == id);
    package_content[objIndex].Unit_Disc = discount;
    package_content[objIndex].P_Price =
      package_content[objIndex].U_Price - discount;
    package_content[objIndex].Total_Amount = price;
    package_total = 0;
    this.setState(package_content);
    console.log(package_content);
    this.calculatetotalprice(package_total);
  };
  calculatetotalprice = (total) => {
    console.log("Chek");
    let { package_total, package_content } = this.state;

    package_total = total;
    this.setState({ package_total });
    package_content.map((x, index) => {
      console.log(x.P_Price);
      console.log(package_total);
      package_total = (Number(package_total) + Number(x.Total_Amount)).toFixed(
        2
      );
      console.log(package_total);
    });
    this.setState({ package_total });
    console.log(package_total);
  };

  selectcode = (code) => {
    let {
      package_code,
      package_name,
      package_uom,
      package_price,
      package_qty,
      package_discount,
      package_content,
    } = this.state;
    let objIndex = package_content.findIndex((obj) => obj.Item_Code == code);
    console.log(package_content[objIndex]);
    package_code = package_content[objIndex].Item_Code;
    package_name = package_content[objIndex].Description;
    package_price = package_content[objIndex].U_Price;
    package_uom = package_content[objIndex].UOM;
    package_qty = package_content[objIndex].Qty;
    package_discount = package_content[objIndex].Unit_Disc;

    this.setState({
      package_code,
      package_name,
      package_uom,
      package_price,
      package_qty,
      package_discount,
    });
  };

  insertpackage = (
    package_code,
    package_uom,
    package_qty,
    package_name,
    package_price,
    package_discount
  ) => {
    console.log(
      package_code,
      package_uom,
      package_qty,
      package_name,
      package_price,
      package_discount
    );
    let {
      temp_content,
      temp_price,
      temp_total,
      package_content,
      content_total,
      package_total,
    } = this.state;

    temp_price = package_qty * package_price;
    content_total = 0;

    temp_total = temp_price - package_discount;
    package_total = temp_total;
    this.setState({ temp_price, temp_total, package_total, content_total });
    console.log(content_total);
    console.log(temp_price);
    if (package_content.length > 0) {
      let objIndex = package_content.findIndex(
        (obj) => obj.Item_Code == package_code
      );
      if (objIndex != -1) {
        package_content[objIndex].Item_Code = package_code;
        package_content[objIndex].Description = package_name;
        package_content[objIndex].Qty = package_qty;
        package_content[objIndex].U_Price = package_price;
        package_content[objIndex].Total = temp_price;
        package_content[objIndex].Unit_Disc = package_discount;
        package_content[objIndex].P_Price = temp_total;
        package_content[objIndex].Total_Amount = temp_price;
        package_content[objIndex].UOM = package_uom;
        package_content[objIndex].Active = "Yes";
        this.setState({
          package_content,
        });
      } else {
        temp_content = {
          Item_Code: package_code,
          Description: package_name,
          Qty: package_qty,
          U_Price: package_price,
          Total: temp_price,
          Unit_Disc: package_discount,
          P_Price: temp_total,
          Total_Amount: temp_total,
          UOM: package_uom,
          Active: "yes",
        };
        package_content.push(temp_content);
        this.setState({
          package_content,
        });
      }
    } else {
      temp_content = {
        Item_Code: package_code,
        Description: package_name,
        Qty: package_qty,
        U_Price: package_price,
        Total: temp_price,
        Unit_Disc: package_discount,
        P_Price: temp_total,
        Total_Amount: temp_total,
        UOM: package_uom,
        Active: "yes",
      };
      package_content.push(temp_content);
    }
    this.setState({ package_content });
    console.log(package_content, package_content.length);
    this.calculatetotal(content_total);

    package_code = "";
    package_name = "";
    package_uom = "";
    package_price = "";
    package_qty = "";
    package_discount = 0;
    this.setState({
      package_code,
      package_name,
      package_uom,
      package_price,
      package_qty,
      package_discount,
    });
  };

  calculatetotal = (ct) => {
    console.log("cjlalsskla");
    let { package_content, content_total, package_total } = this.state;
    content_total = ct;
    package_total = ct;
    this.setState({ content_total, package_total });
    package_content.map((x, index) => {
      console.log(x.P_Price);
      console.log(content_total, package_content);
      content_total = (Number(content_total) + Number(x.P_Price)).toFixed(2);
      package_total = content_total;
      console.log(content_total);
    });
    this.setState({ content_total, package_total });
    console.log(content_total);
  };

  package = ({ target: { value, name } }) => {
    let {
      from_date,
      to_date,
      start_time,
      to_time,
      appt,
      Appt_TDT,
      package_price,
      package_qty,
      package_discount,
      content_total,
      disc_amount,
      package_total,
      packagedeptvalue,
      searchone,
    } = this.state;
    if (name == "packagedeptvalue") {
      packagedeptvalue = value;
      searchone = value;
      this.setState({ packagedeptvalue, searchone });
      console.log(searchone);
    }
    if (name == "from_date") {
      from_date = value;
      this.setState({ from_date });
    }
    if (name == "to_date") {
      to_date = value;
      this.setState({ to_date });
    }
    if (name == "start_time") {
      start_time = value;
      this.setState({ start_time });
    }
    if (name == "from_date") {
      from_date = value;
      this.setState({ from_date });
    }
    if (name == "to_time") {
      to_time = value;
      this.setState({ to_time });
    }
    if (name == "appt") {
      appt = value;
      this.setState({ appt });
    }
    if (name == "Appt_TDT") {
      Appt_TDT = value;
      this.setState({ Appt_TDT });
    }
    if (name == "package_price") {
      package_price = value;
      this.setState({ package_price });
    }
    if (name == "package_qty") {
      package_qty = value;
      this.setState({ package_qty });
    }
    if (name == "package_discount") {
      package_discount = value;
      this.setState({ package_discount });
    }
    if (name == "content_total") {
      content_total = value;
      this.setState({ content_total });
    }
    if (name == "disc_amount") {
      disc_amount = value;
      this.setState({ disc_amount });
    }
    if (name == "package_total") {
      package_total = value;
      this.setState({ package_total });
    }
  };

  updateitemusage = async (salon, retail) => {
    let { itemusage } = this.state;
    if (salon == true && retail == false) {
      console.log("one");
      await this.props.getStocks().then((res) => {
        for (let key of res) {
          if (key.itemDiv == "1") {
            itemusage.push({
              itemDiv: key.itemDiv,
              itemDesc: key.itemDesc,
              itemCode: key.itemCode,
              itemBarcode: key.itemBarcode,
            });
          }
        }
        console.log(itemusage);
        this.setState({ itemusage });
      });
    } else if (salon == false && retail == true) {
      console.log("two");
      await this.props.getStocks().then((res) => {
        for (let key of res) {
          if (key.itemDiv == "1") {
            itemusage.push({
              itemDiv: key.itemDiv,
              itemDesc: key.itemDesc,
              itemCode: key.itemCode,
              itemBarcode: key.itemBarcode,
            });
          }
        }
        console.log(itemusage);
        this.setState({ itemusage });
      });
    } else {
      console.log("three");
      await this.props.getStocks().then((res) => {
        for (let key of res) {
          if (key.itemDiv == "1" || key.itemDiv == "2") {
            itemusage.push({
              itemDiv: key.itemDiv,
              itemDesc: key.itemDesc,
              itemCode: key.itemCode,
              itemBarcode: key.itemBarcode,
            });
          }
        }
        console.log(itemusage);
        this.setState({ itemusage });
      });
    }
  };
  itemusagestock = ({ target: { value, name } }) => {
    let { salon, retail } = this.state;
    console.log(name, value);
    if (name == "salon") {
      salon = value;
      this.setState({ salon });
      this.updateitemusage(salon, retail);
    }
    if (name == "retail") {
      retail = value;
      this.setState({ retail });
      this.updateitemusage(salon, retail);
    }
  };

  addpackage = (code, name, uom, price, qty) => {
    let {
      package_code,
      package_name,
      package_uom,
      package_price,
      package_qty,
    } = this.state;

    package_code = code;
    package_name = name;
    package_price = price;
    package_uom = uom;
    package_qty = qty;

    this.setState({
      package_code,
      package_name,
      package_uom,
      package_price,
      package_qty,
    });
    console.log(
      package_code,
      package_name,
      package_uom,
      package_price,
      package_qty
    );
  };

  filterByName = ({ target: { value, name } }) => {
    console.log(value, name);
    let { itemusage, filterdata, search, seachdata, pageCount } = this.state;
    if (name == "search") {
      search = value;
      this.setState({ search });
    }
    if (search !== "") {
      filterdata = itemusage.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    }
    this.setState({ filterdata });
    console.log(filterdata);
    seachdata = filterdata.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    pageCount = Math.ceil(filterdata.length / this.state.perPage);
    this.setState({ seachdata, pageCount });
  };

  filterBydept = ({ target: { value, name } }) => {
    console.log(value, name);
    let { package_details, filterdataone, searchone } = this.state;

    if (searchone !== "") {
      filterdataone = package_details.filter((item) => {
        return Object.values(item.department)
          .join("")
          .toLowerCase()
          .includes(searchone.toLowerCase());
      });
    }
    this.setState({ filterdataone });
    console.log(filterdataone);
  };
  Additem = async () => {
    if (
      this.state.stockdivision == null ||
      this.state.dept == null ||
      this.state.stockclass == null ||
      this.state.brand == null ||
      this.state.stockname == null ||
      this.state.stocktype == null ||
      this.state.range == null
    ) {
      console.log("Check");
      Toast({
        type: "error",
        message: "Please check General required field",
      });
    } else {
      let { check } = this.state;
      check = true;
      this.setState({ check });
      if (this.state.stockdivision == "1" || this.state.stockdivision == "2") {
        console.log("SSSSAA");
        if (this.state.supply_itemsval == null) {
          Toast({
            type: "error",
            message: "Please check required field",
          });
          check = false;
          this.setState({ check });
        }
        if (this.state.tax == true) {
          console.log("SSSSBB");
          if (this.state.taxone == null && this.state.taxtwo == null) {
            Toast({
              type: "error",
              message: "Please check Tax required field",
            });
            check = false;
            this.setState({ check });
          }
        }
        if (this.state.commissionable == true) {
          console.log("SSSSCC");
          if (
            this.state.work_commission == null ||
            this.state.sales_point == null ||
            this.state.work_point == null ||
            this.state.Sales_commission == null
          ) {
            Toast({
              type: "error",
              message: "Please check commissionable required field",
            });
            check = false;
            this.setState({ check });
          }
        }
      } else {
        if (this.state.tax == true) {
          console.log("SSSSBB");
          if (this.state.taxone == null && this.state.taxtwo == null) {
            Toast({
              type: "error",
              message: "Please check Tax required field",
            });
            check = false;
            this.setState({ check });
          }
        } else if (this.state.commissionable == true) {
          console.log("SSSSCC");
          if (
            this.state.work_commission == null ||
            this.state.sales_point == null ||
            this.state.work_point == null ||
            this.state.Sales_commission == null
          ) {
            Toast({
              type: "error",
              message: "Please check commissionable required field",
            });
            check = false;
            this.setState({ check });
          }
        }
      }
      if (check == true) {
        let { control_no } = this.state;

        console.log("check");
        if (this.state.stockdivision == "5") {
          this.prepaidopencondition(control_no);
        }
        if (
          this.state.stockdivision == "3" ||
          this.state.stockdivision == "2"
        ) {
          this.finalpackage();
          this.finalPackageHdrs();
          this.Itemusagelist();
        }
        if (this.state.stockdivision !== "5") {
          this.linkcodecondition(control_no);
        }
        if (
          this.state.stockdivision == "1" ||
          this.state.stockdivision == "2"
        ) {
          this.itembatchapi(control_no);
          if (this.finaluomprice(control_no)) {
            let newitem = {
              itemCode: control_no,
              itmIcid: null,
              itmCode: null,
              itemDiv: this.state.stockdivision,
              itemDept: this.state.dept,
              itemClass: this.state.stockclass,
              itemBarcode: null,
              onhandCst: this.state.uomcost == null ? null : this.state.uomcost,
              itemMargin:
                this.state.uommargin == null ? null : this.state.uommargin,
              itemIsactive: this.state.item_active,
              itemName: this.state.stockname,
              itemAbbc: null,
              itemDesc: this.state.item_desc,
              costPrice: "",
              itemPrice: this.state.stockprice,
              itemPriceFloor: this.state.floorprice,
              itemPriceCeiling: this.state.priceceiling,
              onhandQty: null,
              itmPromotionyn: null,
              itmDisc: null,
              itmCommission: null,
              itemType: this.state.stocktype,
              itmDuration: null,
              itemPrice2: null,
              itemPrice3: null,
              itemPrice4: null,
              itemPrice5: null,
              itmRemark: null,
              itmValue: null,
              itmExpiredate: null,
              itmStatus: null,
              itemMinqty: null,
              itemMaxqty: null,
              itemOnhandcost: null,
              itemBarcode1: null,
              itemBarcode2: null,
              itemBarcode3: null,
              itemMarginamt: null,
              itemDate: null,
              itemTime: null,
              itemModdate: null,
              itemModtime: null,
              itemCreateuser: null,
              itemSupp: this.state.supply_itemsval,
              itemParentcode: null,
              itemColor: null,
              itemSizepack: null,
              itemSize: null,
              itemSeason: null,
              itemFabric: null,
              itemBrand: this.state.brand,
              lstpoUcst: null,
              lstpoNo: null,
              lstpoDate: null,
              itemHavechild: false,
              valueApplytochild: false,
              packageDisc: null,
              havePackageDisc: false,
              picPath: null,
              itemFoc: false,
              itemUom: null,
              mixbrand: false,
              serviceretail: null,
              itemRange: this.state.range,
              commissionable: this.state.commissionable,
              trading: false,
              custReplenishDays: this.state.Replenishment,
              custAdvanceDays: this.state.Remind_advance,
              salescomm: this.state.Sales_commission,
              workcomm: this.state.work_commission,
              reminderActive: null,
              disclimit: this.state.disclimit,
              disctypeamount: true,
              autocustdisc: this.state.auto_cust_disc,
              reorderActive: this.state.reoreder_level,
              reorderMinqty: this.state.min_qty,
              serviceExpireActive: false,
              serviceExpireMonth: "",
              treatmentLimitActive: false,
              treatmentLimitCount: "",
              limitserviceFlexionly: false,
              salescommpoints: this.state.sales_point,
              workcommpoints: this.state.work_point,
              itemPriceFloor: this.state.floorprice,
              itemPriceCeiling: this.state.priceceiling,
              voucherValue: this.state.vouchervalue,
              voucherValueIsAmount: this.state.vouchervalid,
              voucherValidPeriod: this.state.validity,
              prepaidValue: this.state.prepaidamountone,
              prepaidSellAmt: this.state.prepaidamount,
              prepaidValidPeriod: this.state.valid,
              membercardnoaccess: true,
              rptCode: this.state.rptcode,
              isGst: false,
              accountCode: "",
              isOpenPrepaid: false,
              apptWdMin: null,
              istnc: null,
              serviceCost: false,
              serviceCostPercent: false,
              accountCodeTd: this.state.account_no,
              voucherIsvalidUntilDate: false,
              voucherValidUntilDate: null,
              t1TaxCode: this.state.taxone,
              isHaveTax: this.state.tax,
              t2TaxCode: this.state.taxtwo,
              isAllowFoc: this.state.allow_foc,
              vilidityFromDate: null,
              vilidityToDate: null,
              vilidityFromTime: null,
              vilidityToTime: null,
              equipmentcost: null,
              postatus: null,
              moqqty: null,
              printdesc: null,
              printlineno: null,
              itemClassIdId: this.state.itemClassIdId,
              itemDeptIdId: this.state.itemDeptIdId,
              itemDivIdId: this.state.itemDivIdId,
              itemRangeIdId: this.state.itemRangeIdId,
              itemTypeIdId: this.state.itemTypeIdId,
              printuom: null,
            };
            await this.props
              .updateCommon(
                `Stocks/update?where=%7B%22itemCode%22%3A%20${control_no}%7D
        `,
                newitem
              )
              .then((data) => {
                Toast({
                  type: "success",
                  message: "Successfully Updated",
                });
                this.handlefinalinput();
              })
              .catch((e) => console.log(e));
          }
        } else {
          let newitem = {
            itemCode: control_no,
            itmIcid: null,
            itmCode: null,
            itemDiv: this.state.stockdivision,
            itemDept: this.state.dept,
            itemClass: this.state.stockclass,
            itemBarcode: null,
            onhandCst: this.state.uomcost == null ? null : this.state.uomcost,
            itemMargin:
              this.state.uommargin == null ? null : this.state.uommargin,
            itemIsactive: this.state.item_active,
            itemName: this.state.stockname,
            itemAbbc: null,
            itemDesc: this.state.item_desc,
            costPrice: "",
            itemPrice: this.state.stockprice,
            onhandQty: null,
            itmPromotionyn: null,
            itmDisc: null,
            itmCommission: null,
            itemType: this.state.stocktype,
            itmDuration: null,
            itemPrice2: null,
            itemPrice3: null,
            itemPrice4: null,
            itemPrice5: null,
            itmRemark: null,
            itmValue: null,
            itmExpiredate: null,
            itmStatus: null,
            itemMinqty: null,
            itemMaxqty: null,
            itemOnhandcost: null,
            itemBarcode1: null,
            itemBarcode2: null,
            itemBarcode3: null,
            itemMarginamt: null,
            itemDate: null,
            itemTime: null,
            itemModdate: null,
            itemModtime: null,
            itemCreateuser: null,
            itemSupp: this.state.supply_itemsval,
            itemParentcode: null,
            itemColor: null,
            itemSizepack: null,
            itemSize: null,
            itemSeason: null,
            itemFabric: null,
            itemBrand: this.state.brand,
            lstpoUcst: null,
            lstpoNo: null,
            lstpoDate: null,
            itemHavechild: false,
            valueApplytochild: false,
            packageDisc: null,
            havePackageDisc: false,
            picPath: this.state.images,
            itemFoc: false,
            itemUom: null,
            mixbrand: false,
            serviceretail: null,
            itemRange: this.state.range,
            commissionable: this.state.commissionable,
            trading: false,
            custReplenishDays: this.state.Replenishment,
            custAdvanceDays: this.state.Remind_advance,
            salescomm: this.state.Sales_commission,
            workcomm: this.state.work_commission,
            reminderActive: null,
            disclimit: this.state.disclimit,
            disctypeamount: true,
            autocustdisc: this.state.auto_cust_disc,
            reorderActive: this.state.reoreder_level,
            reorderMinqty: this.state.min_qty,
            serviceExpireActive: false,
            serviceExpireMonth: "",
            treatmentLimitActive: false,
            treatmentLimitCount: "",
            limitserviceFlexionly: false,
            salescommpoints: this.state.sales_point,
            workcommpoints: this.state.work_point,
            itemPriceFloor: this.state.floorprice,
            itemPriceCeiling: this.state.priceceiling,
            voucherValue: this.state.vouchervalue,
            voucherValueIsAmount: this.state.vouchervalid,
            voucherValidPeriod: this.state.validity,
            prepaidValue: this.state.prepaidamountone,
            prepaidSellAmt: this.state.prepaidamount,
            prepaidValidPeriod: this.state.valid,
            membercardnoaccess: this.state.card_noacc,
            rptCode: this.state.rptcode,
            isGst: false,
            accountCode: "",
            isOpenPrepaid: false,
            apptWdMin: null,
            istnc: null,
            serviceCost: false,
            serviceCostPercent: false,
            accountCodeTd: this.state.account_no,
            voucherIsvalidUntilDate: false,
            voucherValidUntilDate: null,
            t1TaxCode: this.state.taxone,
            isHaveTax: this.state.tax,
            t2TaxCode: this.state.taxtwo,
            isAllowFoc: this.state.allow_foc,
            vilidityFromDate: null,
            vilidityToDate: null,
            vilidityFromTime: null,
            vilidityToTime: null,
            equipmentcost: null,
            postatus: null,
            moqqty: null,
            printdesc: null,
            printlineno: null,
            itemClassIdId: this.state.itemClassIdId,
            itemDeptIdId: this.state.itemDeptIdId,
            itemDivIdId: this.state.itemDivIdId,
            itemRangeIdId: this.state.itemRangeIdId,
            itemTypeIdId: this.state.itemTypeIdId,
            printuom: null,
            item_seq: this.state.item_seq,
          };
          await this.props
            .updateCommon(
              `Stocks/update?where=%7B%22itemCode%22%3A%20${control_no}%7D
        `,
              newitem
            )
            .then((data) => {
              Toast({
                type: "success",
                message: "Successfully Updated",
              });
              this.handlefinalinput();
            })
            .catch((e) => console.log(e));
        }
      }
    }
  };
  handlefinalinput = () => {
    this.props.history.push(`/admin/backend`);
  };

  handleitemPriceChange = (event, item, index) => {
    if (Number(event.target.value) > 0) {
      let { uomsde } = this.state;
      uomsde[index]["itemPrice"] = event.target.value;
      this.setState({ uomsde });
      console.log(uomsde);
    }
  };
  handleitemCostChange = (event, item, index) => {
    if (Number(event.target.value) > 0) {
      let { uomsde } = this.state;
      uomsde[index]["itemCost"] = event.target.value;
      this.setState({ uomsde });
      console.log(uomsde);
    }
  };
  handleminMarginChange = (event, item, index) => {
    if (Number(event.target.value) > 0) {
      let { uomsde } = this.state;
      uomsde[index]["minMargin"] = event.target.value;
      this.setState({ uomsde });
      console.log(uomsde);
    }
  };
  render() {
    let {
      stkbalanceDetails,
      LinkcodeDetails,
      StockDetails,
      prepaidamount,
      prepaidprice,
      validvoucherdate,
      UOMoneDetails,
      account_no,
      UOMtwoDetails,
      editid,
      editval,
      ItemoneDetails,
      card_noacc,
      prepaidall,
      min_qty,
      Replenishment,
      Remind_advance,
      salescommissiongroup,
      workcommissiongroup,
      work_point,
      sales_point,
      ItemtwoDetails,
      prepaidDetails,
      isopenlinkedit,
      isopenitemedit,
      pageMeta,
      staffList,
      is_loading,
      item_desc,
      prepaid_inclusive,
      prepaid_exclusive,
      prepaidexclusive,
      option,
      count,
      isoption,
      linklist,
      isgeneral,
      uomsde,
      itemClassIdId,
      itemDeptIdId,
      itemDivIdId,
      itemRangeIdId,
      itemTypeIdId,
      isstk,
      islink,
      isstock,
      isvoucher,
      isaccode,
      prepaidftable,
      packageDetails,
      packagetwoDetails,
      isuom,
      isitem,
      isprepaid,
      stockdivision,
      prepaidinclusive,
      Division,
      prepaidamountone,
      dept,
      brand,
      stockname,
      stocktype,
      istaxcode,
      stockprice,
      floorprice,
      disclimit,
      stockclass,
      stock_type,
      range,
      description,
      duration,
      range_desc,
      range_brand,
      range_code,
      range_active,
      reoreder_level,
      iscommission,
      subitemusage,
      customer_replan,
      priceceiling,
      sitecode,
      uomcode,
      isOpendepartment,
      isOpenbrand,
      isOpenclass,
      itemusage_qty,
      itemusage_des,
      isopenrange,
      itemusage_uom,
      images,
      itemusage_code,
      isOpenuom,
      itemusage,
      isOpenlink,
      vouchervalue,
      validity,
      Uoms,
      sitegroup,
      stocklist,
      rangeoption,
      valid,
      uomprice,
      uomcost,
      taxone,
      taxtwo,
      taxoneop,
      Sales_commission,
      work_commission,
      taxtwoop,
      supply_itemsval,
      uommargin,
      validperiod,
      brandlist,
      supplyitem,
      vouchervalid,
      depts,
      classoption,
      control_no,
      inclusive,
      exclusive,
      Inclusive_type,
      exclusive_type,
      commissionable,
      item_active,
      redeem_item,
      open_prepaid,
      percent,
      allow_foc,
      auto_cust_disc,
      tax,
      start_time,
      from_date,
      to_date,
      Appt_TDT,
      package_dept,
      packagedeptvalue,
      appt,
      package_details,
      to_time,
      package_code,
      package_name,
      package_uom,
      package_price,
      package_qty,
      package_discount,
      content_total,
      disc_amount,
      package_total,
      salon,
      retail,
      package_content,
      disc_method,
      item_seq,
      filterdata,
      search,
      itemusage_barcode,
      itemusage_dept,
      itemusage_div,
      searchone,
      filterdataone,
      ishistory,
      pricetracker,
      tracker,
      Itemdata,
    } = this.state;

    let { t } = this.props;
    return (
      <>
        <div className="col-md-4 d-flex align-items-center">
          <div className="detail d-flex">
            <p
              className="category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Master Data")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p
              className="sub-category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Item Master")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Stock Item Data Entry")}</p>
          </div>
        </div>
        <div className="container-fluid dataentry">
          <div
            className="d-flex  justify-content-between p-3 General "
            onClick={() => this.generalcontent()}
          >
            <p>{t("General")}</p>
            <div className="icon">
              {isgeneral == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {isgeneral == true ? (
            <div className="container-fluid generalcontent">
              <div className="row">
                <div className="col-6 ">
                  <div className="mt-3">
                    <span>{t("Stock Division")}</span>
                    <span className="star">*</span>
                    <div className="input-group">
                      <NormalSelect
                        options={Division}
                        value={stockdivision}
                        onChange={this.temp}
                        name="stockdivision"
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("Department")}</span>
                    <span className="star">*</span>
                    <div className="d-flex">
                      <div className="input-group">
                        <NormalSelect
                          options={depts}
                          value={dept}
                          name="dept"
                          onChange={this.temp}
                          disabled={true}
                        />
                      </div>
                      <div className="col-3 ">
                        <NormalButton
                          mainbg={true}
                          label={"Add New"}
                          onClick={() => this.handleDialog()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("Brand")}</span>
                    <span className="star">*</span>
                    <div className="d-flex">
                      <div className="input-group">
                        <NormalSelect
                          options={brandlist}
                          value={brand}
                          onChange={this.temp}
                          name="brand"
                        />
                      </div>
                      <div className="col-3 ">
                        <NormalButton
                          mainbg={true}
                          label={"Add New"}
                          onClick={() => this.handlebrandDialog()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 ">
                    <p>{t("Picture")}</p>
                    <div className="mt-3 ml-2">
                      <DragFileUpload
                        className={`file-uploader size-sm ${
                          images ? "" : "no-img"
                        }`}
                        label="Upload Thumbnail"
                        handleFileUpload={this.handleImageUpload}
                      ></DragFileUpload>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{"Stock Name"}</span>
                    <span className="star">*</span>
                    <div className="input-group">
                      <NormalInput
                        onChange={this.temp}
                        value={stockname}
                        name="stockname"
                        placeholder="Enter Stock name"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("Stock Type")}</span>
                    <span className="star">*</span>
                    <div className="input-group">
                      <NormalSelect
                        options={stock_type}
                        value={stocktype}
                        onChange={this.temp}
                        name="stocktype"
                      />
                    </div>
                  </div>
                  <div className="d-flex mt-3">
                    {stockdivision == 3 || stockdivision == 5 ? (
                      <div className="input-group">
                        <p>{t("Price")}</p>
                        <div className="input-group">
                          <NormalInput
                            onChange={this.temp}
                            value={stockprice}
                            name="stockprice"
                            placeholder="Enter price"
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {stockdivision == 3 ? (
                      <>
                        <div className="col-3 mt-4">
                          <NormalButton
                            mainbg={true}
                            label={"Price History"}
                            onClick={() => this.handlehistory()}
                          />
                        </div>
                        <div className="input-group">
                          <p>{t("Floor Price")}</p>
                          <div className="input-group">
                            <NormalInput
                              onChange={this.temp}
                              value={floorprice}
                              name="floorprice"
                              placeholder="Enter Floor price"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  {stockdivision == 3 ||
                  stockdivision == 4 ||
                  stockdivision == 5 ? (
                    ""
                  ) : (
                    <div className="mt-3">
                      <span>{t("Supplier Code")}</span>
                      <span className="star">*</span>
                      <div className="input-group">
                        <NormalSelect
                          options={supplyitem}
                          value={supply_itemsval}
                          onChange={this.temp}
                          name="supply_itemsval"
                        />
                      </div>
                    </div>
                  )}
                  {stockdivision == 4 || stockdivision == 5 ? (
                    ""
                  ) : (
                    <div className="mt-3">
                      <span>{"Discount Limit"}</span>
                      <div className="input-group">
                        <NormalInput
                          onChange={this.temp}
                          value={disclimit}
                          name="disclimit"
                          type="number"
                          placeholder="Enter Discount limit"
                        />
                      </div>
                    </div>
                  )}
                  <div className="mt-3 d-flex">
                    <div className="col-4 d-flex">
                      <NormalCheckbox
                        checked={item_active}
                        name="item_active"
                        onChange={this.handlecheckbox}
                      />
                      <p>{t("Active")}</p>
                    </div>
                    <div className="col-4 d-flex">
                      <NormalCheckbox
                        checked={commissionable}
                        name="commissionable"
                        onChange={this.handlecheckbox}
                      />
                      <p>{t("Commissionable")}</p>
                    </div>
                    <div className="col-4 d-flex">
                      <NormalCheckbox
                        checked={redeem_item}
                        name="redeem_item"
                        onChange={this.handlecheckbox}
                      />
                      <p>{t("Redeem Item")}</p>
                    </div>
                  </div>
                </div>

                <div className="col-6 ">
                  <div className="col-6  mt-5">
                    <div className="input-group">
                      <NormalInput
                        value={control_no}
                        name="control"
                        onChange={this.temp}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("Class")}</span>
                    <span className="star">*</span>
                    <div className="d-flex">
                      <div className="input-group">
                        <NormalSelect
                          options={classoption}
                          value={stockclass}
                          onChange={this.temp}
                          name="stockclass"
                        />
                      </div>
                      <div className="col-3 ">
                        <NormalButton
                          mainbg={true}
                          label={"Add New"}
                          onClick={() => this.handleclassDialog()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("Range")}</span>
                    <span className="star">*</span>
                    <div className="d-flex">
                      <div className="input-group">
                        <NormalSelect
                          options={rangeoption}
                          value={range}
                          onChange={this.temp}
                          name="range"
                        />
                      </div>
                      <div className="col-3 ">
                        <NormalButton
                          mainbg={true}
                          label={"Add New"}
                          onClick={() => this.handlerangeDialog()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 imagecontainer">
                    {images ? (
                      <div className="item_img">
                        <img src={displayImg(images)} alt="" />
                      </div>
                    ) : (
                      <div className="uploader-content text-center">
                        <span>Upload Image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <span>{t("Description")}</span>
                    <span className="star">*</span>
                    <div className="input-group">
                      <NormalInput
                        onChange={this.temp}
                        value={item_desc}
                        name="item_desc"
                        placeholder="Enter Description"
                      />
                    </div>
                  </div>
                  {stockdivision == 3 ||
                  stockdivision == 4 ||
                  stockdivision == 5 ? (
                    <div className="mt-3">
                      <span>{t("Duration (Minutes)")}</span>
                      <div className="input-group">
                        <NormalInput
                          value={duration}
                          onChange={this.temp}
                          name="duration"
                          type="number"
                          placeholder="Enter Duration"
                        />
                      </div>
                    </div>
                  ) : null}
                  {stockdivision == 3 ? (
                    <div className="d-flex mt-3">
                      <div className="input-group">
                        <p>{t("Cost")}</p>
                        <div className="input-group">
                          <NormalInput
                            onChange={this.temp}
                            value={priceceiling}
                            name="cost"
                            placeholder="Enter cost"
                          />
                        </div>
                      </div>

                      <div className="col-5">
                        <p>{t("Check")}</p>
                        <div className="d-flex mt-2">
                          <NormalCheckbox />
                          <p>{t("Percent")}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {stockdivision == 4 || stockdivision == 5 ? (
                    ""
                  ) : (
                    <div className="mt-3">
                      <span>{t("Check")}</span>
                      <div className="d-flex">
                        <div className="col-3">
                          <div className="d-flex">
                            <NormalCheckbox
                              checked={percent}
                              name="percent"
                              onChange={this.handlecheckbox}
                            />
                            <p>{t("Percent")}</p>
                          </div>
                        </div>
                        <div className="col-5">
                          <div className="d-flex">
                            <NormalCheckbox
                              checked={auto_cust_disc}
                              name="auto_cust_disc"
                              onChange={this.handlecheckbox}
                            />
                            <p>{t("Auto Cust Disc")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {stockdivision == 5 ? (
                    <div className="mt-3">
                      <span>{t("Check")}</span>
                      <div className="d-flex">
                        <div className="col-3">
                          <div className="d-flex">
                            <NormalCheckbox
                              checked={open_prepaid}
                              name="open_prepaid"
                              onChange={this.handlecheckbox}
                            />
                            <p>{t("Open Prepaid")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="mt-3 d-flex">
                    <div className="col-4 d-flex">
                      <NormalCheckbox
                        checked={tax}
                        name="tax"
                        onChange={this.handlecheckbox}
                      />
                      <p>{t("Tax")}</p>
                    </div>
                    <div className="col-4 d-flex">
                      <NormalCheckbox
                        checked={allow_foc}
                        name="allow_foc"
                        onChange={this.handlecheckbox}
                      />
                      <p>{t("Item allow FOC")}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("Display Sequence")}</span>
                    <div className="input-group">
                      <NormalInput
                        onChange={this.temp}
                        value={item_seq}
                        name="item_seq"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {commissionable == true ? (
            <div>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.commissioncontent()}
              >
                <p>{t("commission")}</p>
                <div className="icon">
                  {iscommission == false ? (
                    <AiOutlinePlus />
                  ) : (
                    <AiOutlineMinus />
                  )}
                </div>
              </div>
              {iscommission == true ? (
                <div className="container-fluid ">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Sales Commission Group")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalSelect
                            options={salescommissiongroup}
                            value={Sales_commission}
                            onChange={this.sublist}
                            name="Sales_commission"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Work Commission Group")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="input-group">
                          <NormalSelect
                            options={workcommissiongroup}
                            value={work_commission}
                            onChange={this.sublist}
                            name="work_commission"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("Sales Points")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="d-flex">
                          <div className="input-group">
                            <NormalInput
                              value={sales_point}
                              onChange={this.sublist}
                              name="sales_point"
                              placeholder="Enter Sales point"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span>{t("Work Points")}</span>
                        <span style={{ color: "red" }}>*</span>
                        <div className="d-flex">
                          <div className="input-group">
                            <NormalInput
                              value={work_point}
                              onChange={this.sublist}
                              name="work_point"
                              placeholder="Enter work point"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}

          {stocktype == "PACKAGE" ? (
            <div>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.commissioncontent()}
              >
                <p>{t("PACKAGE")}</p>
                <div className="icon">
                  {iscommission == false ? (
                    <AiOutlinePlus />
                  ) : (
                    <AiOutlineMinus />
                  )}
                </div>
              </div>
              {iscommission == true ? (
                <div className="container-fluid ">
                  <div className="row">
                    <div className="col-8">
                      <div className="d-flex">
                        <div className="mt-3 col-6">
                          <span>{t("From Date")}</span>
                          <div className="input-group">
                            <NormalDate
                              value={from_date}
                              name="from_date"
                              onChange={this.package}
                            />
                          </div>
                        </div>
                        <div className="mt-3 col-6">
                          <span>{t("To Date")}</span>
                          <div className="input-group">
                            <NormalDate
                              value={to_date}
                              name="to_date"
                              onChange={this.package}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex ">
                        <div className="mt-3 col-6">
                          <span>{t("From Time")}</span>
                          <div className="input-group">
                            <NormalTimePicker
                              className={`cursor-pointer`}
                              onChange={this.fromtimechange}
                              name="start_time"
                              timeOnly={true}
                              dateFormat={`HH:mm`}
                              showTime={true}
                              selected={false}
                              placeholder=""
                              timeIntervals={15}
                              value={start_time}
                              showIcon={false}
                            />
                          </div>
                        </div>
                        <div className="mt-3 col-6">
                          <span>{t("To Time")}</span>
                          <div className="input-group">
                            <NormalTimePicker
                              className={`cursor-pointer`}
                              onChange={this.totimechange}
                              name="to_time"
                              timeOnly={true}
                              dateFormat={`HH:mm`}
                              showTime={true}
                              selected={false}
                              placeholder=""
                              timeIntervals={15}
                              value={to_time}
                              showIcon={false}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className=" d-flex mt-3 col-6">
                          <NormalCheckbox
                            checked={Appt_TDT}
                            name="Appt_TDT"
                            onChange={this.package}
                          />
                          <span style={{ color: "red" }}>{t("Appt TDT")}</span>
                        </div>

                        <div className="mt-3 col-6">
                          <span style={{ color: "red" }}>{t("TO tome")}</span>
                          <div className="input-group">
                            <NormalInput
                              value={appt}
                              disabled={Appt_TDT == true ? false : true}
                              name="appt"
                              onChange={this.package}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="mt-3">
                        <span>{t("2. Discount Method")}</span>
                        <div onChange={(event) => this.packageradio(event)}>
                          <input
                            type="radio"
                            value="Evenly Average"
                            name="method"
                            defaultChecked
                            className="mt-1 ml-3"
                          />{" "}
                          Evenly Average
                          <input
                            type="radio"
                            value="Manual"
                            name="method"
                            className="mt-1 ml-3"
                          />{" "}
                          Manual
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 d-flex">
                    <div className="col-8">
                      <span>{t("Package Item Department")}</span>
                      <NormalSelect
                        options={package_dept}
                        value={packagedeptvalue}
                        onChange={this.package}
                        name="packagedeptvalue"
                      />
                    </div>
                    <div className="col-2 mt-4">
                      <NormalButton
                        mainbg={true}
                        label="Searchitems"
                        onClick={this.filterBydept}
                      />
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    {searchone.length > 1 ? (
                      <div className="tab-table-content">
                        <div className="py-4">
                          <div className="table-container">
                            <TableWrapper headerDetails={packageDetails}>
                              {is_loading ? (
                                <tr>
                                  <td colSpan="7">
                                    <div class="d-flex mt-5 align-items-center justify-content-center">
                                      <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : filterdataone.length > 0 ? (
                                filterdataone.map(
                                  (
                                    {
                                      stockName,
                                      division,
                                      department,
                                      brand,
                                      range,
                                      uom,
                                      uomUnit,
                                      item_Price,
                                      stockCode,
                                      quantity,
                                    },
                                    index
                                  ) => {
                                    return (
                                      <tr>
                                        <td className="position-relative status-type">
                                          <div className="d-flex align-items-center justify-content-center">
                                            {stockName}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {division}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {department}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {brand}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {range}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {uom}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {uomUnit}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {item_Price}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center cursor-pointer">
                                            <FaRegHandPointUp
                                              size={20}
                                              color="blue"
                                              onClick={() =>
                                                this.addpackage(
                                                  stockCode,
                                                  stockName,
                                                  uom,
                                                  item_Price,
                                                  quantity
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )
                              ) : null}
                            </TableWrapper>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="tab-table-content">
                        <div className="py-4">
                          <div className="table-container">
                            <TableWrapper headerDetails={packageDetails}>
                              {is_loading ? (
                                <tr>
                                  <td colSpan="7">
                                    <div class="d-flex mt-5 align-items-center justify-content-center">
                                      <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : package_details.length > 0 ? (
                                package_details.map(
                                  (
                                    {
                                      stockName,
                                      division,
                                      department,
                                      brand,
                                      range,
                                      uom,
                                      uomUnit,
                                      item_Price,
                                      stockCode,
                                      quantity,
                                    },
                                    index
                                  ) => {
                                    return (
                                      <tr>
                                        <td className="position-relative status-type">
                                          <div className="d-flex align-items-center justify-content-center">
                                            {stockName}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {division}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {department}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {brand}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {range}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {uom}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {uomUnit}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {item_Price}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center cursor-pointer">
                                            <FaRegHandPointUp
                                              size={20}
                                              color="blue"
                                              onClick={() =>
                                                this.addpackage(
                                                  stockCode,
                                                  stockName,
                                                  uom,
                                                  item_Price,
                                                  quantity
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )
                              ) : null}
                            </TableWrapper>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex">
                    <div className="mt-3 col-3">
                      <span>{t("Code")}</span>
                      <NormalInput
                        value={package_code}
                        name="package_code"
                        onChange={this.package}
                        disabled={true}
                      />
                    </div>
                    <div className="mt-3 col-6">
                      <span>{t("Name")}</span>
                      <NormalInput
                        value={package_name}
                        name="package_name"
                        onChange={this.package}
                        disabled={true}
                      />
                    </div>
                    <div className="mt-3 col-3">
                      <span>{t("UOM")}</span>
                      <NormalInput
                        value={package_uom}
                        name="package_uom"
                        onChange={this.package}
                        disabled={true}
                      />
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="mt-3 col-2">
                      <span>{t("Price")}</span>
                      <NormalInput
                        value={package_price}
                        name="package_price"
                        onChange={this.package}
                        placeholder="Enter price"
                        type="number"
                      />
                    </div>
                    <div className="mt-3 col-2">
                      <span>{t("Qty")}</span>
                      <NormalInput
                        value={package_qty}
                        name="package_qty"
                        onChange={this.package}
                        placeholder="Enter Qty"
                        type="number"
                      />
                    </div>
                    <div className="mt-3 col-2">
                      <span>{t("Discount")}</span>
                      <NormalInput
                        value={package_discount}
                        name="package_discount"
                        onChange={this.package}
                        placeholder="Enter Discount"
                        type="number"
                      />
                    </div>
                    <div className="mt-5 col-2">
                      <NormalButton
                        mainbg={true}
                        label="Insert/update"
                        onClick={() =>
                          this.insertpackage(
                            package_code,
                            package_uom,
                            package_qty,
                            package_name,
                            package_price,
                            package_discount
                          )
                        }
                      />
                    </div>
                    <div className="mt-5 col-2">
                      <NormalButton
                        mainbg={true}
                        label="Remove/inactive"
                        onClick={() => this.deletepackage(package_code)}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span>{t("4. Package Content")}</span>
                  </div>
                  <div className="col-12">
                    <div className="tab-table-content">
                      <div className="py-4">
                        <div className="table-container">
                          <TableWrapper headerDetails={packagetwoDetails}>
                            {is_loading ? (
                              <tr>
                                <td colSpan="7">
                                  <div class="d-flex mt-5 align-items-center justify-content-center">
                                    <div class="spinner-border" role="status">
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : package_content.length > 0 ? (
                              package_content.map(
                                (
                                  {
                                    Item_Code,
                                    Description,
                                    Qty,
                                    U_Price,
                                    Total,
                                    Unit_Disc,
                                    P_Price,
                                    Total_Amount,
                                    UOM,
                                    Active,
                                  },
                                  index
                                ) => {
                                  return (
                                    <tr>
                                      <td className="position-relative status-type">
                                        <div className="d-flex align-items-center justify-content-center">
                                          {Item_Code}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {Description}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {Qty}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {U_Price}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {Total}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {Unit_Disc}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {P_Price}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {Total_Amount}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {UOM}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {Active}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center cursor-pointer">
                                          <BiPencil
                                            size={20}
                                            onClick={() =>
                                              this.selectcode(Item_Code)
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            ) : null}
                          </TableWrapper>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="mt-3 col-3 d-flex">
                      <span>{t("Content Total")}</span>
                      <NormalInput
                        value={content_total}
                        name="content_total"
                        onChange={this.package}
                        disabled={true}
                      />
                    </div>
                    {disc_method !== "Manual" ? (
                      <div className="mt-3 col-5 d-flex">
                        <span>{t("Disc Amount")}</span>
                        <NormalInput
                          value={disc_amount}
                          name="disc_amount"
                          onChange={this.package}
                          type="number"
                        />
                        <div className="col-5">
                          <NormalButton
                            mainbg={true}
                            label="Apply Discount"
                            onClick={() => this.applydiscount(disc_amount)}
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className=" col-3">
                      <span>{t("Total Price")}</span>
                      <NormalInput
                        value={package_total}
                        name="package_total"
                        onChange={this.package}
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}

          {stockdivision == "1" ||
          stockdivision == "2" ||
          stockdivision == null ? (
            <div>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.UOMcontent()}
              >
                <p>{t("UOM")}</p>
                <div className="icon">
                  {isuom == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {isuom == true ? (
                <div>
                  <div className="col-12 mt-3">
                    <div className="tab-table-content">
                      <div className="py-4">
                        <div className="table-container">
                          <TableWrapper headerDetails={UOMoneDetails}>
                            {is_loading ? (
                              <tr>
                                <td colSpan="7">
                                  <div class="d-flex mt-5 align-items-center justify-content-center">
                                    <div class="spinner-border" role="status">
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : uomsde.length > 0 ? (
                              uomsde.map(
                                (
                                  {
                                    id,
                                    itemUom,
                                    uomDesc,
                                    uomUnit,
                                    itemUom2,
                                    uom2Desc,
                                  },
                                  index
                                ) => {
                                  return (
                                    <tr>
                                      <td className="position-relative status-type">
                                        <div className="d-flex align-items-center justify-content-center">
                                          {index + 1}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {itemUom}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {uomDesc}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {"="}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {uomUnit}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {itemUom2}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {uom2Desc}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center cursor-pointer">
                                          <RiDeleteBin5Line
                                            size={20}
                                            onClick={() => this.deleteuom(id)}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            ) : null}
                          </TableWrapper>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-2">
                    <NormalButton
                      mainbg={true}
                      label={"Add Row"}
                      onClick={() => this.handleuomDialog()}
                    />
                  </div>
                  <div className="col-12 mt-3">
                    <div className="tab-table-content">
                      <div className="py-4">
                        <div className="table-container">
                          <TableWrapper headerDetails={UOMtwoDetails}>
                            {is_loading ? (
                              <tr>
                                <td colSpan="7">
                                  <div class="d-flex mt-5 align-items-center justify-content-center">
                                    <div class="spinner-border" role="status">
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : uomsde.length > 0 ? (
                              uomsde.map((x, index) => {
                                return (
                                  <tr>
                                    <td>
                                      <div className="text-right">
                                        {index + 1}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {x.itemUom}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center justify-content-center">
                                        <div className="input-group">
                                          <input
                                            style={{
                                              width: "150px",
                                              textAlign: "right",
                                            }}
                                            value={x.itemPrice}
                                            name="itemPrice"
                                            onChange={(event) =>
                                              this.handleitemPriceChange(
                                                event,
                                                x,
                                                index
                                              )
                                            }
                                            type={`number`}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center justify-content-center">
                                        <div className="input-group">
                                          <input
                                            style={{
                                              width: "150px",
                                              textAlign: "right",
                                            }}
                                            value={x.itemCost}
                                            name="itemCost"
                                            onChange={(event) =>
                                              this.handleitemCostChange(
                                                event,
                                                x,
                                                index
                                              )
                                            }
                                            type={`number`}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center justify-content-center">
                                        <div className="input-group">
                                          <input
                                            style={{
                                              width: "150px",
                                              textAlign: "right",
                                            }}
                                            value={x.minMargin}
                                            name="minMargin"
                                            onChange={(event) =>
                                              this.handleminMarginChange(
                                                event,
                                                x,
                                                index
                                              )
                                            }
                                            type={`number`}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center justify-content-center cursor-pointer">
                                        <RiDeleteBin5Line
                                          size={20}
                                          onClick={() => this.deleteuom(x.id)}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : null}
                          </TableWrapper>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {stockdivision == "1" ||
          stockdivision == "2" ||
          stockdivision == null ? (
            <div>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.stkbalancecontent()}
              >
                <p>{t("Skt.Balance")}</p>
                <div className="icon">
                  {isstk == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {isstk == true ? (
                <div className="row">
                  <div className="col">
                    <p className="mt-3 text-black common-label-text">
                      {t("Site Code")}
                    </p>
                    <div className="input-group">
                      <NormalSelect
                        options={sitegroup}
                        value={sitecode}
                        onChange={this.handlechangestk}
                        name="sitecode"
                      />
                    </div>
                    <p className="mt-3 text-black common-label-text">
                      {t("UOM Code")}
                    </p>
                    <div className=" d-flex mt-3">
                      <div className="input-group">
                        <NormalSelect
                          options={Uoms}
                          value={uomcode}
                          onChange={this.handlechangestk}
                          name="uomcode"
                        />
                      </div>
                      <div className="ml-5">
                        <NormalButton mainbg={true} label={"Refresh"} />
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <div className="tab-table-content">
                        <div className="py-4">
                          <div className="table-container">
                            <TableWrapper
                              headerDetails={stkbalanceDetails}
                              queryHandler={this.handlePagination}
                              pageMeta={pageMeta}
                            >
                              {is_loading ? (
                                <tr>
                                  <td colSpan="7">
                                    <div class="d-flex mt-5 align-items-center justify-content-center">
                                      <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : staffList.length > 0 ? (
                                staffList.map(
                                  (
                                    {
                                      id,
                                      emp_name,
                                      emp_phone1,
                                      emp_code,
                                      services,
                                      site_code,
                                      defaultsitecode,
                                      status,
                                    },
                                    index
                                  ) => {
                                    return (
                                      <tr key={index}>
                                        <td className="position-relative status-type">
                                          <span
                                            className={`${
                                              status === "available"
                                                ? "available"
                                                : "not-available"
                                            }`}
                                          ></span>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {emp_name}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-center">
                                            {emp_phone1}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )
                              ) : null}
                            </TableWrapper>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col mt-5">
                    <div className="col-12 mt-3 d-flex justify-content-between">
                      <div className="d-flex">
                        <NormalCheckbox
                          checked={reoreder_level}
                          name="reoreder_level"
                          onChange={this.handlechangestk}
                        />
                        <p>{t("Re-Order Level")}</p>
                      </div>
                      {reoreder_level == true ? (
                        <div className="d-flex">
                          <p className="mr-3">{t("Min_Qty")}</p>
                          <NormalInput
                            value={min_qty}
                            name="min_qty"
                            type="number"
                            onChange={this.handlestk}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="col-12 mt-5 d-flex">
                      <NormalCheckbox
                        checked={customer_replan}
                        name="customer_replan"
                        onChange={this.handlechangestk}
                      />
                      <p>{t("Customer Replenishment")}</p>
                    </div>
                    {customer_replan == true ? (
                      <>
                        <div className="col-8 mt-5 d-flex ">
                          <p className="mr-3 col-4">{t("Replenishment")}</p>
                          <NormalInput
                            value={Replenishment}
                            name="Replenishment"
                            type="number"
                            onChange={this.handlestk}
                          />
                          <p className="ml-3">{t("Days")}</p>
                        </div>
                        <div className="col-8 mt-5 d-flex ">
                          <p className="mr-3 col-4">{t("Remind_advance")}</p>
                          <NormalInput
                            value={Remind_advance}
                            name="Remind_advance"
                            type="number"
                            onChange={this.handlestk}
                          />
                          <p className="ml-3">{t("Days")}</p>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : null}
          {stockdivision == "5" ? (
            ""
          ) : (
            <div>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.Linkcontent()}
              >
                <p>{t("Link code")}</p>
                <div className="icon">
                  {islink == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {islink == true ? (
                <div>
                  <div className="col-12 mt-3">
                    <div className="tab-table-content">
                      <div className="py-4">
                        <div className="table-container">
                          <TableWrapper
                            headerDetails={LinkcodeDetails}
                            queryHandler={this.handlePagination}
                            pageMeta={pageMeta}
                          >
                            {is_loading ? (
                              <tr>
                                <td colSpan="7">
                                  <div class="d-flex mt-5 align-items-center justify-content-center">
                                    <div class="spinner-border" role="status">
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : linklist.length > 0 ? (
                              linklist.map(
                                (
                                  { linkCode, linkDesc, rptCodeStatus },
                                  index
                                ) => {
                                  return (
                                    <tr key={index}>
                                      <td className="position-relative status-type">
                                        <div className="d-flex align-items-center justify-content-center">
                                          {linkCode}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {linkDesc}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          <NormalCheckbox
                                            checked={rptCodeStatus}
                                            onChange={(e) =>
                                              this.handleCheckboxtwo(linkCode)
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center cursor-pointer">
                                          <BsPencilSquare
                                            size={20}
                                            onClick={() =>
                                              this.changelink(
                                                linkCode,
                                                linkDesc,
                                                linklist.length
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            ) : null}
                          </TableWrapper>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-2">
                    <NormalButton
                      mainbg={true}
                      label={"Add Row"}
                      onClick={() => this.handlelinkDialog()}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
          <div
            className="d-flex  justify-content-between p-3 General mt-5"
            onClick={() => this.stockcontent()}
          >
            <p>{t("Stock Listing")}</p>
            <div className="icon">
              {isstock == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {isstock == true ? (
            <div>
              <div className="col-12 mt-3">
                <div className="tab-table-content">
                  <div className="py-4">
                    <div className="table-container">
                      <TableWrapper
                        headerDetails={StockDetails}
                        queryHandler={this.handlePagination}
                        pageMeta={pageMeta}
                      >
                        {is_loading ? (
                          <tr>
                            <td colSpan="7">
                              <div class="d-flex mt-5 align-items-center justify-content-center">
                                <div class="spinner-border" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : stocklist.length > 0 ? (
                          stocklist.map(
                            (
                              { itemsiteCode, itemsiteDesc, itemsiteIsactive },
                              index
                            ) => {
                              return (
                                <tr key={index}>
                                  <td className="position-relative status-type">
                                    <div className="d-flex align-items-center justify-content-center">
                                      {itemsiteCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center justify-content-center">
                                      {itemsiteDesc}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center justify-content-center">
                                      <NormalCheckbox
                                        checked={itemsiteIsactive}
                                        onChange={(e) =>
                                          this.handleCheckboxone(itemsiteCode)
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : null}
                      </TableWrapper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {stockdivision == "3" || stockdivision == null ? (
            <div>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.Itemusagecontent()}
              >
                <p>{t("Item Usage")}</p>
                <div className="icon">
                  {isitem == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {isitem == true ? (
                <div>
                  <div className="container-fluid mt-3">
                    <div className="itemmaster-container col-xl">
                      <div className="row align-items-center">
                        <div className="col-md-12">
                          <div className="d-flex justify-content-between">
                            <div className="w-100 col-7 search-bar">
                              <InputSearch
                                placeholder={t("Search")}
                                onChange={this.filterByName}
                                placeholder="Search by Stock code / Stock Name"
                              />
                            </div>
                            <div className="d-flex w-100 col-3 entries">
                              <p className="mt-2">{t("Show")}</p>
                              <div className="p-1">
                                <NormalSelect
                                  options={option}
                                  value={count}
                                  onChange={this.pagination}
                                  name="count"
                                />
                              </div>
                              <p className="mt-2">{t("Entries")}</p>
                            </div>
                            <div className=" d-flex w-100 col-3 ">
                              <div className="col">
                                <div className="col-12 d-flex">
                                  <NormalCheckbox
                                    checked={salon}
                                    name="salon"
                                    onChange={this.itemusagestock}
                                  />
                                  <p>{t("Show Salon")}</p>
                                </div>
                                <div className="col-12  d-flex">
                                  <NormalCheckbox
                                    checked={retail}
                                    name="retail"
                                    onChange={this.itemusagestock}
                                  />
                                  <p>{t("Show Retail")}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {search.length > 1 ? (
                        <div className="tab-table-content">
                          <div className="py-4">
                            <div className="table-container">
                              <TableWrapper
                                headerDetails={ItemoneDetails}
                                queryHandler={this.handlePagination}
                                pageMeta={pageMeta}
                              >
                                {is_loading ? (
                                  <tr>
                                    <td colSpan="7">
                                      <div class="d-flex mt-5 align-items-center justify-content-center">
                                        <div
                                          class="spinner-border"
                                          role="status"
                                        >
                                          <span class="sr-only">
                                            Loading...
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ) : this.state.seachdata.length > 0 ? (
                                  this.state.seachdata.map(
                                    (
                                      {
                                        itemCode,
                                        itemBarcode,
                                        itemDesc,
                                        itemDiv,
                                        itemdept,
                                        itemUom,
                                        itemIsactive,
                                      },
                                      index
                                    ) => {
                                      return (
                                        <tr key={index}>
                                          <td>
                                            <div className="text-left">
                                              {itemDesc}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="text-right">
                                              {itemCode}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="text-right">
                                              {itemBarcode}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="text-center">
                                              <BsPencilSquare
                                                size={20}
                                                onClick={() =>
                                                  this.Additemusage(
                                                    itemCode,
                                                    itemDesc,
                                                    itemdept,
                                                    itemDiv,
                                                    itemBarcode,
                                                    itemUom,
                                                    itemIsactive
                                                  )
                                                }
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )
                                ) : null}
                              </TableWrapper>
                            </div>
                          </div>
                          <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={(event) =>
                              this.handlePageClick(event)
                            }
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                          />
                        </div>
                      ) : (
                        <div className="tab-table-content">
                          <div className="py-4">
                            <div className="table-container">
                              <TableWrapper
                                headerDetails={ItemoneDetails}
                                queryHandler={this.handlePagination}
                                pageMeta={pageMeta}
                              >
                                {is_loading ? (
                                  <tr>
                                    <td colSpan="7">
                                      <div class="d-flex mt-5 align-items-center justify-content-center">
                                        <div
                                          class="spinner-border"
                                          role="status"
                                        >
                                          <span class="sr-only">
                                            Loading...
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ) : Itemdata.length > 0 ? (
                                  Itemdata.map(
                                    (
                                      {
                                        itemCode,
                                        itemBarcode,
                                        itemDesc,
                                        itemDiv,
                                        itemdept,
                                        itemUom,
                                        itemIsactive,
                                      },
                                      index
                                    ) => {
                                      return (
                                        <tr key={index}>
                                          <td>
                                            <div className="text-left">
                                              {itemDesc}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="text-right">
                                              {itemCode}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="text-right">
                                              {itemBarcode}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="text-center">
                                              <BsPencilSquare
                                                size={20}
                                                onClick={() =>
                                                  this.Additemusage(
                                                    itemCode,
                                                    itemDesc,
                                                    itemdept,
                                                    itemDiv,
                                                    itemBarcode,
                                                    itemUom,
                                                    itemIsactive
                                                  )
                                                }
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )
                                ) : null}
                              </TableWrapper>
                            </div>
                          </div>
                          <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={(event) =>
                              this.handlePageClick(event)
                            }
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                          />
                        </div>
                      )}
                      <div className="tab-table-content mt-5">
                        <div className="py-4">
                          <div className="table-container">
                            <TableWrapper headerDetails={ItemtwoDetails}>
                              {is_loading ? (
                                <tr>
                                  <td colSpan="7">
                                    <div class="d-flex mt-5 align-items-center justify-content-center">
                                      <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : subitemusage.length > 0 ? (
                                subitemusage.map(
                                  (
                                    {
                                      ItemCode,
                                      Description,
                                      Quantity,
                                      UOM,
                                      Active,
                                    },
                                    index
                                  ) => {
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <div className="text-right">
                                            {ItemCode}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="text-left">
                                            {Description}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="text-right">
                                            {Quantity}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="text-left">{UOM}</div>
                                        </td>
                                        <td>
                                          <div className="text-left">
                                            {Active == true ? "Yes" : "No"}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="text-center">
                                            <RiDeleteBin5Line
                                              size={20}
                                              onClick={() =>
                                                this.deleteitem(index)
                                              }
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )
                              ) : null}
                            </TableWrapper>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {stockdivision == "4" || stockdivision == null ? (
            <div>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.vouchercontent()}
              >
                <p>{t("Voucher")}</p>
                <div className="icon">
                  {isvoucher == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {isvoucher == true ? (
                <div>
                  <div className="row">
                    <div className="col-6">
                      <div className="d-flex">
                        <div className="d-flex col-4">
                          <div className="mt-3">
                            <NormalCheckbox
                              checked={vouchervalid}
                              name="vouchervalid"
                              onChange={this.temp}
                            />
                          </div>
                          <p className="mt-3 text-black common-label-text">
                            {t("Validity Period")}
                          </p>
                        </div>
                        <div className="col-4 mt-3">
                          {vouchervalid == true ? (
                            <NormalDate
                              value={validvoucherdate}
                              name="validvoucherdate"
                              onChange={this.temp}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="d-flex">
                        <p className="mt-3 text-black common-label-text col-4">
                          {t("Validity Period")}
                        </p>
                        <div className="col-6 mt-3 ml-6">
                          <NormalSelect
                            options={validperiod}
                            value={validity}
                            name="validity"
                            onChange={this.handlechangestk}
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <p className="mt-3 text-black common-label-text col-4">
                          {t("Value")}
                        </p>
                        <div className="col-6 mt-3 ml-6">
                          <NormalInput
                            onChange={this.handlechangestk}
                            value={vouchervalue}
                            type="number"
                            placeholder="Enter tha value"
                            name="vouchervalue"
                          />
                        </div>
                        <div className=" d-flex mt-4">
                          <input
                            type="radio"
                            name="amount"
                            className="mt-1"
                            checked={true}
                          />
                          <label className="ml-2">{t("Amount")}</label>
                          <input
                            type="radio"
                            name="amount"
                            className="mt-1 ml-3"
                          />
                          <label className="ml-2">{t("Percent")}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {stockdivision == "5" || stockdivision == null ? (
            <div>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.Prepaidcontent()}
              >
                <p>{t("Prepaid")}</p>
                <div className="icon">
                  {isprepaid == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {isprepaid == true ? (
                <div>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-7">
                        <div className="d-flex">
                          <p className="mt-3 text-black common-label-text col-3">
                            {t("Valid Period")}
                          </p>
                          <div className="col-4 mt-3 ml-6">
                            <NormalSelect
                              options={validperiod}
                              value={validity}
                              name="validity"
                              onChange={this.handlechangestk}
                            />
                          </div>
                          <div className="d-flex">
                            <div className="mt-3 ">
                              <NormalCheckbox
                                checked={card_noacc}
                                name="card_noacc"
                                onChange={this.handlechangestk}
                              />
                            </div>
                            <p className="mt-3 text-black common-label-text ">
                              {t("Member Card No Accessible")}
                            </p>
                          </div>
                        </div>
                        <div className="d-flex">
                          <p className="mt-3 text-black common-label-text col-3">
                            {t("Inclusive Type")}
                          </p>
                          <div className="col-4 mt-3 ml-6">
                            <NormalSelect
                              options={Inclusive_type}
                              value={inclusive}
                              name="inclusive"
                              onChange={this.temp}
                            />
                          </div>
                          <div className="d-flex">
                            <div className="mt-3 ">
                              <NormalCheckbox
                                checked={prepaidall}
                                name="prepaidall"
                                onChange={this.handlechangestk}
                              />
                            </div>
                            <p className="mt-3 text-black common-label-text ">
                              {t("All")}
                            </p>
                          </div>
                          <div className="col-4 mt-3 ml-6">
                            <NormalSelect
                              options={prepaid_inclusive}
                              value={prepaidinclusive}
                              disabled={prepaidall == true ? true : false}
                              onChange={this.handlechangestk}
                              name="prepaidinclusive"
                            />
                          </div>
                        </div>

                        <div className="d-flex">
                          <p className="mt-3 text-black common-label-text col-3">
                            {t("Exclusive")}
                          </p>
                          <div className="col-4 mt-3 ml-6">
                            <NormalSelect
                              options={exclusive_type}
                              value={exclusive}
                              name="exclusive"
                              onChange={this.temp}
                            />
                          </div>
                          <div className="col-4 mt-3 ml-5">
                            <NormalSelect
                              options={prepaid_exclusive}
                              value={prepaidexclusive}
                              name="prepaidexclusive"
                              onChange={this.handlechangestk}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-5 mt-5">
                        <div className="d-flex ">
                          <div className="col-4 mt-4">
                            <NormalInput
                              placeholder="price"
                              type="number"
                              value={prepaidprice}
                              name="prepaidprice"
                              onChange={this.handlechangestk}
                            />
                          </div>
                          <div className="col-4 mt-3 ml-6">
                            <div className="d-flex">
                              <div className="mt-3 ">
                                <input
                                  type="radio"
                                  name="amount"
                                  checked={true}
                                  className="mr-1"
                                />
                              </div>
                              <p className="mt-3 text-black common-label-text ">
                                {t("Amount$")}
                              </p>
                            </div>
                          </div>
                          <div className="col-4 mt-4">
                            <NormalButton
                              mainbg={true}
                              label={"Add"}
                              onClick={() =>
                                this.prapaidtable(
                                  "Inclusive",
                                  inclusive,
                                  prepaidinclusive,
                                  prepaidprice
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="col-4 mt-3">
                            <NormalButton
                              mainbg={true}
                              label={"Add"}
                              onClick={() =>
                                this.prapaidtableone(
                                  "Exclusive",
                                  exclusive,
                                  prepaidexclusive
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container-fluid">
                    <div className="tab-table-content">
                      <div className="py-4">
                        <div className="table-container">
                          <TableWrapper
                            headerDetails={prepaidDetails}
                            queryHandler={this.handlePagination}
                            pageMeta={pageMeta}
                          >
                            {is_loading ? (
                              <tr>
                                <td colSpan="7">
                                  <div class="d-flex mt-5 align-items-center justify-content-center">
                                    <div class="spinner-border" role="status">
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : prepaidftable.length > 0 ? (
                              prepaidftable.map(
                                (
                                  {
                                    pItemtype,
                                    conditiontype1,
                                    conditiontype2,
                                    prepaidSellAmt,
                                  },
                                  index
                                ) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {pItemtype}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {conditiontype1}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {conditiontype2}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {prepaidSellAmt}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {prepaidSellAmt}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                          {"Yes"}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-center cursor-pointer">
                                          <RiDeleteBin5Line
                                            size={20}
                                            onClick={() =>
                                              this.Deleteprepaid(index)
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            ) : null}
                          </TableWrapper>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-5">
                    <div className="d-flex ">
                      <div className="col-2 mt-4">{t("Prepaid Value")}</div>
                      <div className="col-3 mt-3 ml-6">
                        <NormalInput
                          type="number"
                          disabled={true}
                          value={prepaidamountone}
                          placeholder="Enter the Amount"
                        />
                      </div>
                      <div className="col-2"></div>
                      <div className="col-2 mt-4">{t("Prepaid Amount")}</div>
                      <div className="col-3 mt-3 ml-6">
                        <NormalInput
                          type="number"
                          value={prepaidamount}
                          placeholder="Enter the Amount"
                          onChange={this.handlechangestk}
                          name="prepaidamount"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          <div
            className="d-flex  justify-content-between p-3 General mt-5"
            onClick={() => this.Accountcodecontent()}
          >
            <p>{t("Account Code")}</p>
            <div className="icon">
              {isaccode == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </div>
          </div>
          {isaccode == true ? (
            <div className="container-fluid">
              <div className="d-flex mt-3 justify-content-center">
                <div className="mt-1">
                  <p>{t("Account Code")}</p>
                </div>
                <div className="col-4">
                  <NormalInput
                    placeholder={"Enter account code"}
                    value={account_no}
                    type="number"
                    onChange={this.temp}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {tax == true ? (
            <>
              <div
                className="d-flex  justify-content-between p-3 General mt-5"
                onClick={() => this.taxcodecontent()}
              >
                <p>{t("Tax Code")}</p>
                <div className="icon">
                  {istaxcode == false ? <AiOutlinePlus /> : <AiOutlineMinus />}
                </div>
              </div>
              {istaxcode == true ? (
                <div className="container-fluid ">
                  <div className="row">
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("1st Tax Code")}</span>
                        <span className="star">*</span>
                        <div className="input-group">
                          <NormalSelect
                            options={taxoneop}
                            value={taxone}
                            onChange={this.temp}
                            name="taxone"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-6 ">
                      <div className="mt-3">
                        <span>{t("2nd Tax Code")}</span>
                        <span className="star">*</span>
                        <div className="d-flex">
                          <div className="input-group">
                            <NormalSelect
                              options={taxtwoop}
                              value={taxtwo}
                              onChange={this.temp}
                              name="taxtwo"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>

        <div className="mt-5 col-1">
          <NormalButton
            mainbg={true}
            label={"Update"}
            onClick={() => this.Additem()}
          />
        </div>
        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "50%" }}
          modal={isOpendepartment}
          handleModal={this.handleDialog}
        >
          <img
            onClick={this.handleDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <Departmentpopup
            handleModal={this.handleDialog}
            handlelist={this.listofdept}
          ></Departmentpopup>
        </NormalModal>
        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "45%" }}
          modal={isOpenbrand}
          handleModal={this.handlebrandDialog}
        >
          <img
            onClick={this.handlebrandDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <Brandpopup
            handleModal={this.handlebrandDialog}
            handlelist={this.listofbrand}
          ></Brandpopup>
        </NormalModal>
        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "60%" }}
          modal={isOpenclass}
          handleModal={this.handleclassDialog}
        >
          <img
            onClick={this.handleclassDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <Classpopup
            handleModal={this.handleclassDialog}
            handlelist={this.listofclasses}
          ></Classpopup>
        </NormalModal>
        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "60%" }}
          modal={isOpenuom}
          handleModal={this.handleuomDialog}
        >
          <img
            onClick={this.handleuomDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <Newuompopup
            handleModal={this.handleuomDialog}
            listofuom={this.listofuomprices}
          ></Newuompopup>
        </NormalModal>
        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "40%" }}
          modal={isOpenlink}
          handleModal={this.handlelinkDialog}
        >
          <img
            onClick={this.handlelinkDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <Newlinkpopup
            handleModal={this.handlelinkDialog}
            name={item_desc}
            id={control_no}
            listoflinklist={this.listoflinklist}
          ></Newlinkpopup>
        </NormalModal>
        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "40%" }}
          modal={isopenlinkedit}
          handleModal={this.handleEditlinkDialog}
        >
          <img
            onClick={this.handleEditlinkDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />

          <Editlinkpopup
            handleModal={this.handleEditlinkDialog}
            name={editval}
            code={editid}
            listoflinklist={this.listofEditlinklist}
          ></Editlinkpopup>
        </NormalModal>

        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "40%" }}
          modal={isopenitemedit}
          handleModal={this.handleEdititemDialog}
        >
          <img
            onClick={this.handleEdititemDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <div>
            <h6>Add</h6>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>Item Code</p>
                <NormalInput
                  value={itemusage_code}
                  name="item_code"
                  onChange={this.Item_Code}
                />
              </div>
              <div className="col-6">
                <span>Item Description</span>
                <span style={{ color: "red" }}>*</span>
                <NormalInput
                  value={itemusage_des}
                  name="itemusage_des"
                  onChange={this.Item_Code}
                />
              </div>
            </div>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <p>UOM</p>
                <NormalSelect
                  value={itemusage_uom}
                  options={Uoms}
                  name="itemusage_uom"
                  onChange={this.Item_Code}
                />
              </div>
              <div className="col-6">
                <span>Qty</span>
                <span style={{ color: "red" }}>*</span>
                <NormalInput
                  value={itemusage_qty}
                  name="itemusage_qty"
                  onChange={this.Item_Code}
                />
              </div>
            </div>
            <div className="d-flex mt-3 justify-content-between">
              <div className="pl-2">
                <NormalButton
                  mainbg={true}
                  label={"Cancel"}
                  onClick={this.handleEdititemDialog}
                />
              </div>
              <div className="pr-2">
                <NormalButton
                  mainbg={true}
                  label={"Submit"}
                  onClick={() =>
                    this.Additemusagetable(
                      itemusage_code,
                      itemusage_des,
                      itemusage_barcode,
                      itemusage_dept,
                      itemusage_div,
                      itemusage_uom,
                      itemusage_qty
                    )
                  }
                />
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "50%" }}
          modal={isopenrange}
          handleModal={this.handlerangeDialog}
        >
          <img
            onClick={this.handlerangeDialog}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <div>
            <h6>Add New Range</h6>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <span>Code</span>
                <span style={{ color: "red" }}>*</span>
                <NormalInput
                  value={range_code}
                  name="range_code"
                  type="number"
                  disabled={true}
                  onChange={this.handlerange}
                />
              </div>
              <div className="col-6">
                <span>Description</span>
                <span style={{ color: "red" }}>*</span>
                <NormalInput
                  value={range_desc}
                  name="range_desc"
                  onChange={this.handlerange}
                />
              </div>
            </div>
            <div className="mt-4 d-flex">
              <div className="col-6">
                <span>Brand</span>
                <span style={{ color: "red" }}>*</span>
                <NormalSelect
                  value={range_brand}
                  name="range_brand"
                  options={brandlist}
                  onChange={this.handlerange}
                />
              </div>
              <div className="col-6 d-flex mt-3">
                <NormalCheckbox
                  checked={range_active}
                  name="range_active"
                  onChange={this.handlerange}
                />
                <p>{t("Active")}</p>
              </div>
            </div>
            <div className="d-flex mt-3 justify-content-between">
              <div className="pl-2">
                <NormalButton
                  mainbg={true}
                  label={"Cancel"}
                  onClick={this.handlerangeDialog}
                />
              </div>
              <div className="pr-2">
                <NormalButton
                  mainbg={true}
                  label={"Submit"}
                  onClick={() =>
                    this.Addrangeitems(
                      range_code,
                      range_desc,
                      range_brand,
                      range_active
                    )
                  }
                />
              </div>
            </div>
          </div>
        </NormalModal>

        <NormalModal
          className={"payment-modal"}
          style={{ minWidth: "50%" }}
          modal={ishistory}
          handleModal={() => this.handlehistory()}
        >
          <img
            onClick={() => this.handlehistory()}
            className="close cursor-pointer"
            src={closeIcon}
            alt=""
          />
          <div>
            <h6>Price History Tracker</h6>
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper headerDetails={pricetracker}>
                    {is_loading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : tracker.length > 0 ? (
                      tracker.map(({ item_code, item_desc, price }, index) => {
                        return (
                          <tr key={index}>
                            <td className="position-relative status-type">
                              <div className="d-flex align-items-center justify-content-center">
                                {item_code}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {item_desc}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {price}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                {price}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : null}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>
        </NormalModal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      ItemDivs,
      ItemUom,
      ItemSitelists,
      VoucherConditions,
      ItemBrands,
      ItemSupplies,
      ItemDepts,
      ItemLinks,
      ItemUomprices,
      ItemTypes,
      ItemClasses,
      ItemStocklists,
      ItemRanges,
      getStocks,
      NewItemRanges,
      NewStocks,
      createStaffPlus,
      CommGroupHdrs,
      TaxType2TaxCodes,
      PrepaidOpenConditions,
      TaxType1TaxCodes,
      NewItemLinks,
      ItemBatches,
      updateCommon,
      NewPrepaidOpenConditions,
      PackageHdrs,
      NewItemUomprices,
      PackageDtls,
      PackageItemDetails,
      NewPackageHdrs,
      NewItemusagelists,
      Itemusagelists,
    },
    dispatch
  );
};

export const EditItem = withTranslation()(
  connect(null, mapDispatchToProps)(EditItemClass)
);
