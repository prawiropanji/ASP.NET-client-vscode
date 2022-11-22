$.ajax({
    url:'https://localhost:7002/api/Employee',
    type: 'GET',
    dataType: 'json',
}).done(res => {
    console.log(res);

    const employeePriaCount = res.data
        .filter(employee => employee.gender == "pria")
        .length
    const employeePerempuanCount =  res.data
        .filter(employee => employee.gender == "perempuan")
        .length


        var options = {
            series: [{
            name: 'Count',
            data: [employeePerempuanCount, employeePriaCount]
          }],
            chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '25%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ['Perempuan', 'Pria'],
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return  val + " people"
              }
            }
          }
          };
  
          var chart = new ApexCharts(document.querySelector("#chart"), options);
          chart.render();

})
        

        
     