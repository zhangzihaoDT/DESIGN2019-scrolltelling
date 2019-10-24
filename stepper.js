// 为方便起见使用d3
var main = d3.select("#container");
var step = main.select("#vis-nav");
var stepper = main.select("#vis-container");
var annotation = stepper.select("#annotation-steps");
var figure = stepper.select("#vis-canvas");

function computeDimensions(selection) {
  var dimensions = null;
  var node = selection.node();
  if (node instanceof SVGElement) {
    // check if node is svg element
    dimensions = node.getBBox();
  } else {
    // else is html element
    dimensions = node.getBoundingClientRect();
  }
  return dimensions;
}
//定义可视化基本元素
//margin convention
var margin = { top: 10, right: 20, bottom: 60, left: 30 },
  width = computeDimensions(figure).width - margin.left - margin.right,
  height = computeDimensions(figure).height - margin.top - margin.bottom;

//create x and y scale. We'll set the domain later
var xScale = d3
  .scaleLinear()
  .range([margin.bottom, width - margin.top - margin.bottom]);
var timeScale = d3
  .scaleTime()
  .range([margin.bottom, width - margin.top - margin.bottom]);

var yScale = d3.scaleLinear().range([height - margin.right, margin.top]);
//create x axis
var xAxis = d3
  .axisBottom()
  .scale(xScale)
  .ticks(8)
  .tickFormat(function(d) {
    return format(d);
  });
//create x axis-time
var xTimeAxis = d3
  .axisBottom()
  .scale(timeScale)
  .ticks(8)
  .tickFormat(function(d) {
    return parseDate(d);
  });

//create y axis
var yAxis = d3
  .axisLeft()
  .scale(yScale)
  .tickFormat(function(d) {
    return format(d);
  });
//d3 functions to format numbers https://github.com/mbostock/d3/wiki/Formatting
var format = d3.format(" ");
var formatComma = d3.format(",");
var parseDate = d3.timeFormat("%I:%M");

//create svg container
var svg = figure
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom),
  g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function switchStep(stepNo) {
  d3.selectAll(".step-link").classed("active", false);
  d3.select("#step" + stepNo).classed("active", true);
}

function switchAnnotation(stepNo) {
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  d3.select("#step" + stepNo + "-annotation")
    .style("display", "block")
    .transition()
    .delay(100)
    .duration(300)
    .style("opacity", 1);
}
function vis(stepNo) {
  figure.select("p").text(stepNo);
  if (stepNo > 1) {
    initAxis(); //先初始化轴
    renderScatter(stepNo - 2); //更新图表
  } else if ((stepNo = 1)) {
    g.selectAll("circle").remove(); //删除图表（保留svg）
    svg.selectAll("g.x.axis").remove(); //删除x轴
    svg.selectAll("g.y.axis").remove(); //删除y轴
  }
}

d3.selectAll("a.step-link").on("click", function(d) {
  var clickedStepNo = d3
    .select(this)
    .attr("id")
    .slice(4);
  console.log(clickedStepNo);
  switchStep(clickedStepNo);
  switchAnnotation(clickedStepNo);
  vis(clickedStepNo);
});
//load data
var url = "data/bubblesBind.csv";
function initAxis() {
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("y", 35)
    .attr("x", width / 2 - margin.left)
    .attr("dy", ".5em")
    .text("Sepal Width");
  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left * 3 + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -55)
    .attr("x", -(height / 2) - margin.top)
    .attr("dx", "1em")
    .text("Sepal Length");
}
function renderScatter(index) {
  d3.csv(url)
    .then(function(data) {
      // data proccessing
      var valExtent = [];
      data.forEach(function(d) {
        d.sepalWidth = +d.level;
        d.sepalLength = +d.volume;
        d.type = +d.rent;
        d.classify = d.cityClassify;
        valExtent = d3.extent([valExtent[0], valExtent[1], d.level, d.volume]);
      });
      var nestData = d3
        .nest()
        .key(function(d) {
          return d.type;
        })
        .entries(data);
      return nestData;
    })
    .then(function(nestData) {
      console.log(nestData);
      // get the data from index parameter
      var data = nestData[index].values;
      console.log(data);
      //set scales domain(统一的比例尺)
      xScale.domain(
        d3.extent(data, function(d) {
          return d.sepalWidth;
        })
      );

      yScale.domain(
        d3.extent(data, function(d) {
          return d.sepalLength;
        })
      );

      // DATA JOIN
      var circles = g.selectAll("circle").data(data);

      //ENTER
      circles
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) {
          return xScale(d.sepalWidth);
        })
        .attr("cy", height)
        .attr("r", 4)
        .attr("fill", "white")
        .transition()
        .delay(function(d, i) {
          return i * 2;
        })
        .duration(1000)
        .attr("cx", function(d) {
          return xScale(d.sepalWidth);
        })
        .attr("cy", function(d) {
          return yScale(d.sepalLength);
        })
        .attr("r", 8)
        .attr("opacity", "1.0")
        .attr("class", function(d) {
          return d.classify;
        });

      //UPDATE
      //update position to make the animation
      circles
        .sort(function(a, b) {
          return d3.ascending(+a.sepalWidth, +b.sepalWidth);
        })
        .transition()
        .delay(function(d, i) {
          return i * 2;
        })
        .duration(1000)
        .attr("cx", function(d) {
          return xScale(d.sepalWidth);
        })
        .attr("cy", function(d) {
          return yScale(d.sepalLength);
        })
        .attr("r", 8)
        .attr("opacity", "1.0")
        .attr("class", function(d) {
          return d.classify;
        });
      // EXIT
      circles.exit().remove();

      /// Update X Axis
      svg
        .selectAll("g.x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);

      // Update Y Axis
      svg
        .selectAll("g.y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);
    });
}
