Highcharts.chart("container2", {
  chart: {
    type: "pie",
  },
  title: {
    text: "Distribucion de Avisos por Tipo de Mascota",
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
    point: {
      valueSuffix: "%",
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
      },
    },
  },
  series: [
    {
      name: "Tipo de Mascota",
      colorByPoint: true,
      data: [],
    },
  ],
});

fetch("/get-stats-data-pie")
  .then((response) => response.json())
  .then((data) => {

    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container2"
    );


    chart.update({
      series: [
        {
          data: data,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));
