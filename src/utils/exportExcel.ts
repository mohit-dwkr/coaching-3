import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



interface ExcelSheet {
  sheetName: string;
  data: any[];
}

interface ExportExcelProps {
  fileName: string;
  sheets: ExcelSheet[];
}

export const exportToExcel = ({
  fileName,
  sheets,
}: ExportExcelProps) => {

  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {

    if (!sheet.data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(sheet.data);

    // Auto Width
    const headers = Object.keys(sheet.data[0]);

    worksheet["!cols"] = headers.map((header) => {

      const maxLength = Math.max(
        header.length,
        ...sheet.data.map(row =>
          String(row[header] ?? "").length
        )
      );

      return {
        wch: Math.min(maxLength + 5, 40),
      };

    });

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sheet.sheetName
    );

  });

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(blob, `${fileName}.xlsx`);

};

