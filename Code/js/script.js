max_view = 169497306;
min_view = 317752;
var root;
var ov;
var focus;
var color = d3.scaleLinear([min_view, max_view], [' #ff3333', '#330000']);
var font_size = d3.scaleLinear([min_view, max_view], ['1em', '1.4em']);
r_ratio = 2
var topic_list = []
var height = document.documentElement.clientHeight - 140;
$("#videos").css("height", height * 0.4);
$("#lolipop").css("height", height * 0.4);
$("#infos").css("height", height)
$("#infos").css("width", parseInt($("#listDiv").css("width")) * 1.2)
d3.select("body").style("background", "url(image/star1.jpg)");
var lolipops;
var llpp_color = "#ff3300";

var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0.0);

// time
// var dataTimenon=[1972,1983,1984,1990,1991,1994,1998];
var dataTime6 = d3.range(0, 17).map(function(d) {
	return new Date(2001 + d, 10, 2);
});
var dataTime1 = d3.range(0, 1).map(function(d) {
	return new Date(1972 + d, 10, 3);
});
var dataTime2 = d3.range(0, 2).map(function(d) {
	return new Date(1983 + d, 10, 3);
});
var dataTime3 = d3.range(0, 2).map(function(d) {
	return new Date(1990 + d, 10, 3);
});
var dataTime4 = d3.range(0, 1).map(function(d) {
	return new Date(1994 + d, 10, 3);
});
var dataTime5 = d3.range(0, 1).map(function(d) {
	return new Date(1998 + d, 10, 3);
});

var dataTime = dataTime1.concat(dataTime2).concat(dataTime3).concat(dataTime4).concat(dataTime5).concat(dataTime6);

var sliderTime = d3
	.sliderBottom()
	.min(d3.min(dataTime))
	.max(d3.max(dataTime))
	.step(1000 * 60 * 60 * 24 * 365)
	.width(document.documentElement.clientWidth * 0.8)
	.tickFormat(d3.timeFormat('%Y'))
	.tickValues(dataTime)
	.default(new Date(2015, 10, 3))
	.on('onchange', val => {
		if (sliderTime.value().getYear() != 117)
			d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
		else
			d3.select('p#value-time').text("2017(as of Jun. 17th)");
		draw();
		showList();
	});

var gTime = d3
	.select('div#slider-time')
	.append('svg')
	.attr('width', document.documentElement.clientWidth * 0.82)
	.attr("color", "red")
	.attr('height', 70)
	.append('g')
	.style("margin", "-10px -10px")
	.attr('transform', 'translate(10,10)');

gTime.call(sliderTime);
if (sliderTime.value() != "2017")
	d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
else
	d3.select('p#value-time').text("2017(as of Jun. 17th)");

draw();
showList();


