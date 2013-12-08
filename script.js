
jQuery(document).ready(function () {

    var map = L.mapbox.map('map', 'jdungan.g8c274d0', {zoomControl: false}).setView([39, -96], 5),
        svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide"),
        legend, counties, legend_element;

    function draw_counties(callback) {
        d3.json("counties.json", function(collection) {

            // 250-718-7290
            // Reposition the SVG to cover the features.
            function reset() {
                var topLeft = bounds[0],
                    bottomRight = bounds[1];

                svg.attr("width", bottomRight[0] - topLeft[0])
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

            var transform = d3.geo.transform({
                point: projectPoint
            }),
                path = d3.geo.path().projection(transform),
                bounds = path.bounds(collection);

            counties = g.selectAll("path")
                .data(collection.features, function(d, i) {
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
            callback()
        
        });
    }

    function display_disasters(error,counties,years){

        new L.Control.Zoom({ position: 'topright' }).addTo(map);

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

         var minYear = _.min(years,function(item){return item.year;});    
         var maxYear = _.max(years,function(item){return item.year;});    

         var margin = {top: 50, right: 100, bottom: 20, left: 30},
             width = 1000 - margin.left - margin.right,
             height = 500 - margin.top - margin.bottom;

         var x = d3.time.scale()
          .domain([new Date(minYear.year), new Date(maxYear.year)])
          .nice(d3.time.year)
          .rangeRound([0,width]);

         var scale_svg = d3.select(legend_element).append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

         scale_svg.append('circle')
             .attr('r',30)
             .attr('cy',10)
             .attr('class','date_viewer')
             .attr('cx',function(d){return x(new Date(minYear.year));});
     
         var scale = scale_svg.append("g")
          .attr("class", "x axis")
          .call(d3.svg.axis().scale(x).orient("bottom"));
           
         var date_viewer= d3.select('.date_viewer')
         //set the intial (do nothing) transistion
         var date_move = date_viewer.transition()
          
         _.each(years, function(year){
             //  add a new transition to the chain
             date_move = date_move.transition()
                 .duration(3000)
                 .attr('cx',function(d){return x(new Date(year.year));})
                 .each('start',function(){
                     disasters=year.disasters;
                     _.each(disasters,function(disaster){
                         _.each(disaster.counties,function(county){
                 
                             if (county.fips_co){
                                 
                                 disaster_paths = d3.select('#F' + county.fips_co)
                                 
                             } else {
                                 disaster_paths = d3.selectAll('[id^=F' + county.fips_st +']')   
                             }
                     
                                 // legend.addKey(affected_counties[0].DATE)
                                 // legend.addKey(affected_counties[0].DESC)
                             
                             disaster_paths    
                                .transition()
                                .duration(1450)
                                .attr('class','county '+disaster.style)
                                .style('fill-opacity', 0.60)
                                .transition()
                                .duration(1450)
                                .style('fill-opacity', 0)
                                .transition()
                                .attr('class', 'county')

                         })//end county loop

                     });// end disaster lopp
                     
                 })// end each function
             
         });// end year loop

     };//end display_disasters
     
    queue()
        .defer(draw_counties)
        .defer(d3.json,'./disasters.array')
        .await(display_disasters);
    
});// end document ready

