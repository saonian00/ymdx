$(function () {
  var faultByHourIndex = 0; //播放所在下标
  var faultByHourIndex1 = 0; //播放所在下标
  var faultByHourIndex2 = 0; //播放所在下标
  var faultByHourIndex4 = 0; //播放所在下标
  var faultByHourIndex5 = 0; //播放所在下标
  var faultByHourIndex6 = 0; //播放所在下标
  largeScreen();
  setInterval(function () {
    largeScreen();
  }, 5000);
  function largeScreen() {
    $.ajax({
      url: "https://api.zuche.miway.com/largeScreen",
      // url: "http://192.168.1.119:20008/largeScreen",
      // url: "http://ymzc-api.fintechzh.com/largeScreen",
      type: "POST",
      context: document.body,
      dataType: "JSON",
      traditional: true,
      success: function (result) {
        var data = result.data;
        map(data.cityVehicles, data.getCoordinateArray);
        echarts_1(data.countLeaseRenewalVO);
        echarts_2(data.countNewOrdersVO);
        echarts_4(data.countOrderByDay);
        echarts_31(data.ageDistributionVOS);
        echarts_33(data.cityVehiclesCircle);
        echarts_5(data.areaDistributionVO);
        echarts_6(data.orderByMonthVO);
        $("#countOrder").html(data.countOrder);
        $("#countUsers").html(data.countUsers);
        $("#countCertifyUsers").html(data.countCertifyUsers);
        if (faultByHourIndex > data.cityVehicles.length) {
          faultByHourIndex = 0;
        } else {
          faultByHourIndex++;
        }
        if (faultByHourIndex1 > data.countLeaseRenewalVO.city.length) {
          faultByHourIndex1 = 0;
        } else {
          faultByHourIndex1++;
        }
        if (faultByHourIndex2 > data.countNewOrdersVO.city.length) {
          faultByHourIndex2 = 0;
        } else {
          faultByHourIndex2++;
        }
        if (faultByHourIndex4 > data.countOrderByDay.name.length) {
          faultByHourIndex4 = 0;
        } else {
          faultByHourIndex4++;
        }
        if (faultByHourIndex5 > data.areaDistributionVO.city.length) {
          faultByHourIndex5 = 0;
        } else {
          faultByHourIndex5++;
        }
        if (faultByHourIndex6 > data.orderByMonthVO.countOrder.length) {
          faultByHourIndex6 = 0;
        } else {
          faultByHourIndex6++;
        }
        console.log(
          faultByHourIndex,
          faultByHourIndex1,
          faultByHourIndex2,
          faultByHourIndex4,
          faultByHourIndex5,
          faultByHourIndex6
        );
      },
    });
  }
  function map(data, geoCoordMap1) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("map_1"));
    var data = data;
    var geoCoordMap = geoCoordMap1[0];

    var convertData = function (data) {
      console.log(data);
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value),
          });
        }
      }
      return res;
    };
    option = {
      title: {
        text: "实时租车订单数",
        subtext: "data from YUNMA",
        sublink: "https://admin.zuche.miway.com",
        left: "center",
        textStyle: {
          color: "#fff",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          if (typeof params.value[2] == "undefined") {
            return params.name + " : " + params.value;
          } else {
            return params.name + " : " + params.value[2];
          }
        },
      },
      geo: {
        map: "china",
        label: {
          emphasis: {
            show: true,
          },
          normal: {
            show: true, //默认是否显示
            textStyle: {
              color: "#fff",
            },
          },
        },
        roam: false, //禁止其放大缩小
        itemStyle: {
          normal: {
            areaColor: "#4c60ff",
            borderColor: "#002097",
          },
          emphasis: {
            areaColor: "#293fff",
          },
        },
      },
      series: [
        {
          name: "Top 5",
          type: "effectScatter",
          coordinateSystem: "geo",
          data: convertData(
            data.sort(function (a, b) {
              return b.value - a.value;
            })
          ),
          symbolSize: function (val) {
            // return val[2] / 50;
            return 20;
          },
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke",
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: "{b}",
              position: "right",
              show: false,
            },
          },
          itemStyle: {
            normal: {
              color: "#ffd800",
              shadowBlur: 10,
              shadowColor: "rgba(0,0,0,.3)",
            },
          },
          zlevel: 1,
        },
      ],
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
    //使得tootip每隔三秒自动显示
    myChart.dispatchAction({
      type: "showTip", // 根据 tooltip 的配置项显示提示框。
      seriesIndex: 0,
      dataIndex: faultByHourIndex,
    });
  }

  function echarts_1(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("echart1"));
    option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "0%",
        top: "10px",
        right: "0%",
        bottom: "4%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: data.city,
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 1,
              type: "solid",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            show: true,
            splitNumber: 15,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1	)",
              width: 1,
              type: "solid",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
        },
      ],
      series: [
        {
          type: "bar",
          data: data.data,
          barWidth: "35%", //柱子宽度
          barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
              color: "#2f89cf",
              opacity: 1,
              barBorderRadius: 5,
            },
          },
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
    myChart.dispatchAction({
      type: "showTip", // 根据 tooltip 的配置项显示提示框。
      seriesIndex: 0,
      dataIndex: faultByHourIndex1,
    });
  }

  function echarts_2(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("echart2"));

    option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        left: "0%",
        top: "10px",
        right: "0%",
        bottom: "4%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: data.city,
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 1,
              type: "solid",
            },
          },

          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            // rotate:50,
            show: true,
            splitNumber: 15,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            //formatter: '{value} %'
            show: true,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1	)",
              width: 1,
              type: "solid",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
        },
      ],
      series: [
        {
          type: "bar",
          data: data.data,
          barWidth: "35%", //柱子宽度
          // barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
              color: "#27d08a",
              opacity: 1,
              barBorderRadius: 5,
            },
          },
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
    myChart.dispatchAction({
      type: "showTip", // 根据 tooltip 的配置项显示提示框。
      seriesIndex: 0,
      dataIndex: faultByHourIndex2,
    });
  }

  function echarts_4(data) {
    // 基于准备好的dom，初始化echarts实例
    console.log(data);
    var myChart = echarts.init(document.getElementById("echart4"));
    option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            color: "#dddc6b",
          },
        },
      },
      legend: {
        top: "0%",
        data: ["新增", "续租"],
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "12",
        },
      },
      grid: {
        left: "10",
        top: "30",
        right: "10",
        bottom: "10",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12,
            },
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.2)",
            },
          },
          data: data.name,
        },
        {
          axisPointer: { show: false },
          axisLine: { show: false },
          position: "bottom",
          offset: 20,
        },
      ],
      yAxis: [
        {
          type: "value",
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12,
            },
          },

          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
        },
      ],
      series: [
        {
          name: "新增",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: "#0184d5",
              width: 2,
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(1, 132, 213, 0.1)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
          },
          itemStyle: {
            normal: {
              color: "#0184d5",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12,
            },
          },
          data: data.newOrderByDay,
        },
        {
          name: "续租",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: "#00d887",
              width: 2,
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(0, 216, 135, 0.4)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(0, 216, 135, 0.1)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
          },
          itemStyle: {
            normal: {
              color: "#00d887",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12,
            },
          },
          data: data.leaseRenewalOrderByDay,
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
    // 动态显示tootip
    myChart.dispatchAction({
      type: "showTip", // 根据 tooltip 的配置项显示提示框。
      seriesIndex: 0,
      dataIndex: faultByHourIndex4,
    });
  }

  function echarts_5(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("echart5"));

    option = {
      //  backgroundColor: '#00265f',
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },

      grid: {
        left: "0%",
        top: "10px",
        right: "0%",
        bottom: "2%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: data.city,
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 1,
              type: "solid",
            },
          },

          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            show: true,
            splitNumber: 15,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            //formatter: '{value} %'
            show: true,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1	)",
              width: 1,
              type: "solid",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
        },
      ],
      series: [
        {
          type: "bar",
          data: data.data,
          barWidth: "35%", //柱子宽度
          // barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
              color: "#2f89cf",
              opacity: 1,
              barBorderRadius: 5,
            },
          },
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
    myChart.dispatchAction({
      type: "showTip", // 根据 tooltip 的配置项显示提示框。
      seriesIndex: 0,
      dataIndex: faultByHourIndex5,
    });
  }

  function echarts_6(data) {
    // 基于准备好的dom，初始化echarts实例

    // 基于准备好的dom，初始化echarts实例
    console.log(data);
    var myChart = echarts.init(document.getElementById("echart6"));
    option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            color: "#dddc6b",
          },
        },
      },
      //  legend: {
      //    top: "0%",
      //    data: ["新增"],
      //    textStyle: {
      //      color: "rgba(255,255,255,.5)",
      //      fontSize: "12",
      //    },
      //  },
      grid: {
        left: "10",
        top: "30",
        right: "10",
        bottom: "10",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12,
            },
            interval: 3,
            //  rotate:-20
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.2)",
            },
          },
          data: data.months,
        },
        {
          axisPointer: { show: false },
          axisLine: { show: false },
          position: "bottom",
          offset: 20,
        },
      ],
      yAxis: [
        {
          type: "value",
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12,
            },
          },

          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
        },
      ],
      series: [
        {
          name: "流水(元)",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: "#0184d5",
              width: 2,
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(1, 132, 213, 0.1)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
          },
          itemStyle: {
            normal: {
              color: "#0184d5",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12,
            },
          },
          data: data.countOrder,
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
    // 动态显示tootip
    myChart.dispatchAction({
      type: "showTip", // 根据 tooltip 的配置项显示提示框。
      seriesIndex: 0,
      dataIndex: faultByHourIndex6,
    });

    // var myChart = echarts.init(document.getElementById("echart6"));
    // var dataStyle = {
    //   normal: {
    //     label: {
    //       show: false,
    //     },
    //     labelLine: {
    //       show: false,
    //     },
    //     shadowBlur: 40,
    //     shadowColor: "rgba(40, 40, 40, 1)",
    //   },
    // };
    // var placeHolderStyle = {
    //   normal: {
    //     color: "rgba(255,255,255,.05)",
    //     label: { show: false },
    //     labelLine: { show: false },
    //   },
    //   emphasis: {
    //     color: "rgba(0,0,0,0)",
    //   },
    // };
    // var convertData = function (data) {
    //   var res = [];
    //   var city = data.city;
    //   var data = data.data;
    //   for (var i = 0; i < data.length; i++) {
    //     res.push({
    //       name: city[i],
    //       type: "pie",
    //       clockWise: false,
    //       center: ["50%", "40%"],
    //       radius: [`${59 - i * 10}%`, `${70 - i * 10}%`],
    //       itemStyle: dataStyle,
    //       hoverAnimation: false,
    //       data: [
    //         {
    //           value: data[i],
    //           name: i,
    //         },
    //         {
    //           value: 100 - data[i],
    //           name: "invisible",
    //           tooltip: { show: false },
    //           itemStyle: placeHolderStyle,
    //         },
    //       ],
    //     });
    //   }
    //   console.log(res);
    //   return res;
    // };
    // option = {
    //   color: ["#0f63d6", "#0f78d6", "#0f8cd6", "#0fa0d6", "#0fb4d6"],
    //   tooltip: {
    //     show: true,
    //     formatter: "{a} : {c} ",
    //   },
    //   legend: {
    //     itemWidth: 10,
    //     itemHeight: 10,
    //     itemGap: 12,
    //     bottom: "3%",
    //     data: data.city,
    //     textStyle: {
    //       color: "rgba(255,255,255,.6)",
    //     },
    //   },
    //   // series: []
    //   series: convertData(data),
    // };

    // // 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);
    // window.addEventListener("resize", function () {
    //   myChart.resize();
    // });
  }

  function echarts_31(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("fb1"));
    option = {
      title: [
        {
          text: "用户年龄分布",
          left: "center",
          textStyle: {
            color: "#fff",
            fontSize: "16",
          },
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        position: function (p) {
          //其中p为当前鼠标的位置
          return [p[0] + 10, p[1] - 10];
        },
      },
      legend: {
        top: "80%",
        itemWidth: 10,
        itemHeight: 10,
        data: ["20岁以下", "20-29岁", "30-39岁", "40-49岁", "50岁以上"],
        data: data.map((item, index) => {
          return item.name;
        }),
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "12",
        },
      },
      series: [
        {
          name: "年龄分布",
          type: "pie",
          center: ["50%", "42%"],
          radius: ["40%", "60%"],
          color: [
            "#065aab",
            "#066eab",
            "#0682ab",
            "#0696ab",
            "#06a0ab",
            "#06b4ab",
            "#06c8ab",
            "#06dcab",
            "#06f0ab",
          ],
          label: { show: false },
          labelLine: { show: false },
          data: [
            { value: 1, name: "20岁以下" },
            { value: 4, name: "20-29岁" },
            { value: 2, name: "30-39岁" },
            { value: 2, name: "40-49岁" },
            { value: 1, name: "50岁以上" },
          ],
          data: data,
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }

  function echarts_33(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("fb3"));
    option = {
      title: [
        {
          text: "用户户籍分布",
          left: "center",
          textStyle: {
            color: "#fff",
            fontSize: "16",
          },
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        position: function (p) {
          //其中p为当前鼠标的位置
          return [p[0] + 10, p[1] - 10];
        },
      },
      legend: {
        top: "80%",
        itemWidth: 10,
        itemHeight: 10,
        data: data.map((item, index) => {
          return item.name;
        }),
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "12",
        },
      },
      series: [
        {
          name: "地区分布",
          type: "pie",
          center: ["50%", "42%"],
          radius: ["40%", "60%"],
          color: [
            "#065aab",
            "#066eab",
            "#0682ab",
            "#0696ab",
            "#06a0ab",
            "#06b4ab",
            "#06c8ab",
            "#06dcab",
            "#06f0ab",
          ],
          label: { show: false },
          labelLine: { show: false },
          data: data,
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }
});
