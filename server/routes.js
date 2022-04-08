const DataGenerator = require("./mock/DataGenerator");
const XLSX = require("xlsx-js-style");
const path = require("path");
exports.ROUTES = {
  router: (request, response) => {
    const { url, method } = request;
    const urlMethod = `${url}:${method}`;
    const route = this.ROUTES[urlMethod]
      ? this.ROUTES[urlMethod]
      : this.ROUTES.default;
    return route(request, response);
  },
  default: (request, response) => {
    response.write("Default Route");
    return response.end();
  },
  "/excel:GET": (request, response) => {
    response.write("Excel:GET Route\n");
    const { data } = new DataGenerator(100, true);
    const worksheet = XLSX.utils.json_to_sheet(data, {
      cellStyles: true,
    });
    let alphabetic = [];
    for (const iterator of Object.keys(worksheet).values()) {
      const alphaName = iterator.replace(/\d/g, "");
      const foundName = alphabetic.findIndex((v) => v === alphaName);
      if (foundName >= 0) break;
      alphabetic = [...alphabetic, iterator.replace(/\d/g, "")];
    }
    const columns = alphabetic.map((a) => a + "1");
    for (const column of columns.values()) {
      worksheet[column]["s"] = { font: { name: "Courier", sz: 24 } };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SHEET");
    const filePath = path.resolve(__dirname, "uploads", "SHEET.xlsx");
    XLSX.writeFile(workbook, filePath);
    response.write(JSON.stringify(filePath));
    return response.end();
  },
  "excel:POST": (request, response) => {},
};