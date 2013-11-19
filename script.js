
jQuery(document).ready(function () {

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    };

    var map =  L.mapbox.map('map', 'jdungan.g8c274d0').setView([39, -96], 5),
        svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    d3.json("counties.json", function(collection) {
        // Reposition the SVG to cover the features.
        function reset() {
            var topLeft = bounds[0],
                bottomRight = bounds[1];
            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");                
            g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);
        };

        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform),
            bounds = path.bounds(collection);

        var feature = g.selectAll("path")
            .data(collection.features)
            .enter()
            .append("path")
            .attr('id',function(d){return 'F'+d.properties.FIPS;})
            .attr('class','county');

        map.on("viewreset", reset);
    
        reset();
    });
      // Load declarations
      // ST_FIPS,CO_FIPS,DATE,TYPE,DESC
     var disaster_count=0;

     // draw the timeline control
     
     // d3.select('div#timeline').append().append("svg")
     //     .attr("width", 200)
     //     .attr("height", 200).append("circle")
     //     .attr("cx", 30)
     //     .attr("cy", 30)
     //     .attr("r", 20);
     
     // loop through the data and display
     function play(error,declarations){

         var disaster_array=declarations,
             intervalID;
         
         function addDisaster(){
             this.index = this.index || 0
        
             // console.log(this.index);
             this_dec = disaster_array[this.index]
             
             if (this_dec){
                 var fips='#F'+this_dec.ST_FIPS+this_dec.CO_FIPS
                 if (fips.length>=5){
                     d3.select(fips).attr('class','county '+this_dec.TYPE)
                 }  
                 this.index+=1               
             } else {
                 window.clearInterval(intervalID)
             }
         };
                  
         intervalID=window.setInterval(addDisaster, 1);
 
     };
      
     queue()
          .defer(d3.csv,'./declarations.csv')
          .await(play);
    
});// end document ready

