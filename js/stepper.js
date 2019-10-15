// 为方便起见使用d3
var main = d3.select("#container");
var step = main.select("#vis-nav");
var stepper = main.select("#vis-container");
var annotation = stepper.select("#annotation-steps");
var figure = stepper.select("#vis-canvas");

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
  return false;
});
