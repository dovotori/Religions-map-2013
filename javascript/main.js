

var width, height;
window.addEventListener("load", setup, false);




function setup()
{
	
	var projection = d3.geo
		//.azimuthalEqualArea();
		.mercator();
		//.conicEquidistant();
		//.orthographic();
	
	var path = d3.geo.path().projection(projection);
	
	var graticule = d3.geo.graticule();
	
	var svg = d3.select("#svgCarte");
	
	svg.append("defs").append("path")
		.datum({type: "Sphere"})
		.attr("id", "sphere")
		.attr("d", path);
	
	
	var dessinGraticule = svg.append("path")
		.datum(graticule)
		.attr("class", "graticule")
		.attr("d", path);
	
	var carte = svg.append("svg:g").attr("id", "carte");
	var capitalePoint = carte.append("rect").attr("class", "capitalePoint");
	var capitaleTexte = carte.append("rect").attr("class", "capitaleTexte");
	var categories;
	var coordonneesCapitale;
	var pictoMortLegende;
	
	// INTERACTION
	var paysClique, oldPaysCliqueId;
	var legendeClique = false;
	var isZoomed = false;
	
	
	var paysTrouve = false;
	var paysPenaliseParMort = [];
	var pictosMortCarte = [];
 	var forme = "M24.869 -17.798 L17.798 -24.869 L0 -7.071 L-17.797 -24.869 L-24.869 -17.798 L-7.071 0 L-24.869 17.798 L-17.798 24.869 L0 7.071 L17.798 24.869 L24.869 17.798 L7.071 0Z";




	function lireCsv(url, callback) {
		d3.csv(url, function(d){ callback(null, d); });
	}
	function lireJson(url, callback) {
		d3.json(url, function(d){ callback(null, d); });
	}


	queue()
		.defer(lireJson, "data/world-countries.json")
		.defer(lireCsv, "data/liste.csv")
		.awaitAll(ready);
	

	function ready(error, results) {

		traiterInfosBlaspheme(results[0]);
		dessinerCarte(results[1], results[2]);
		dessinerLegende();			
		lireHashDemarrage();
		resize();

	}




	function ready(error, results) 
	{

		dessinerCarte(results[0]);
		initPictos(results[1]);
		resize();

	}


	

	function dessinerCarte(collection)
	{

		// CARTE
		carte.selectAll("path")
			.data(collection.features)
			.enter().append("svg:path")
			.attr("d", path)
			.attr("id", function(d){ return d.id; });
		
	}




	function initPictos(collection)
	{
		infosPictos = collection;

		var forme = "M24.869 -17.798 L17.798 -24.869 L0 -7.071 L-17.797 -24.869 L-24.869 -17.798 L-7.071 0 L-24.869 17.798 L-17.798 24.869 L0 7.071 L17.798 24.869 L24.869 17.798 L7.071 0Z";
		//var forme = "";


		for(var i = 0; i < nbPictos; i++)
		{
			pictos[i].append("svg:path")
				.attr("d", forme)
				.attr("id", infosPictos[i].name)
				.attr("class", "picto")
				.style("stroke", "#000000")
				.style("stroke-width", "2")
				.style("fill", "#ffffff");

			

		}


	}
	
	
	function outLegende(d)
	{

		var btn1 = d3.select("#btn1"+d.id);
		var text = d3.select("#text"+d.id);
		btn1[0][0].style.fill = "#fff";
		text[0][0].style.fill = "#555";
		
	}
	





	
	
	function clicPicto(event)
	{ 	
		var target = event.target.id;
		//console.log(target);
		d3.selectAll(".picto").style("fill", "#fff");
		d3.select("#"+event.target.id).style("fill", "red");


		focusArticle = "art"+target;
		
		$("#art"+target).fadeTo( "slow", 1, function(){ $(this).css("display", "block"); } );


	}	
	


	
	d3.select(window).on('resize', resize);	




	function resize() 
	{
	
	    width = window.innerWidth; 
		height = window.innerHeight;

	    // update projection
	    projection
	        .translate([width / 2, height / 2])
	        .scale(width / 7);
	
		svg
			.attr("width", width)
			.attr("height", height);
		
	    carte
	        .style('width', width)
	        .style('height', height);
	        	
	    carte.selectAll("path").attr('d', path);

	    afficherPictos();

	}



	function afficherPictos()
	{
		
		for(var i = 0; i < nbPictos; i++)
		{

			//var position = projection([ Math.round(getRandom(0, 20)), Math.round(getRandom(0, 20)) ]);
			var position = projection([ infosPictos[i].long , infosPictos[i].lat ]);
			pictos[i]
				.attr("transform", "translate("+position[0]+", "+position[1]+") scale(0.4)");
		
		}

	}



	document.body.addEventListener("click", function(event){ onClick(event); }, false);



	function onClick(event)
	{
		if(event.target.className.baseVal == "picto")
		{
			clicPicto(event);
		} else {
			reset();
		}
	}



	function reset()
	{

		d3.selectAll(".picto").style("fill", "#fff");
		$("#"+focusArticle).fadeTo( "slow", 0, function(){ $(this).css("display", "none"); } );

	}

	
	


	
	function afficherPictosMortCarte()
	{
		// supprime pour eviter doublons
		pictosMortCarte.forEach(function(pic){
			pic.remove();
		});

		paysPenaliseParMort.forEach(function(d, i)
		{
			var centroid = path.centroid(d);
			pictosMortCarte[i] = carte.append("svg:g")
				.attr("transform", "translate("+centroid[0]+", "+centroid[1]+") scale("+width/10000+")")
				.append("svg:path")
				.attr("d", forme)
				.style("stroke","#000000")
				.style("stroke-width","2")
				.style("fill","#ffffff");			
		});

	}
	
	
	




	









	
	
	
	
	
	
	
	////////////////////////////
	//// RESIZE ///////////////
	//////////////////////////
	
	d3.select(window).on('resize', resize);
	
	function resize() {
	
	    width = window.innerWidth; 
		height = window.innerHeight;

	    // update projection
	    projection
	        .translate([width / 2, height / 2])
	        .scale(width / 7);
	
		svg
			.attr("width", width)
			.attr("height", height);
		
	    carte
	        .style('width', width)
	        .style('height', height);
	        
		
	    dessinGraticule.attr('d', path);
	    carte.selectAll("path").attr('d', path);
	    
		afficherPictosMortCarte();

		var largeurSVG = document.getElementById("svgCarte").getAttribute("width");
		var largeurLegende = document.getElementById("legende").getBBox().width;

		// placement de la legende
		var scale_max = 1.2;
		var scale_min = 0.5;
		var scale = largeurSVG*0.001;
		scale = Math.min(scale, scale_max);
		scale = Math.max(scale, scale_min);
		var hauteurSVG = document.getElementById("svgCarte").getAttribute("height");
		var hauteurLegende = document.getElementById("legende").getBBox().height;
		var bonneHauteur = hauteurSVG - (hauteurLegende*scale+100);
		d3.select("#legende").attr("transform", "translate(0, "+bonneHauteur+")scale("+scale+")");

		// placement infos
		scale = largeurSVG*0.0005;
		scale_max = 1.2;
		scale_min = 0.6;
		scale = Math.min(scale, scale_max);
		scale = Math.max(scale, scale_min);
		var bonneHauteur = Math.floor(hauteurSVG / 2) - (infosHauteur/2);
		d3.select("#infos").attr("transform", "translate("+Math.floor((width/2)+(width/10))+", "+bonneHauteur+")scale("+scale+")");
		

		
		
		if(isZoomed)
		{
							
			// posX = width*0.01*68;
			// posY = height*0.01*60;
   			// donut.selectAll("path").attr("d", arc).attr("transform", "translate("+posX+", "+posY+")");
			
			var traductionCoor = projection(coordonneesCapitale);
			var x = traductionCoor[0];
			var y = traductionCoor[1];
			capitalePoint.attr("x", x).attr("y", y);
			capitaleTexte.attr("x", x+6).attr("y", y+4);
	
		}
	}






}


