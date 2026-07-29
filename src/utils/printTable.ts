export const printTable = (
  title: string,
  columns: string[],
  data: any[]
) => {

  const printWindow = window.open("", "_blank");

  if (!printWindow) return;

  const tableRows = data
    .map(
      (row) => `
        <tr>
          ${columns
            .map(
              (col) =>
                `<td>${row[col] ?? ""}</td>`
            )
            .join("")}
        </tr>
      `
    )
    .join("");

  printWindow.document.write(`
    <html>

      <head>

        <title>${title}</title>

        <style>

          body{

            font-family:Arial;

            padding:30px;

          }

          h2{

            margin-bottom:20px;

          }

          table{

            width:100%;

            border-collapse:collapse;

          }

          th,td{

            border:1px solid #ccc;

            padding:8px;

            text-align:left;

          }

          th{

            background:#f4f4f4;

          }

        </style>

      </head>

      <body>

        <h2>${title}</h2>

        <table>

          <thead>

            <tr>

              ${columns
                .map(col => `<th>${col}</th>`)
                .join("")}

            </tr>

          </thead>

          <tbody>

            ${tableRows}

          </tbody>

        </table>

      </body>

    </html>
  `);

  
printWindow.document.close();

printWindow.onload = () => {

  printWindow.focus();

  printWindow.print();

  printWindow.onafterprint = () => {

    printWindow.close();

    window.focus();

  };
};

};