function draw() {
	var year = d3.timeFormat('%Y')(sliderTime.value());
	// var year = $("#year_filter").val();
	var width = $("#vis").width();
	var view;
	var zoomIn = false;
	d3.json('data/data1.json').then(function(data) {
		data = data["RECORDS"];
		data_year = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i]["year1"] == year) {
				data_year.push(data[i]);
			}
		}
		drawLoli(data_year);
		d3.select("#vis").selectAll("svg").remove();
		var svg = d3.select("#vis").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
			.style("display", "block")
			.style("margin", "-30px -10px");

		var compute = d3.interpolate('#ff3333', '#330000');
		var scale_height = height / 30;
		var scale_width = width / 4;
		var scale_x = width / 5 - 20;
		var scale_y = -height / 2;
		var rects = svg.selectAll(".myrect")
			.data(d3.range(7))
			.enter().append("g")
			.attr("class", "myrect")
			.attr("transform", function(d) {
				if(d == 0){
				return "translate(" + (scale_x -  2.5 * scale_width / 7)+ ", " + scale_y + ")"
					
				}else if(d == 6){
					
					return "translate(" + (scale_x + scale_width / 7 * d)+ ", " + scale_y + ")"
				}else{
				return "translate(" + (scale_x + scale_width / 7 * d) + ", " + scale_y + ")"
				}
			});
		rects.append("rect")
			.attr("width", function(d){
				var w = scale_width / 7;
				if(d == 0 || d == 6){
					return w * 3.5
				} else{
					return w
				}
			})
			.attr("height", scale_height)
			.style("fill", function(d) {
				if (d > 0 && d < 6) {
					return color((max_view - min_view) * (6 - d) / 5);
				}
				else{
					return "black"
				}
			});
		rects.append("text")
			// 			.attr("y", scale_y)
			// 			.attr("x", function(d) {
			// 				return scale_x ;
			// 			})
			.text(function(d){
				if(d==0){
					return "Views:" +min_view;
				} else if(d == 6){
					return max_view;
				}else{
					return "";
				}
				
			})
			.attr("dy", "1em")
			.style("font-size", "14px")
			.style("fill", function(d) {
				return "#FFFFFF";
			})
			.attr("text-anchor", "left")

		var num, pid;
		root = d3.hierarchy({
				children: data_year
			})
			.sum(function(d) {
				var total = parseInt(d["views"]) + parseInt(d["view_of_topic1"]) * r_ratio;
				return parseInt(total);
			})
			.each(function(d) {
				d.class = d.data.tag_name;
				d.tag_name = d.data.tag_name;
				d.id = d.data.tag_name;
				d.views = parseInt(d.data.views);
				d.view_of_topic1 = parseInt(d.data.view_of_topic1);
				d.topic1 = d.data.related_topic1;
				d.view_of_topic2 = parseInt(d.data.view_of_topic2);
				d.topic2 = d.data.related_topic2;
				d.view_of_topic3 = parseInt(d.data.view_of_topic3);
				d.topic3 = d.data.related_topic3;
				d.distance_x = 0;
				d.distance_y = 0;
				d.distance_x1 = 0;
				d.distance_y1 = 0;
				d.distance_x2 = 0;
				d.distance_y2 = 0;
				d.list = [d.id];
			});
		var pack = d3.pack()
			.size([width, height])
			.padding(10);
		root = pack(root);
		focus = root;
		var node = svg.selectAll(".node")
			.data(root.leaves())
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
		node.append("circle")
			.style("fill", function(d) {
				return "#B0E2FF";
			})
			.attr("stroke", function(d) {
				return "#B0E2FF";
				// #B0E2FF
			})
			.attr("opacity", 0.2)
			.on("click", function(d) {
				if (focus != d) {
					console.log(d)
					zoom(d);
				} else {
					zoom(ov)
				}
			});
		root2 = root;
		var node2 = svg.selectAll(".node2")
			.data(root2.leaves())
			.enter().append("g")
			.attr("class", "node2")

			.text(function(d) {
				return d.class
			})
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node2.append("circle")
			.style("fill", function(d) {
				return color(d.views);
			})
			// .style("opacity", 0.9)
			.attr("stroke", function(d) {
				return "#FF0000";
			})
			// .text(function(d){return "d.tag_name"})

			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			})
			.on("mouseover", function(d) {
				showTooltip("<p><strong> Topic: </strong>" + d.tag_name + "</p><p><strong> Views: </strong>" + d.views + "</p>");
			})
			.on("mouseout", function(d) {
				hideTooltip();
			});;
		node2.append("text")
			.attr("dy", ".35em")
			.style("fill", function(d) {
				return "#FFFFFF";
			})
			.style("font-size", function(d) {
				return font_size(d.views);
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.tag_name;
			})
			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			});




		root3 = root;
		var node3 = svg.selectAll(".node3")
			.data(root3.leaves())
			.enter().append("g")
			.attr("class", "node3")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node3.append("circle")
			.style("fill", function(d) {
				return "none";
			})
			.attr("stroke", function(d) {
				return "#E6E6FA";
			})
			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			});

		root4 = root;
		var home_in;
		var dragging;
		var myText;
		var drag = d3.drag()
			.on('start', function(d) {
				if (zoomIn) {
					d3.event.sourceEvent.stopPropagation();
				}
			})
			.on('drag', function(d) {
				if (zoomIn) {
					dragging = d3.select(this);
					myText = d3.select(this.nextSibling);
					d3.select(this).attr('cx', function(d) {
						d.distance_x += d3.event.dx
						myText.attr("x", function(d) {
							return d.distance_x;
						});
						return d.distance_x;
					});
					d3.select(this).attr('cy', function(d) {
						d.distance_y += d3.event.dy
						myText.attr("y", function(d) {
							return d.distance_y;
						});
						return d.distance_y;
					});
				}
			})
			.on('end', function(d) {
				if (zoomIn) {
					var main_attr = calculate_main_center(dragging, 0);
					var isIn = cal_dis(d3.mouse(this), main_attr);
					if (!isIn) {
						home_in = [0, 0];
						var data_c = dragging._groups[0][0].__data__;
						if (array_contains(data_c.list, data_c.topic1)) {
							rm_from_list(data_c.list, data_c.topic1);
							topic_list = data_c.list;
							showList();
							console.log(data_c.list);
						}
					} else {
						home_in = calcuate_howm_in(dragging, 0);
						var data_c = dragging._groups[0][0].__data__;
						if (!array_contains(data_c.list, data_c.topic1)) {
							data_c.list.push(data_c.topic1);
							topic_list = data_c.list;
							showList()
							console.log(data_c.list);
						}
					}
					var dx = d.distance_x;
					var dy = d.distance_y;
					svg.transition()
						.duration(500)
						.tween("back", function(d) {
							return function(t) {
								dragging.attr('cx', function(d) {
									d.distance_x = dx * (1 - t) + home_in[0] * t;
									myText.attr("x", function(d) {
										return d.distance_x;
									});
									return d.distance_x;
								});
								dragging.attr('cy', function(d) {
									d.distance_y = dy * (1 - t) + home_in[1] * t;
									myText.attr("y", function(d) {
										return d.distance_y;
									});
									return d.distance_y;
								});
							}

						});
				}
			});
		var node4 = svg.selectAll(".node4")
			.data(root4.leaves())
			.enter().append("g")
			.attr("class", "node4")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node4.append("circle")
			.style("fill", function(d) {
				return color(d.view_of_topic1);
			})
			.attr("stroke", function(d) {
				return "#A020F0";
			})
			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			})
			.call(drag)
			.on("mouseover", function(d) {
				showTooltip("<p><strong> Most Related Topic: </strong>" + d.topic1 + "</p><p><strong> Views of talks in both " +
					d.tag_name + " and " + d.topic1 + ": </strong>" + d.view_of_topic1 + "</p>");
			})
			.on("mouseout", function(d) {
				hideTooltip();
			});
		node4.append("text")
			.attr("dy", ".35em")
			.style("fill", function(d) {
				return "#FFFFFF";
			})
			.style("font-size", function(d) {
				return font_size(d.view_of_topic1);
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.topic1;
			})
			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			});
		root4_1 = root;
		var home_in1;
		var dragging1;
		var myText1;
		var drag1 = d3.drag()
			.on('start', function(d) {
				if (zoomIn) {
					d3.event.sourceEvent.stopPropagation();
				}
			})
			.on('drag', function(d) {
				if (zoomIn) {
					dragging1 = d3.select(this);
					myText1 = d3.select(this.nextSibling);
					d3.select(this).attr('cx', function(d) {
						d.distance_x1 += d3.event.dx
						myText1.attr("x", function(d) {
							return d.distance_x1;
						});
						return d.distance_x1;
					});
					d3.select(this).attr('cy', function(d) {
						d.distance_y1 += d3.event.dy
						myText1.attr("y", function(d) {
							return d.distance_y1;
						});
						return d.distance_y1;
					});


				}
			})
			.on('end', function(d) {
				if (zoomIn) {
					var main_attr = calculate_main_center(dragging1, 1);
					var isIn = cal_dis(d3.mouse(this), main_attr);
					if (!isIn) {
						home_in1 = [0, 0];
						var data_c = dragging1._groups[0][0].__data__;
						if (array_contains(data_c.list, data_c.topic2)) {
							rm_from_list(data_c.list, data_c.topic2);
							topic_list = data_c.list;
							showList()
							console.log(data_c.list);
						}
					} else {
						home_in1 = calcuate_howm_in(dragging1, 1);
						var data_c = dragging1._groups[0][0].__data__;
						if (!array_contains(data_c.list, data_c.topic2)) {
							data_c.list.push(data_c.topic2);
							topic_list = data_c.list;
							showList()
							console.log(data_c.list);
						}
					}
					var dx = d.distance_x1;
					var dy = d.distance_y1;
					svg.transition()
						.duration(500)
						.tween("back", function(d) {
							return function(t) {
								dragging1.attr('cx', function(d) {
									d.distance_x1 = dx * (1 - t) + home_in1[0] * t;
									myText1.attr("x", function(d) {
										return d.distance_x1;
									});
									return d.distance_x1;
								});
								dragging1.attr('cy', function(d) {
									d.distance_y1 = dy * (1 - t) + home_in1[1] * t;
									myText1.attr("y", function(d) {
										return d.distance_y1;
									});
									return d.distance_y1;
								});
							}
						});
				}
			});
		var node4_1 = svg.selectAll(".node4_1")
			.data(root4_1.leaves())
			.enter().append("g")
			.attr("class", "node4_1")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node4_1.append("circle")
			.style("fill", function(d) {
				return color(d.view_of_topic2);
			})
			.attr("stroke", function(d) {
				return "#A020F0";
			})
			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			})
			.call(drag1)
			.on("mouseover", function(d) {
				showTooltip("<p><strong> Second Related Topic: </strong>" + d.topic2 + "</p><p><strong> Views of talks in both " +
					d.tag_name + " and " + d.topic2 + ": </strong>" + d.view_of_topic2 + "</p>");
			})
			.on("mouseout", function(d) {
				hideTooltip();
			});
		node4_1.append("text")
			.attr("dy", ".35em")
			.style("fill", function(d) {
				return "#FFFFFF";
			})
			.style("font-size", function(d) {
				return font_size(d.view_of_topic2);
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.topic2;
			})
			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			});
		root4_2 = root;
		var home_in2;
		var dragging2;
		var myText2;
		var drag2 = d3.drag()
			.on('start', function(d) {
				if (zoomIn) {
					d3.event.sourceEvent.stopPropagation();
				}
			})
			.on('drag', function(d) {
				if (zoomIn) {
					dragging2 = d3.select(this);
					myText2 = d3.select(this.nextSibling);
					d3.select(this).attr('cx', function(d) {
						d.distance_x2 += d3.event.dx
						myText2.attr("x", function(d) {
							return d.distance_x2;
						});
						return d.distance_x2;
					});
					d3.select(this).attr('cy', function(d) {
						d.distance_y2 += d3.event.dy
						myText2.attr("y", function(d) {
							return d.distance_y2;
						});
						return d.distance_y2;
					});
				}
			})
			.on('end', function(d) {
				if (zoomIn) {
					var main_attr = calculate_main_center(dragging2, 2);
					var isIn = cal_dis(d3.mouse(this), main_attr);
					if (!isIn) {
						home_in2 = [0, 0];
						var data_c = dragging2._groups[0][0].__data__;
						if (array_contains(data_c.list, data_c.topic3)) {
							rm_from_list(data_c.list, data_c.topic3);
							topic_list = data_c.list;
							showList()
							console.log(data_c.list);
						}
					} else {
						home_in2 = calcuate_howm_in(dragging2, 2);
						var data_c = dragging2._groups[0][0].__data__;
						if (!array_contains(data_c.list, data_c.topic3)) {
							data_c.list.push(data_c.topic3);
							topic_list = data_c.list;
							showList()
							console.log(data_c.list);
						}
					}
					var dx = d.distance_x2;
					var dy = d.distance_y2;
					svg.transition()
						.duration(500)
						.tween("back", function(d) {
							return function(t) {
								dragging2.attr('cx', function(d) {
									d.distance_x2 = dx * (1 - t) + home_in2[0] * t;
									myText2.attr("x", function(d) {
										return d.distance_x2;
									});
									return d.distance_x2;
								});
								dragging2.attr('cy', function(d) {
									d.distance_y2 = dy * (1 - t) + home_in2[1] * t;
									myText2.attr("y", function(d) {
										return d.distance_y2;
									});
									return d.distance_y2;
								});
							}
						});
				}
			});
		var node4_2 = svg.selectAll(".node4_2")
			.data(root4_2.leaves())
			.enter().append("g")
			.attr("class", "node4_2")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node4_2.append("circle")
			.style("fill", function(d) {
				return color(d.view_of_topic3);
			})
			.attr("stroke", function(d) {
				return "#A020F0";
			})
			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			})
			.call(drag2)
			.on("mouseover", function(d) {
				showTooltip("<p><strong> Third Related Topic: </strong>" + d.topic2 + "</p><p><strong> Views of talks in both " +
					d.tag_name + " and " + d.topic3 + ": </strong>" + d.view_of_topic + "</p>");
			})
			.on("mouseout", function(d) {
				hideTooltip();
			});

		node4_2.append("text")
			.attr("dy", ".35em")
			.style("fill", function(d) {
				return "#FFFFFF";
			})
			.style("font-size", function(d) {
				return font_size(d.view_of_topic3);
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.topic3;
			})
			.on("click", function(d) {
				if (focus != d) {
					zoom(d);
				} else {
					zoom(ov)
				}
			});



		ov = {
			x: root.x,
			y: root.y,
			r: height / 2
		}
		zoomTo([ov.x, ov.y, ov.r * 2]);
		topic_list = [];
		showList();
		node4.selectAll("text").style("display", "none");
		node4_1.selectAll("text").style("display", "none");
		node4_2.selectAll("text").style("display", "none");

		function zoomTo(v) {
			var k = height / v[2];
			view = v;
			node.attr("transform", function(d) {
				return "translate(" + ((d.x - v[0]) * k) + ", " + ((d.y - v[1]) * k) + ")"
			});
			node.selectAll("circle").attr("r", function(d) {
				return d.r * k
			});
			node2.attr("transform", function(d) {
				return "translate(" + ((d.x - v[0]) * k) + ", " + ((d.y - v[1]) * k) + ")"
			});
			node2.selectAll("circle").attr("r", function(d) {
				return d.r * d.views / d.value * k
			});
			node3.attr("transform", function(d) {
				return "translate(" + ((d.x - v[0]) * k) + ", " + ((d.y - v[1]) * k) + ")"
			});
			node3.selectAll("circle").attr("r", function(d) {
				return (d.r * (d.views + d.view_of_topic1 * (r_ratio / 2)) / d.value * k)
			});
			node4.attr("transform", function(d) {
				return "translate(" + ((d.x - v[0]) * k) + ", " +
					((d.y - v[1]) * k - (d.r * (d.views + d.view_of_topic1 * (r_ratio / 2)) / d.value * k)) + ")"
			});
			node4.selectAll("circle").attr("r", function(d) {
				return d.r * d.view_of_topic1 * 0.5 / d.value * k;
			});
			node4_1.attr("transform", function(d) {
				var rr = (d.r * (d.views + d.view_of_topic1 * (r_ratio / 2)) / d.value * k);
				return "translate(" + ((d.x - v[0]) * k - rr * Math.cos(Math.PI / 6)) + ", " +
					((d.y - v[1]) * k + rr / 2) + ")"
			});
			node4_1.selectAll("circle").attr("r", function(d) {
				return d.r * d.view_of_topic2 * 0.5 / d.value * k;
			});
			node4_2.attr("transform", function(d) {
				var rr = (d.r * (d.views + d.view_of_topic1 * (r_ratio / 2)) / d.value * k);
				return "translate(" + ((d.x - v[0]) * k + rr * Math.cos(Math.PI / 6)) + ", " +
					((d.y - v[1]) * k + rr / 2) + ")"
			});
			node4_2.selectAll("circle").attr("r", function(d) {
				return d.r * d.view_of_topic3 * 0.5 / d.value * k;
			});
		}

		function zoom(d) {
			var focus0 = focus;

			focus = d;
			if (d.depth != focus0.depth)
				zoomIn = !zoomIn;
			if (zoomIn) {
				topic_list = d.list;
				showList();
				for (var i = 0; i < lolipops.length; i++) {
					var llpp = d3.select(lolipops[i])
					if (llpp.attr("id") != d.tag_name) {

						llpp.style("fill", "black");
					} else {
						llpp.style("fill", "red")
						// llpp.style("transform", "scale(1.2)");
					}



				}

			} else {
				topic_list = [];
				showList();
				node4.selectAll("text").style("display", "none");
				node4_1.selectAll("text").style("display", "none");
				node4_2.selectAll("text").style("display", "none");
				for (var i = 0; i < lolipops.length; i++) {
					var llpp = d3.select(lolipops[i])
					llpp.style("fill", llpp_color);
				}
			}

			svg.transition()
				.duration(1000)
				.tween("zoom", function(d) {
					var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
					return function(t) {
						if (t == 1 && zoomIn) {
							node4.selectAll("text").style("display", "block");
							node4_1.selectAll("text").style("display", "block");
							node4_2.selectAll("text").style("display", "block");
						}
						zoomTo(i(t));
					}
				})
				.tween("keep", function(d) {
					var i = d3.interpolateZoom([focus.x, focus.y, focus.r * 2], view);
					return function(t) {
						keep(i(t));
					}
				});
		}

		function keep(v) {
			var k = height / v[2];
			node4.selectAll("circle")
				.attr("cx", function(d) {
					return d.distance_x / k;
				}).attr("cy", function(d) {
					return d.distance_y / k;
				});
			node4_1.selectAll("circle")
				.attr("cx", function(d) {
					return d.distance_x1 / k;
				}).attr("cy", function(d) {
					return d.distance_y1 / k;
				});
			node4_2.selectAll("circle")
				.attr("cx", function(d) {
					return d.distance_x2 / k;
				}).attr("cy", function(d) {
					return d.distance_y2 / k;
				});
		}

		function calcuate_howm_in(c, n) {
			var data = c._groups[0][0].__data__;
			var r = c.attr("r");
			var bevel = parseFloat(r) + r * 2 * data["view_of_topic1"] / data["view_of_topic" + (n + 1)];
			if (n == 0) {
				return [0, bevel];
			} else if (n == 1) {
				return [bevel * Math.cos(Math.PI / 6), -bevel * Math.sin(Math.PI / 6)];
			} else if (n == 2) {
				return [-bevel * Math.cos(Math.PI / 6), -bevel * Math.sin(Math.PI / 6)];
			}
		}

		function calculate_main_center(c, n) {
			var data = c._groups[0][0].__data__;
			var r = c.attr("r");
			var main_r = r * data["views"] / data["view_of_topic" + (n + 1)] * 2;
			var bevel = main_r + main_r * data["view_of_topic1"] / data["views"];
			if (n == 0) {
				return [0, bevel, main_r];
			} else if (n == 1) {
				return [bevel * Math.cos(Math.PI / 6), -bevel * Math.sin(Math.PI / 6), main_r];
			} else if (n == 2) {
				return [-bevel * Math.cos(Math.PI / 6), -bevel * Math.sin(Math.PI / 6), main_r];
			}
		}

		function cal_dis(m, c) {
			var s1 = (m[0] - c[0]) * (m[0] - c[0]);
			var s2 = (m[1] - c[1]) * (m[1] - c[1]);
			var s = c[2] * c[2];
			if (s1 + s2 <= s)
				return true;
			else
				return false;
		}

		function drawLoli(data_year) {
			var year = d3.timeFormat('%Y')(sliderTime.value());
			d3.json('data/tag_ff.json').then(function(data) {
				data = data["RECORDS"];
				var loli_data = []
				for (var i = 0; i < data_year.length; i++) {
					for (var j = 0; j < data.length; j++) {
						if (data[j]["year1"] == year && data[j]["tag_name"] == data_year[i]["tag_name"])
							loli_data.push(data[j]);
					}
				}
				loli_data.sort(function(a, b) {
					return parseInt(b["amount"]) - parseInt(a["amount"])
				})
				d3.select("#lolipop").selectAll("svg").remove();
				var width = $("#lolipop").width();
				var height_l = height * 0.4;
				var ratio = 0.15
				var svgLoli = d3.select("#lolipop").append("svg")
					.attr("width", width)
					.attr("height", height_l);
				var y = d3.scaleLinear()
					.domain([0, parseInt(loli_data[0]["amount"]) + 10])
					.range([height_l - height * ratio, 22]);
				svgLoli.append("g")
					.attr("transform", "translate(35, 0)")
					.call(d3.axisLeft(y).tickFormat(function(d) {
						return this.parentNode.nextSibling ?
							d :
							d + " Talks";
					}))
					.selectAll("text")
					.style("text-anchor", "middle")
					.style("fill", "white");
				var x = d3.scaleBand()
					.range([0, width - 35])
					.domain(loli_data.map(function(d) {
						return d.tag_name;
					}));
				svgLoli.append("g")
					.attr("transform", "translate(35, " + (height_l - height * ratio) + ")")
					.call(d3.axisBottom(x))
					.selectAll("text")
					.style("text-anchor", "start")
					.style("fill", "white")
					.style("writing-mode", "tb-rl");
				svgLoli.selectAll("myline")
					.data(loli_data)
					.enter()
					.append("line")
					.attr("y1", y(0))
					.attr("y2", y(0))
					.attr("x1", function(d) {
						return x(d.tag_name) + 35 + (width - 35) / loli_data.length / 2;
					})
					.attr("x2", function(d) {
						return x(d.tag_name) + 35 + (width - 35) / loli_data.length / 2;
					})
					.attr("stroke", "white");
				lolipops = svgLoli.selectAll("mycircle")
					.data(loli_data)
					.enter()
					.append("circle")
					.attr("cy", y(0))
					.attr("cx", function(d) {
						return x(d.tag_name) + 35 + (width - 35) / loli_data.length / 2;
					})
					.attr("r", "7")
					.style("fill", llpp_color)
					.attr("stroke", "white")
					.attr("id", function(d) {
						return d.tag_name;
					})
					.on("mouseover", function(d) {
						showTooltip("<p><strong>Topic: </strong>" + d.tag_name + "</p>" +
							"<p><strong>Number of talks: </strong>" + d.amount + "</p>")
					})
					.on("mouseout", function(d) {
						hideTooltip();
					})
					.on("click", function(d) {
						var ns = root.leaves();
						for (var i = 0; i < ns.length; i++) {
							if (ns[i].id == d.tag_name) {
								if (focus != ns[i]) {
									zoom(ns[i]);
								} else {
									zoom(ov)
								}
							}
						}
					});
				lolipops = lolipops._groups[0];
				svgLoli.selectAll("circle")
					.transition()
					.duration(2000)
					.attr("cy", function(d) {
						return y(d.amount);
					});
				svgLoli.selectAll("line")
					.transition()
					.duration(2000)
					.attr("y1", function(d) {
						return y(d.amount);
					})

			});


		}


	})
}


