
jQuery(document).ready(function () {


    var map =  L.mapbox.map('map', 'jdungan.g8c274d0',{ zoomControl: false }).setView([39, -96], 5),
        svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide"),
        legend,counties;
        
        
        
    
    new L.Control.Zoom({ position: 'topright' }).addTo(map);

    d3.json("counties.json", function(collection) {
    //     // Reposition the SVG to cover the features.
        function reset() {
            var topLeft = bounds[0],
                bottomRight = bounds[1];
                
            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");                
            g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
            counties.attr("d", path);
        };
    
        // Use Leaflet to implement a D3 geometric transformation.
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        };
    
        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform),
            bounds = path.bounds(collection);

        counties = g.selectAll("path")
            .data(collection.features,function(d,i) { 
                return d.properties.FIPS; 
            })
                .enter()
                    .append("path")
                    .attr('class', 'county')
                    .attr('id', function(d) {
                        return 'F' + d.properties.FIPS;
                    });
        map.on("viewreset", reset);
        reset();
        });



    
    var LegendControl = L.Control.extend({
        options: {
            position: 'topleft'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            legend_element= L.DomUtil.create('div', 'headlines');
            //identify in the global space
            legend = d3.select(legend_element).attr('class','year');
            return legend_element;
        },
        



    });


    map.addControl(new LegendControl());
    
    legend.addKey = function (k){        
        this.key_data= this.key_data ||['',''];
        this.key_data.shift()
        this.key_data.push(k)
        
        key=this.selectAll('text').data(this.key_data);
        
        // enter
        key.enter()
            .append('text')
            .attr('class','year')
            // .text(String);
        
        // Update
        key.text(String)            
        
    };
             
            var force = d3.layout.force(),
            nodes=[{a:5},{a:4},{a:3}];
            function charge(d) {
                    
                  return d.a * -5600;
            };
            
            
            
            var node = g.selectAll("circle")
                .data(nodes)
                .enter()
                    .append("circle")
                        .attr("class", "node")
                        .attr("r", function(d){return d.a*10})
                                    
            force
                .size ([1000,1000])
                .nodes(nodes)
                .charge(charge)
                .gravity(10)
                .on("tick", function(e) {
                    node
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                })
                .start()
                
                
                
    
    // legend.addKey([' of',' prowess',' bold']);
    
     // loop through the data and display
     
     function play(error,declarations){

         var disaster_array=declarations,
             current_description,
             county_paths=[],
             affected_counties=[],
             intervalID;
         
         function displayDisaster(){


                   
            // d3.select(fips).attr('class','county '+this_dec.TYPE)
             if (affected_counties.length>0){
                 
                legend.addKey(affected_counties[0].DATE)
                legend.addKey(affected_counties[0].DESC)



                 // d3.select(county_paths).clased(d.TYPE);
             }
             
             affected_counties=[];
             county_paths=[];

         };
         
         function newDeclaration(){
             this.index = this.index || 0;
             this_declaration = disaster_array[this.index];
                          
             if (this_declaration){
                 
                 
                 if (this_declaration.CO_FIPS){
                                          
                     // d3.selectAll('path')
                     // .classed(this_declaration.TYPE,function(d,k){
                     //    return d.properties.FIPS===fips;                            
                     // });
                     
                     current_description = current_description || this_declaration.DESC;
                 
                     if(this_declaration.DESC!=current_description){
                         displayDisaster();
                         current_description=this_declaration.DESC;
                     }
                 
                     affected_counties.push(this_declaration)
                     
                     d3.select('#F'+this_declaration.FIPS).attr('class','county '+this_declaration.TYPE)
                     
                     
                     // d3.selectAll('path').attr('class',function(d,key){
                     //     d=d;
                     //     
                     // });
                     
                 }
                 
                 this.index+=1                                

             } else {
                 window.clearInterval(intervalID)
             }
         };
                  
         intervalID=window.setInterval(newDeclaration, 10);
 
     };
      
     // Load declarations
     // ST_FIPS,CO_FIPS,DATE,TYPE,DESC

     queue()
          .defer(d3.csv,'./declarations.csv')
          .await(play);
    
});// end document ready

