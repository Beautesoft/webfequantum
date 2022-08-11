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
                "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE2NTM5NzM2MDAsImV4cCI6MTY1Mzk3NTQwMCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiRUUwQzhGMkRFRDAzNDMzQTlEREE0NkVDMDcyQTA2REUiLCJzdWIiOiIzOTg1ZTY1YmY3ZmE1MTI2ODZlNGY2MTIzMTBkNGQxMSIsImF1dGhfdGltZSI6MTY1Mzk3MzU5OCwieGVyb191c2VyaWQiOiIyNGFhMWY2Ni02MjhhLTQwZjAtYjA1NC0wNjZiMTBiNTFkNDYiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6ImU5NTVkZDY1MTkxODQ0OTY5ODg0MDhjYzc5NGRlMDMwIiwianRpIjoiZGM5ZjU4MmUwZWQ4MzFkOTI3M2EzYzk5MTBmMGIwMGQiLCJhdXRoZW50aWNhdGlvbl9ldmVudF9pZCI6IjA1ZTBkMDg2LWI5MmItNDU3Zi1iN2JmLTk0NjQzMDFlMmQxZiIsInNjb3BlIjpbImVtYWlsIiwicHJvZmlsZSIsIm9wZW5pZCIsImFjY291bnRpbmcucmVwb3J0cy5yZWFkIiwiZmlsZXMiLCJwYXlyb2xsLmVtcGxveWVlcyIsInBheXJvbGwucGF5cnVucyIsInBheXJvbGwucGF5c2xpcCIsInBheXJvbGwudGltZXNoZWV0cyIsInByb2plY3RzIiwiYWNjb3VudGluZy5zZXR0aW5ncyIsImFjY291bnRpbmcuYXR0YWNobWVudHMiLCJhY2NvdW50aW5nLnRyYW5zYWN0aW9ucyIsImFjY291bnRpbmcuam91cm5hbHMucmVhZCIsImFzc2V0cyIsImFjY291bnRpbmcuY29udGFjdHMiLCJwYXlyb2xsLnNldHRpbmdzIiwiZmluYW5jZS5jYXNodmFsaWRhdGlvbi5yZWFkIiwiYWNjb3VudGluZy5idWRnZXRzLnJlYWQiLCJhY2NvdW50aW5nLnJlcG9ydHMudGVubmluZXR5bmluZS5yZWFkIiwiZmluYW5jZS5zdGF0ZW1lbnRzLnJlYWQiLCJmaW5hbmNlLmFjY291bnRpbmdhY3Rpdml0eS5yZWFkIiwiZmluYW5jZS5iYW5rc3RhdGVtZW50c3BsdXMucmVhZCIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJzc28iXX0.BjQyWljVTdTBVN_BS_lLRVMoEXtSAKEOe-DBzXeCmJ0NA40vWhHBOXYax-8kLYyAEaMOXVQgpzwKLOU2ZHxmspkkFztQwWOsU2UOgwQ67CJsHrbhq1MdXLtJdOz6ilLvZx7Kuh9ol7_dcrZWcIMRxWlOE6hTn5rQE6Mtv_8TlT-dAPSNAL0lxTE4WoT4HjebZqvjkOAazvSBK9gUC61fU-V1bjdLOC8i-yRyL2ME1J_-X2J04L0LYd-dyxpIgmKBA2nelL_epxgu1BdUSGQEPW2stQQgIZXt7drfBMTFu3d8UrFrOgq-alu4TElTzYiZt2bhVV1SsYZCKhQedgVk8A",
              "xero-tenant-id":
                "73ca661d-3307-4cfd-83d6-add12f7430e1",
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
        console.log(err, "error inside xero function");
      }
};

export { importInvoiceToXero };