var talks;

function showList() {
	var topics = topic_list;
	// var year = $("#year_filter").val();
	var year = d3.timeFormat('%Y')(sliderTime.value());
	$("#videos").html("");
	d3.csv('data/TED.csv').then(function(data) {
		if (year != "All") {
			data_year = [];
			for (var i = 0; i < data.length; i++) {
				if (data[i]["year_filmed"] == year) {
					data_year.push(data[i]);
				};
			}
			data = data_year;
		}
		talks = [];
		for (var j = 0; j < data.length; j++) {
			var match = true;
			for (var i = 0; i < topics.length; i++) {
				if (data[j]['tags'].indexOf(topics[i].toLowerCase()) == -1)
					match = false;
			}
			if (match)
				talks.push(data[j])
		}
		talks.sort(function(a, b) {
			return parseInt(b['views_as_of_06162017']) - parseInt(a['views_as_of_06162017']);
		})
		var html = "";
		var top10 = "";
		var allList = "";


		for (var k = 0; k < talks.length; k++) {
			if (talks.length > k) {
				allList += "<li class='listTopic' id=\'" + k + "\'><a href=" + talks[k]['URL'] + ">" + talks[k]['headline'] +
					"</a></li>";
			}
		}
		for (var k = 0; k < 10; k++) {
			if (talks.length > k) {
				top10 += "<li class='listTopic'  id=\'" + k + "\'><a href=" + talks[k]['URL'] + ">" + talks[k]['headline'] +
					"</a></li>";
			}
		}
		if ($("#expand").text() == "Show Top 10") {
			html = allList
			$("#videos").html(html);
		} else if ($("#expand").text() == "Show All") {
			html = top10;
			$("#videos").html(html);

		}

		$(".listTopic").on("mouseover mouseout", function(event) {
			theTalk = talks[parseInt($(this).attr("id"))];
			if (event.type == "mouseover") {
				showTooltip_n("<p><Strong>Talker: </Strong>" + theTalk.speaker + "</p>" +
					"<p><Strong>Views: </Strong>" + theTalk.views_as_of_06162017 + "</p>", event);
			} else if (event.type == "mouseout") {
				hideTooltip();
			}
		})

		// $("#videos").html(html);

	});

}


