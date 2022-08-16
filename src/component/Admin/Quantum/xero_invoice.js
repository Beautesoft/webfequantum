import axios from "axios";

const importInvoiceToXero =async (lineitemsArray,formFields) => {


    try {
        console.log(lineitemsArray, "😂😂😂");
        let lineItems =lineitemsArray.map(
          (data) => ({
            Description: data.item_desc,
            Quantity: data.item_quantity,
            UnitAmount: data.item_price,
            AccountCode: "200",
            TaxType: "NONE",
            LineAmount: Number(data.item_quantity)*Number(data.item_price),
          })
        );

        

        const apiPayload = {
          Invoices: [
            {
              Type: "ACCREC",
              Contact: {
                ContactID:
                  "430fa14a-f945-44d3-9f97-5df5e28441b8",
                  
              },
              LineItems: lineItems,
              Date: formFields.quoDate,
              DueDate: "2018-12-10",
              Reference: formFields.projectTitle,
              Status: "AUTHORISED",
            },
          ],
        };
        const access_token_xero = localStorage.getItem("accessTokenXero")
        const tenantIdXero = localStorage.getItem("tenantIdXero")

        console.log(
          apiPayload,
          "working perfec 👍👍 inside xero function"
        );
        const res = await axios.put(
          "https://api.xero.com/api.xro/2.0/Invoices",
          apiPayload,
          {
            headers: {
              "content-type": "text/json",
              authorization:
                `Bearer ${access_token_xero}`,
              "xero-tenant-id":
              tenantIdXero,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            },
          }
        );
        console.log(
          res,
          "working perfec 👍👍 inside xero function"
        );
      } catch (err) {
        alert("Session Expired!! Please Reconnect to Xero to import Invoice")
        console.log(err, "error inside xero function");
      }
};

export { importInvoiceToXero };
