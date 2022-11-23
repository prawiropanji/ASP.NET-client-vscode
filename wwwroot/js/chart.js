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



$.ajax({
  url: 'https://localhost:7002/api/Departement',
  method: 'GET',
  dataType: 'json'
}).done(res => {
  console.log(res)



  let divisionCountArray = []  

  res.data.forEach(departement => {
    
    let found = divisionCountArray.find(elementDivCount => {
  
          return elementDivCount.divisionId == departement.divisionId
    })


    if(found){
      found.count += 1
    }else{
      divisionCountArray.push({divisionId: departement.divisionId, count:1})
    }

    
  })


  let result = divisionCountArray.map(element => {
    // console.log(element)
    let newForm = {division: null, count:element.count}

    $.ajax({
      url: `https://localhost:7002/api/Division/${element.divisionId}`,
      method: 'GET',
      async: false,
      dataType: 'json'

    }).done(res => {
      newForm.division = res.data.name  
    })

    return newForm
  })

 



    //   let setDivisionId = new Set()

 

  // res.data.forEach(departemenet => {
    
  //   setDivisionId.add(departemenet.divisionId)
    
  // })


  

  // let ArrayDivisionId = [...setDivisionId]

  // console.log(ArrayDivisionId)



  // console.log(result)

  let labels = result.map(element => element.division)

  let series = result.map(element => element.count)



  var options = {
    series: series,
    labels: labels,
    chart: {
    type: 'donut',
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
  };
  
  var pieChart = new ApexCharts(document.querySelector("#pieChart"), options);
  pieChart.render()









  

  
  


})







        

        
     