function array_contains(a, t) {
	con = false;
	for (var i = 0; i < a.length; i++) {
		if (a[i].toLowerCase() == t.toLowerCase()) {
			con = true;
		}
	}
	return con;
}

function rm_from_list(a, t) {
	var ind = -1;
	for (var i = 0; i < a.length; i++) {
		if (a[i].toLowerCase() == t.toLowerCase())
			ind = i
	}
	if (ind != -1) {
		for (var j = ind; j < a.length - 1; j++) {
			a[j] = a[j + 1]
		}
		a.pop();
	}
}

$("#expand").click(function() {
	if ($("#expand").text() == "Show All") {
		$("#expand").text("Show Top 10");
		$("#listName").text("Video playlist ");
		showList();
	} else if ($("#expand").text() == "Show Top 10") {
		$("#expand").text("Show All")
		$("#listName").text(" Top 10 video playlist");
		showList();
	}
})

function showTooltip(h) {
	tooltip
		.html(h)
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY + 20) + "px")
		.style("opacity", 1.0);

}

function showTooltip_n(h, event) {
	tooltip
		.html(h)
		.style("left", (event.pageX) + "px")
		.style("top", (event.pageY + 20) + "px")
		.style("opacity", 1.0);

}

function hideTooltip() {
	tooltip
		.style("opacity", 0.0)

}

$("#info").on("click", function() {
	if ($("#infos").css("display") == "none")
		$("#infos").slideDown();
	else {
		$("#infos").slideUp();
	}
})
