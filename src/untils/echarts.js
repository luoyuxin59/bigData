
import $ from 'jquery'
import '../untils/d3.v3.min.js'
import * as echarts from "echarts";

window.d3Obj = {};
window.echartObj = {};

//绘制echart
echartObj.showCharts = function(option, domName, mapStyle) {
	var dom = document.getElementById(domName);
	mapStyle = mapStyle || 'healthCN';
	console.log(dom);
	console.log(option);
	var myChart = echarts.init(dom);
	if (option && typeof option === "object") {
		myChart.clear();
		myChart.setOption(option, true);
		window.addEventListener("resize", function() {
			try {
				myChart.resize();
			} catch (e) {}
		});
	}
}

// 柱状图
export function getColumnarMap(xData, yData){
	xData = xData || []
	yData = yData || []
	var option = {
			tooltip: {
				trigger: "axis",
			},
			xAxis: [
				{
					type: "category",
					boundarGap: false,
					data: xData,
					

					axisLabel: {
						interval: 0,
						formatter: function (value) {
							return value.split("").join("\n");
						},
					},
					axisPointer: {
						type: "shadow",
					},
				},
			],
			yAxis: {
				type: "value",
				axisLabel: {
					formatter: "{value}",
				},
			},
			dataZoom: [
				{
					type: 'slider',
					show: true,
					handleSize: 20, // 滑动条的 左右2个滑动条的大小
					height: 14, // 组件高度
					bottom: 1, // 右边的距离
					handleColor: '#ddd', // h滑动图标的颜色
					startValue: 1,
					endValue: 20, 
					handleStyle: { // 两侧缩放手柄的样式配置。
						borderColor: '#cacaca',
						borderWidth: '1',
						shadowBlur: 2,
						background: '#ddd',
						shadowColor: '#ddd',
					},
					backgroundColor: 'white', // 两边未选中的滑动条区域的颜色
				},
				// 下面这个属性是拖到里面
				{
					type: 'inside',
					show: true,
					start: 1,
					end: 100,
				},
			],
			series: [
				{
					data: yData,
					type: "bar",
					barWidth: 20,
					itemStyle: {
						width: '50px',
						color: "#1068c0",
						normal: {
							label: {
								show: true, //开启显示
								position: 'top',  // 在上方显示
								textStyle: {
									color: '#333',
									fontSize: 10
								}
							}
						}
					},
				},
			],
			// color: ["#fffb19", "#4ab0ee"],
		}
	return option
}

