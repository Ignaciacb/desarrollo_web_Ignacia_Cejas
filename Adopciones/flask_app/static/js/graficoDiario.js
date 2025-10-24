Highcharts.chart("container", {
  chart: {
    type: "line",
  },
  title: {
    text: "Numero de Avisos de Adopcion Agregados por Dia",
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      month: "%b %e, %Y",
    },
    title: {
      text: "Fecha",
    },
  },
  yAxis: {
    title: {
      text: "Numero de Avisos",
    },
  },
  legend: {
    align: "left",
    verticalAlign: "top",
    borderWidth: 0,
  },

  tooltip: {
    shared: true,
    crosshairs: true,
  },

  series: [
    {
      name: "Avisos",
      data: [],
      lineWidth: 1,
      marker: {
        enabled: true,
        radius: 4,
      },
      color: "#FC2865",
    },
  ],
});

fetch("/get-stats-data")
  .then((response) => response.json())
  .then((data) => {
    let parsedData = data.map((item) => {
      const [year, month, day] = item.date
        .split("-")
        .map((part) => parseInt(part, 10));
      return [
        Date.UTC(year, month - 1, day), 
        item.count,
      ];
    });

    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container"
    );

    chart.update({
      series: [
        {
          data: parsedData,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));
