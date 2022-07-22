
import $ from 'jquery'
import '../untils/d3.v3.min.js'
window.d3Obj = {};
window.echartObj = {};

//绘制echart
echartObj.showCharts = function(option, domName, mapStyle) {
	var dom = document.getElementById(domName);
	mapStyle = mapStyle || 'healthCN';
	var myChart = echarts.init(dom, mapStyle);
	if (option && typeof option === "object") {
		myChart.clear();
		myChart.setOption(option, true);
		window.addEventListener("resize", function() {
			try {
				myChart.resize();
			} catch (e) {}
		});
	}
	return myChart;
}


// 热力图
export function getHeatmap(Xdata, Ydata, Vdata, Vcolor, min, max) {
  Xdata = Xdata || [];
  Ydata = Ydata || [];
  Vdata = Vdata || [];
  Vcolor = Vcolor || [ '#69c5ff', '#fff','#de5a6d'];
  min = min || 0
  max = min || 5
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
console.log(width +'--' +height);

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
			d.y = d.depth * 75;
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
			.attr("dy", "5px")
			.attr("text-anchor", function(d) {
				return d.children || d._children ? "end" : "start";
			})
			.text(function(d) {
				return d.name;
			})
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
			.attr('x', 35)
			.attr('y', 20)
			.style('fill', 'green')
			.style('font-size', '10px')
			.style('font-weight', 'bold')
			.append('textPath')
			.attr({
				'xlink:href': function(d, i) {
					return "#mypath" + i;
				}
			})
			.text(function(d, i) {
				// console.log(d)
				return d.source.condition //+ d.target.condition
      });
	}
}
d3Obj.getTree1 = function(data, id) {
          //定义边界
            var margin = { top: 90, bottom: 0, left: 10, right: 0 };

            var width=960;
            var height=600;
            var svg = d3.select("#" + id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + ",0)");

            var g = svg
              .append("g")
              .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

            var scale = svg
              .append("g")
              .attr("transform", "translate(" + margin.top + "," + margin.left + ")");
            // 创建一个层级布局
              var hierarchyData = d3.hierarchy(data).sum(function(d) {
                return d.value;
              });
              console.log(hierarchyData);

      // 创建一个树状图
        var tree = d3
          .tree()
          .size([width - 400, height - 200])
          .separation(function(a, b) {
            return (a.parent == b.parent ? 1 : 2) / a.depth;
          });
        var treeData = tree(hierarchyData);
        var nodes = treeData.descendants();
        var links = treeData.links();
        var generator = d3
          .linkHorizontal()
          .x(function(d) {
            return d.y;
          })
          .y(function(d) {
            return d.x;
          });
        g.append("g")
          .selectAll("path")
          .data(links)
          .enter()
          .append("path")
          .attr("d", function(d) {
            var start = { x: d.source.x, y: d.source.y };
            var end = { x: d.target.x, y: d.target.y };
            return generator({ source: start, target: end });
          })
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-width", 1);
        var gs = g
          .append("g")
          .selectAll("g")
          .data(nodes)
          .enter()
          .append("g")
          .attr("transform", function(d) {
            var cx = d.x;
            var cy = d.y;
            return "translate(" + cy + "," + cx + ")";
          });
      //绘制节点
        gs.append("circle")
          .attr("r", 6)
          .attr("fill", "white")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .on("mouseover", function(d) {   //交互
            d3.select(this)
              .attr("stroke", "skyblue")
              .attr("stroke-width", 2)
          })
          .on("mouseout",function(){
            d3.select(this)
              .attr("stroke", "#000")
              .attr("stroke-width", 1)
          })

        //绘制文字
        gs.append("text")
          .attr("x", function(d) {
            return d.children ? -90 : 10;
          })
          .attr("y", -5)
          .attr("dy", 10)
          .text(function(d) {
            return d.data.condition;
          })
          .on("mouseover", function(d) {    //交互
            d3.select(this)
              .attr("fill", "red")
          })
          .on("mouseout",function(){
            d3.select(this)
              .attr("fill", "#000")
          })
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
