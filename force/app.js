

var w = 800,
    h = 800;


var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

var force = d3.layout.force();

//  FIPS,ST_FIPS,CO_FIPS,DATE,TYPE,DESC
d3.csv('./declarations.csv',function(e,declarations){
    decs = declarations.slice(0,1000)
    
    function charge(d) {
        // return -100
        return -Date.parse(Date(d.DATE))/1000000000;
    };
    
    force
        .nodes(decs)
        .gravity(10)
        .size([h,w])
        .charge(charge)
        .on("tick", function(e) {
            // var node = node;
            // window.setTimeout(function(){
                node
                    .attr("cx", function(d) { return d.y; })
                    .attr("cy", function(d) { return d.x; });
            // },10);
        })

        var node = svg.selectAll("circle")
            .data(decs)
            .enter()
                .append("circle")
                .attr("class", function(d){return d.TYPE})
                .attr("r", function(d){return +d.ST_FIPS/10});

        force.start()


    });

        




