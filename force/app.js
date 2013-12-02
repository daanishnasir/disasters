// 
// {
//     "DSTR_NR": "1",
//     "DSTR_SMRY": "TORNADO",
//     "INCIDENT_TYPE_CD": "Tornado",
//     "DCLN_INCIDENT_BGN_DT": "5/2/1953 0:00",
//     "DCLN_INCIDENT_END_DT": "5/2/1953 0:00",
//     "DSTR_CLOSURE_DT": "6/1/1954 0:00",
//     "programs": "0000",
//     "style": "Tornado",
//     "AREAS": [
//         {
//             "ST_CD": "GA",
//             "county": "",
//             "fips_st": "13",
//             "fips_co": ""
//         }
//     ]
// },

var w = 1500,
    h = 1500;


var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

var force = d3.layout.force();

//  FIPS,ST_FIPS,CO_FIPS,DATE,TYPE,DESC
d3.json('./disasters.array',function(e,disaster_array){
    
    disasters = disaster_array//.slice(1000,1200);
    
    
    function charge(d) {
        return -d.forceR*10
        // return -Date.parse(Date(d.DCLN_INCIDENT_BGN_DT))/1000000000;
    };
    // inspired by http://vallandingham.me/building_a_bubble_cloud.html    

    collisionPadding=5;
    collide = function(jitter){
        // # return a function that modifies
        // # the x and y of a node
        return function(d){
            nodes.forEach(function(d2){
              // # check that we aren't comparing a node
              // # with itself
              if (d != d2){
                  // # use distance formula to find distance
                  // # between two nodes
                  x = d.x - d2.x
                  y = d.y - d2.y
                  distance = Math.sqrt(x * x + y * y)
                  // # find current minimum space between two nodes
                  // # using the forceR that was set to match the 
                  // # visible radius of the nodes
                  minDistance = d.forceR + d2.forceR + collisionPadding;

                  // # if the current distance is less then the minimum
                  // # allowed then we need to push both nodes away from one another
                  if (distance < minDistance){              
                    // # scale the distance based on the jitter variable
                    how_close = distance-minDistance

                    distance = (distance - minDistance) / distance * jitter;

                    // # move our two nodes
                    moveX = x * distance;
                    moveY = y * distance;
                    
                    // move the larger circle
                    if (d.forceR >= d2.forceR) {
                        d.x -= moveX;
                        d.y -= moveY;
                    } else{
                        d2.x += moveX;
                        d2.y += moveY;
                    }
                }
                }
              })   
        }
        
        
    }

    force.on("tick", function(e) {
    // //       // dampenedAlpha = e.alpha * 0.1    
    // //       // # Most of the work is done by the gravity and collide
    // //       // # functions.

    // move it 
        node
            .attr("cx", function(d) { return d.y; })
            .attr("cy", function(d) { return d.x; });

    // check for collisions  
          
        node.each(collide(1))
    });

    
    var tooltip = d3.select("body")
    	.append("div")
        .attr('id','tooltip')
    	.style("position", "absolute")
    	.style("z-index", "10")
    	.style("visibility", "hidden");
        
    tooltip.content = function (d){
        this.html('')
            // .append('p').text(d.year)
            // .append('p').text(d.disasters.length)
        
            .append('p').text(d.DCLN_INCIDENT_BGN_DT)
            .append('p').text(d.DSTR_SMRY)    
    }

    nodes = _.map(disaster_array,function(disaster_year){
        return disaster_year.disasters;
    });
    
    nodes = _.flatten(nodes)//.slice(500,1000);


    force
        .nodes(nodes)
        .gravity(1.5)
        .size([h,w])
        .charge(charge)

    var node = svg.selectAll("circle")
        .data(nodes)
        .enter()
            .append("circle")
            .attr("class", function(d){return d.style})
            .attr('cx',w/2)
            .attr('cy',h/2)
            .attr("r", function(d){
                var area_count = d.AREAS.length;
                
                // var area_count = _.reduce(d.disasters,function(memo,disaster){
                //     return memo + disaster.AREAS.length;
                // },0);

                var r = d.forceR = Math.sqrt(area_count/Math.PI)*2.5
            
                return r
            })
            .on("mouseover", function(d){return tooltip.style("visibility", "visible").content(d);})
            .on("mousemove", function() {return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout",  function() {return tooltip.style("visibility", "hidden");});
                
    force.start()


    });

        