// 热力图
export function getHeatmap(Xdata, Ydata, Vdata, Vcolor, min, max) {
  Xdata = Xdata || [];
  Ydata = Ydata || [];
  Vdata = Vdata || [];
  Vcolor = Vcolor || [ '#69c5ff', '#fff','#de5a6d'];
  min = min || 10
  max = max || 100
  var option = {
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return params.name;
      }
    },
    animation: false,
    grid: {
      left: '1%',
      right: 80,
      top: 20,
      bottom: '45',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: Xdata,
      axisLine: {
        lineStyle: {
          color: '#333',
          width: 1
        }
      },
      axisLabel: {
        interval: 0,
        rotate: -30,
        textStyle: {
          color: '#333',
        }
      },
      splitArea: {
        show: true
      },
      splitLine: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: Ydata,
      splitArea: {
        show: true
      },
      axisLine: {
        lineStyle: {
          color: '#333',
          width: 1
        }
      }
    },
		dataZoom: [
			{
				type: 'slider',
				show: true,
				handleSize: 20, // 滑动条的 左右2个滑动条的大小
				height: 14, // 组件高度
				bottom: 1, // 右边的距离
				handleColor: '#ddd', // h滑动图标的颜色
				startValue: 1,
				endValue: 20, 
				handleStyle: { // 两侧缩放手柄的样式配置。
					borderColor: '#cacaca',
					borderWidth: '1',
					shadowBlur: 2,
					background: '#ddd',
					shadowColor: '#ddd',
				},
				backgroundColor: 'white', // 两边未选中的滑动条区域的颜色
			},
			// 下面这个属性是拖到里面
			{
				type: 'inside',
				show: true,
				start: 1,
				end: 100,
			},
		],
    visualMap: {
      min: min,
      max: max,
      calculable: true,
      orient: 'vertical',
      right: 'right',
      top: '20%',
      inRange: {
        color: Vcolor,
      },
      textStyle: {
        color: '#333',
      }
    },
    series: [{
      name: '',
      type: 'heatmap',
      data: Vdata,
      label: {
        normal: {
          show: true,
          textStyle: {
            color: '#333'
          },
        }
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  return option;
}

// draw(Xdata,Ydata,Vdata) {
// 	console.log(1);
// 	let chart = echarts.init(this.$refs.chart);
// 	// prettier-ignore
// 	let hours = [];
// 		 hours =  Ydata

// 		// prettier-ignore
// 		let days = [];
// 		 days = Xdata

// 		// prettier-ignore
// 		 let data = [];
// 		 data = Vdata.map(function (item) {
// 				return [item[1], item[0], item[2] || '-'];
// 		});

// 	chart.setOption({
// 		tooltip: {
// 			position: "top",
// 		},
// 		grid: {
// 			height: "50%",
// 			top: "10%",
// 		},
// 		xAxis: {
// 			type: "category",
// 			data: hours,
// 			splitArea: {
// 				show: true,
// 			},
// 			 axisLabel :{
// 				interval:0,
// 				formatter: function (value) {
// 						var str = value.split("");
// 						return str.join("\n");
// 				},
// 			}
// 		},
// 		yAxis: {
// 			type: "category",
// 			data: days,
	 
		 
// 			splitArea: {
// 				show: true,
// 			},
// 		},
// 		visualMap: {
// 			min: 50,
// 			max: 100,
// 			calculable: true,
// 			orient: "horizontal",
// 			left: "center",
// 			bottom: "0",
// 		},
// 		series: [
// 			{
// 				name: "avg",
// 				type: "heatmap",
// 				data: data,
// 				//  [[0, 0, "89.72"], [1, 0, '95.44'],[2, 1, '96.30']],
// 				label: {
// 					show: true,
// 				},
// 				emphasis: {
// 					itemStyle: {
// 						shadowBlur: 10,
// 						shadowColor: "rgba(0, 0, 0, 0.5)",
// 					},
// 				},
// 			},
// 		],
// 	});
	

// 	setTimeout(() => {
// 			let imgEchart = new Image();
// 	imgEchart = chart.getDataURL({
// 		type: "png",
// 		pixelRatio: 1,// 倍数
// 		// backgroundColor: '#ccc'// 背景
// 	});
// 	imgEchart = imgEchart.replace(/^data:image\/\w+;base64,/, "")
// 	sessionStorage.setItem('WeightedConversion',imgEchart)
// 	} ,1500)
// },
// let obj = {
//   departmentId: 大单位id,
//   departmentName: 大单位名称,
//   professionalCode: 专业代码,
//   professionalName: 专业名称,
//   enrollmentYear: 入学年份,
//   avg: 平均分,
//   unitId: 小单位id,
//   unitName: 小单位名称,
// }


/** d3数图 **/
// d3Obj.getTree = function(treeData, id) {
// 	// ************** Generate the tree diagram	 *****************
// 	var margin = {
// 			top: 0,
// 			right: 0,
// 			bottom: 0,
// 			left: 80
// 		},
// 		width = $("#" + id).innerWidth(),
// 		height = $("#" + id).innerHeight();

// 	var i = 0;

// 	var tree = d3.layout.tree()
// 		.size([height, width]);

// 	var diagonal = d3.svg.diagonal()
// 		.projection(function(d) {
// 			return [d.y, d.x];
// 		});

// 	var svg = d3.select("#" + id).append("svg")
// 		.attr("width", width)
// 		.attr("height", height)
// 		.append("g")
// 		.attr("transform", "translate(" + margin.left + ",0)");
// 	update(treeData);

// 	function update(source) {

// 		// Compute the new tree layout.
// 		var nodes = tree.nodes(source).reverse(),
// 			links = tree.links(nodes);

// 		// Normalize for fixed-depth.
// 		nodes.forEach(function(d) {
// 			d.y = d.depth * 65;
// 		});

// 		// Declare the nodes
// 		var node = svg.selectAll("g.node")
// 			.data(nodes, function(d) {
// 				return d.id || (d.id = ++i);
// 			});

// 		// Enter the nodes.
// 		var nodeEnter = node.enter().append("g")
// 			.attr("class", "node")
// 			.attr("transform", function(d) {
// 				return "translate(" + d.y + "," + d.x + ")";
// 			});

// 		nodeEnter.append("circle")
// 			.attr("r", 10)
// 			.style("fill", "#fff");

// 		nodeEnter.append("text")
// 			.attr("x", function(d) {
// 				return d.children || d._children ? -13 : 13;
// 			})
// 			.attr("dy", ".35em")
// 			.attr("text-anchor", function(d) {
// 				return d.children || d._children ? "end" : "start";
// 			})
// 			.text(function(d) {
// 				return d.name;
// 			})
// 			.style('fill', '#fff')
// 			.style("fill-opacity", 1);

// 		// Declare the links
// 		var linkEnter = svg.selectAll("path.link").append("g")
// 			.data(links, function(d) {
// 				return d.target.id;
// 			});

// 		linkEnter.enter().insert("path", "g")
// 			.attr("class", "link")
// 			.attr("d", diagonal)
// 			.attr("id", function(d, i) {
// 				return "mypath" + i;
// 			});

// 		linkEnter.enter().append('text')
// 			.attr('x', 20)
// 			.attr('y', 20)
// 			.style('fill', '#ffbc32')
// 			.style('font-size', '12px')
// 			.style('font-weight', '100')
// 			.append('textPath')
// 			.attr({
// 				'xlink:href': function(d, i) {
// 					return "#mypath" + i;
// 				}
// 			})
// 			.text(function(d, i) {
// 				// console.log(d)
// 				return d.source.condition //+ d.target.condition
// 			});
// 	}
// }
/** d3数图 **/
d3Obj.getTree = function(treeData, id) {
	// ************** Generate the tree diagram	 *****************
	var margin = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 80
		},
		width = $("#" + id).innerWidth(),
		height = $("#" + id).innerHeight();

	var i = 0;

	var tree = d3.layout.tree()
		.size([height, width]);

	var diagonal = d3.svg.diagonal()
		.projection(function(d) {
			return [d.y, d.x];
		});

	var svg = d3.select("#" + id).append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + ",0)");
	update(treeData);

	function update(source) {
			
		// Compute the new tree layout.
		var nodes = tree.nodes(source).reverse(),
			links = tree.links(nodes);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
			d.y = d.depth * 115;
		});

		// Declare the nodes
		var node = svg.selectAll("g.node")
			.data(nodes, function(d) {
				return d.id || (d.id = ++i);
			});

		// Enter the nodes.
		var nodeEnter = node.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

		nodeEnter.append("circle")
			.attr("r", 10)
			.style("fill", "#fff");

		nodeEnter.append("text")
			.attr("x", function(d) {
				return d.children || d._children ? -13 : 13;
			})
			.attr("dy", ".35em")
			.attr("text-anchor", function(d) {
				return d.children || d._children ? "end" : "start";
			})
			.text(function(d) {
				return d.name;
			})
			.style('fill', '#000')
			.style("fill-opacity", 1);

		// Declare the links
		var linkEnter = svg.selectAll("path.link").append("g")
			.data(links, function(d) {
				return d.target.id;
			});

		linkEnter.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", diagonal)
			.attr("id", function(d, i) {
				return "mypath" + i;
			});

		linkEnter.enter().append('text')
			.attr('x', 55)
			.attr('y', 35)
			.style('fill', '#000')
			.style('font-size', '12px')
			.style('font-weight', '100')
			.append('textPath')
			.attr({
				'xlink:href': function(d, i) {
					return "#mypath" + i;
				}
			})
			.text(function(d, i) {
				// console.log(d)
				return d.target.condition
				// return d.source.condition //+ d.target.condition
			});
			node.on('click', function(data) {
			})
	}
}


