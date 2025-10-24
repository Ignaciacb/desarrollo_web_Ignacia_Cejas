Highcharts.chart("container3", {
  chart: {
    type: "column",
  },
  title: {
    text: "Avisos de Adopcion por Mes y Tipo de Mascota",
  },
  xAxis: {
    categories: [],
  },
  yAxis: {
    min: 0,
    title: {
      text: "Numero de Avisos",
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y}</b></td></tr>',
    footerFormat: "</table>",
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  series: [
    {
      name: "Perros",
      data: [],
      color: "#FF6B6B",
    },
    {
      name: "Gatos",
      data: [],
      color: "#4ECDC4",
    },
  ],
});

fetch("/get-stats-data-bar")
  .then((response) => response.json())
  .then((data) => {

    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container3"
    );

    chart.update({
      xAxis: {
        categories: data.categories,
      },
      series: [
        {
          data: data.perros,
        },
        {
          data: data.gatos,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));
