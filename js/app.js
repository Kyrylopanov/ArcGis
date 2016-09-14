require([
            "esri/map",
            "esri/dijit/Search",
            "esri/dijit/HomeButton",
            "esri/dijit/LocateButton",
            "esri/dijit/BasemapToggle",
            "esri/geometry/Extent",
            "esri/graphic",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/geometry/screenUtils",
            "dojo/dom",
            "dojo/dom-construct",
            "dojo/query",
            "dojo/_base/Color",
            "dojo/domReady!"
      ], function (Map, Search, HomeButton, LocateButton, BasemapToggle, Extent, Graphic, SimpleMarkerSymbol, screenUtils, dom, domConstruct, query, Color) {
    
        // Create a map and instance of the search widget here
        var map = new Map("map", {
            basemap: "topo", 
            center: [25.30441, 54.70724], 
            zoom: 12        
        });
        // Add variables for ID
        var search = new Search({
            map: map,
        }, dom.byId("search"));
        var home = new HomeButton({
            map: map
        }, "HomeButton");
        var geoLocate = new LocateButton({
            map: map,
            highlightLocation: false
        }, "LocateButton");
        var toggle = new BasemapToggle({
            map: map,
            basemap: "satellite"
        }, "BasemapToggle");
    
        home.startup();
        search.startup(); 
        geoLocate.startup();
        toggle.startup();
        
        map.on("load", enableSpotlight);
        search.on("select-result", showLocation); 
        search.on("clear-search", removeSpotlight);
    
        // Function for show location 
        function showLocation(e) {
           map.graphics.clear();
           var point = e.result.feature.geometry;
           var symbol = new SimpleMarkerSymbol().setStyle(
           SimpleMarkerSymbol.STYLE_SQUARE).setColor(
             new Color([255, 0, 0, 0.5])
           );
           var graphic = new Graphic(point, symbol);
           map.graphics.add(graphic);

           map.infoWindow.setTitle("Search Result");
           map.infoWindow.setContent(e.result.name);
           map.infoWindow.show(e.result.feature.geometry);
           
        // Function Spotlight effect when showLocation was called
           var spotlight = map.on("extent-change", function () {
              var geom = screenUtils.toScreenGeometry(map.extent,  map.width, map.height, e.result.extent);
              var width = geom.xmax - geom.xmin;
              var height = geom.ymin - geom.ymax;

              var max = height;
              if (width > height) {
                 max = width;
              }
        
              var margin = '-' + Math.floor(max / 2) + 'px 0 0 -' + Math.floor(max / 2) + 'px';

              query(".spotlight").addClass("spotlight-active").style({
                 width: max + "px",
                 height: max + "px",
                 margin: margin
              });
              spotlight.remove();
            });
         }
        
        // Function show spotlight
        function enableSpotlight() {
          var html = "<div id='spotlight' class='spotlight'></div>"
          domConstruct.place(html, dom.byId("map_container"), "first");
        };
        // Function hide spotlight
        function removeSpotlight() {
          query(".spotlight").removeClass("spotlight-active");
          map.infoWindow.hide();
          map.graphics.clear();
        };    
            
        });


$(document).ready(function() {
    
    var city = $("#select-city").val();
        
    //Select City click and type City to input it 
    $('#select-city').change(function(){ 
        $('input#search_input.searchInput').val($('#select-city').val());
    });

        

});