echartObj.getScatter = function(data, legendData, Xname, Yname, symbolIndex, symbolSize) {
	Xname = Xname || 'X名称';
	Yname = Yname || 'Y名称';
	symbolIndex = symbolIndex || 0;
	symbolSize = symbolSize || 3;
	data = data || [
		[
			[34, 77, '第1部门', '第一季度'],
			[43, 37.4, '第2部门', '第一季度'],
			[23, 68, '第3部门', '第一季度'],
			[54, 44.7, '第4部门', '第一季度'],
			[23, -15, '第5部门', '第一季度'],
			[87, 27.1, '第6部门', '第一季度'],
			[67, 65.4, '第7部门', '第一季度'],
			[97, 86.1, '第8部门', '第一季度'],
			[56, -57.7, '第9部门', '第一季度'],
			[35, 35.1, '第10部门', '第一季度'],
			[46, -67.9, '第11部门', '第一季度'],
		],
		[
			[86, 86.8, '第1部门', '第二季度'],
			[56, -41.7, '第2部门', '第二季度'],
			[34, 26.9, '第3部门', '第二季度'],
			[76, 88.5, '第4部门', '第二季度'],
			[24, -20.8, '第5部门', '第二季度'],
			[86, -41.9, '第6部门', '第二季度'],
			[23, -61.1, '第7部门', '第二季度'],
			[46, 82.8, '第8部门', '第二季度'],
			[75, -73.8, '第9部门', '第二季度'],
			[24, 53.5, '第10部门', '第二季度'],
			[86, 29.4, '第11部门', '第二季度'],
		],
	]
	legendData = legendData || ['第一季度', '第二季度']
	var colorList = [
		'#37A2DA',
		'#e06343',
		'#37a354',
		'#b55dba',
		'#b5bd48',
		'#8378EA',
		'#96BFFF'
	]
	var option = {
		grid: {
			left: '75',
			right: '20',
			top: '80',
			bottom: '60',
		},
		tooltip: {
			show: true,
		},
		legend: {
			right: 'center',
			top: 15,
			textStyle: {
				fontSize: 14,
				color: 'rgba(255,255,255,.8)',
			},
			color: colorList,
			data: legendData,
		},
		xAxis: {
			name: Xname,
			nameLocation: 'center',
			nameGap: 30,
			axisLine: {
				lineStyle: {
					color: '#fff',
				},
			},
			splitLine: {
				lineStyle: {
					color: '#fff',
					opacity: 0.2,
				},
			},
			axisLabel: {
				color: '#fff',
			},
			nameTextStyle: {
				color: '#fff',
				fontWeight: "bold",
				fontSize: 14
			},
		},
		yAxis: {
			name: Yname.split('').join("\n"),
			nameLocation: 'center',
			nameRotate: 0,
			nameGap: 35,
			axisLine: {
				lineStyle: {
					color: '#fff',
				},
			},
			splitLine: {
				lineStyle: {
					color: '#fff',
					opacity: 0.2,
				},
			},
			axisLabel: {
				color: '#fff',
			},
			axisTick: {
				show: false,
			},
			nameTextStyle: {
				color: '#fff',
				fontWeight: "bold",
				fontSize: 14
			},
		},
		series: [],
	};
	$.each(data, function(index, element) {
		option.series.push({
			name: legendData[index],
			data: data[index],
			type: 'scatter',
			symbolSize: function(data) {
				var value = data[symbolIndex];
				value = value * value / (100 * symbolSize)
				if (value > (100 / symbolSize)) value = (100 / symbolSize);
				if (value < 4) value = 5;
				return value;
			},
			label: {
				// emphasis: {
				// 	show: true,
				// 	formatter: function(param) {
				// 		return param.data[1] + " : " + param.data[2];
				// 	},
				// 	position: 'top',
				// 	color: '#fff',
				// 	fontSize: '14',
				// },
			},
			itemStyle: {},
		})
	})
	return option;
}
