
window.addEventListener("load", setup, false);



function setup()
{

	var width, height;
	
	var projection = d3.geo
		//.azimuthalEqualArea();
		.mercator();
		//.conicEquidistant();
		//.orthographic();
	
	var path = d3.geo.path().projection(projection);
	
	var graticule = d3.geo.graticule();
	
	var svg = d3.select("#svg");
	
	svg.append("defs").append("path")
		.datum({type: "Sphere"})
		.attr("id", "sphere")
		.attr("d", path);
	
	svg.append("use")
		.attr("class", "stroke")
		.attr("xlink:href", "#sphere");
	
	svg.append("use")
		.attr("class", "fill")
		.attr("xlink:href", "#sphere");
	
	var dessinGraticule = svg.append("path")
		.datum(graticule)
		.attr("class", "graticule")
		.attr("d", path);
	
	
	
	
	
	
	var infosPays = [];
	var carte = svg.append("svg:g").attr("id", "carte");
	var capitalePoint = carte.append("rect").attr("class", "capitalePoint");
	var capitaleTexte = carte.append("rect").attr("class", "capitaleTexte");
	var pictoPath;
	var categories;
	var coordonneesCapitale;
	var pictoMortLegende = svg.append("svg:path")
				.style("stroke-width", "0.04%")
				.style("stroke", "#fff");
	
	// INTERACTION
	var paysClique, oldPaysCliqueId;
	var isZoomed = false;
	var infos = svg.append("svg:g").attr("id", "infos");
	var infosFond = infos.append("svg:rect").attr("id", "infosFond").attr("width", "0%").attr("height", "0%");
	var infosTitre = [2];
	infosTitre[0] = infos.append("svg:text").attr("class", "infosTitre");
	infosTitre[1] = infos.append("svg:text").attr("class", "infosTitre infosTitreCat");
	
	var nbCat = 9;
	var infosTexte = [nbCat];
	for(var i = 0; i < nbCat; i++){
		infosTexte[i] = infos.append("svg:text").attr("class", "infosTexte");
	}
	var infosValeurs = [3]; infosValeurs[0] = []; infosValeurs[1] = []; infosValeurs[2] = [];
	var cow = ""; var isInformed;
	var pie = d3.layout.pie().sort(null).value(function(d) { return d; });    
	var arc = d3.svg.arc();
	var donut = infos.selectAll(".arc");
	var legendeReligionsCarres = [nbCat];
	var legendeReligionsTextes = [nbCat];
	for(var i = 0; i < nbCat; i++)
	{
		legendeReligionsCarres[i] = infos.append("svg:rect");
		legendeReligionsTextes[i] = infos.append("svg:text");
	}
	
	var paysPenaliseParMort = [];	
			
	
	



	var lireCsv = function(url, callback) {
		d3.csv(url, function(d){ callback(null, d); });
	}
	var lireJson = function(url, callback) {
		d3.json(url, function(d){ callback(null, d); });
	}

	var ready = function(error, results) {
		traiterInfosBlaspheme(results[0]);
		pictoPath = results[1][0].path;
		dessinerCarte(results[2]);
		dessinerLegende();		
		
		var hash = window.location.hash;	
		if(hash != "#" && hash != "" && hash != "general")
		{
			d3.json("world-countries.json", function(collection){ 
				
				collection.features.forEach(function(d){
					if(hash == "#"+d.id){ paysClique = d; zoomPays(); }	
				});
			});
		}
		
		resize();


	}

	queue()
		.defer(lireCsv, "blasphemeInfos.csv")
		.defer(lireCsv, "pictoMort.csv")
		.defer(lireJson, "world-countries.json")
		.awaitAll(ready);

	

	
	
	
	
	function traiterInfosBlaspheme(data) {
		
		data.forEach(function(d){
			
			var categories = [ d.blasphème, d.apostasie, d.diffamation ];
		
			var nomClasse = "";
			categories.forEach(function(c){  	
				if(c == "oui"){ 
					nomClasse += "O";
				} else {
					nomClasse += "N";	
				}
			});	
			
			switch(nomClasse)
			{
				case "NNN": nomClasse = "noPenalty"; break;	
				case "ONN": nomClasse = "blaspheme"; break;	
				case "NON": nomClasse = "apostasie"; break;	
				case "NNO": nomClasse = "diffamation"; break;	
				case "OON": nomClasse = "blasphemeApostasie"; break;	
				case "NOO": nomClasse = "apostasieDiffamation"; break;	
				case "ONO": nomClasse = "blasphemeDiffamation"; break;	
				case "OOO": nomClasse = "allPenalties"; break;	
			}
			
			var mort = false;
			if(d.mort == "oui"){ mort = true; }
		
			infosPays.push([ d.iso, nomClasse, mort ]);
			
		});
	} 
	
	
	
	
	
	
	
	
	function dessinerCarte(collection)
	{

		// CARTE
		carte.selectAll("path")
			.data(collection.features)
			.enter().append("svg:path")
			.attr("d", path)
			.attr("id", function(d){ return d.id; })
			.attr("title", function(d){ return d.properties.name; })
			.attr("class", function(d){
				
				var classe = "";
				infosPays.forEach(function(e, i){
					if(infosPays[i][0] == d.id)
					{
						classe = infosPays[i][1];
						
						// peine de mort
						if(infosPays[i][2])
						{
							paysPenaliseParMort.push(d);
						}
					}
				});
				return "boundary "+classe;
			})
			.on("mouseover", function(d){ hoverPays(d); })
			.on("mouseout", function(d){ outPays(d); })
			.on("click", function(d){ clickPays(d); });
			
		
	
	
			
	}
	

	
		
	function dessinerLegende()
	{

			var x = "1%";
			var y = "20%";
			var legende = svg.append("svg:g").attr("class", "legende");
			legende.append("svg:text").attr("class", "infosTitre")
					.attr("x", x).attr("y", y)
					.text("Penalisation par la loi");
			y = plusPct(y, 2);
					
			categories = [ [ "noPenalty", 					"none"], 
							[ "blaspheme", 						"blasphème" ], 
							[ "diffamation", 					"diffamation" ],
							[ "apostasie", 						"apostasie" ],  
							[ "blasphemeApostasie", 	"blasphème + apostasie" ], 
							[ "apostasieDiffamation", "apostasie + diffamation" ], 
							[ "blasphemeDiffamation", "blasphème + diffamation"], 
							[ "allPenalties", 				"All penalties"] ];
			
			categories.forEach(function(d){
				legende.append("svg:rect")
					.attr("width", "1%").attr("height", "1%")
					.attr("x", x).attr("y", y)
					.attr("class", d[0]);
				legende.append("svg:text").attr("class", "legendeTexte")
					.attr("x", plusPct(x, 2)).attr("y", plusPct(y, 1))
					.text(d[1]);
				y = plusPct(y, 4);
			});
			
			// texte mort en derniere ligne
			legende.append("svg:text").attr("class", "legendeTexte")
				.attr("x", plusPct(x, 2)).attr("y", plusPct(y, 1))
				.text("puni de mort");			
			pictoMortLegende.attr("d", pictoPath);
	}	
	
	
	
 	
	
	
	
	
	
	
	
	
	
	
	/////////////////////////////////////
	// INTERACTION /////////////////////
	///////////////////////////////////
	
	svg.on("click", clicSvg);
	
	function hoverPays(d)
	{
		/*if(!isZoomed)
		{
			var cible = this.svg.select("#"+d.id);
			cible.transition()
				.duration(100)
				.style("fill", "#c00");
		}*/
	}
	
	
	function outPays(d)
	{
		/*if(!isZoomed)
		{
			
			var cible = this.svg.select("#"+d.id);
			cible.transition()
				.duration(100)
				.style("fill", null);		
		}*/
	}
	
	
	
	
	
	function clickPays(d)
	{ 		
		paysClique = d;	
	}
	
	
	
	
	
	
	
	
	function clicSvg()
	{
		
		resetInfos();
		
		if(d3.event.target.id.length == 3 && (oldPaysCliqueId != paysClique.id || !isZoomed))
		{
			
			zoomPays();
			    	
		} else {
		
			dezoomPays();
		    	
		}
		
	}
	
	
	
	
	function dezoomPays()
	{
		
		window.location.hash = "general";
			
		// recolorer pays
		/*infosPays.forEach(function(d){
			var cible = carte.select("#"+d[0]);
			if (typeof(cible) != 'undefined')
			{ 
				cible.style("fill", null);
			}
		});*/	
			
		carte.transition()
	     		.duration(750)
	     		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + 1 + ")translate(" + -(width / 2) + "," + -(height / 2) + ")");
	    
	    infosFond.transition()
	    	.duration(750)
	    	.attr("width", "0%").attr("height", "0%");
	    	
	    isZoomed = false;
		
	}
	
	
	
	
	function zoomPays()
	{
	
		// ZOOM PAYS	
		clicPays = true;	
		isInformed = false;
		var centroid = path.centroid(paysClique);
		window.location.hash = paysClique.id;
	
		/*
		// couleurs pour le pays cliqué
		d3.selectAll(".boundary").transition().duration(750).style("fill", "#aaa");
		var cible = svg.select("#"+paysClique.id);
		cible.transition().duration(750).style("fill", "#f00");
		*/
		
	
		carte.transition()
	     		.duration(750)
	     		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + 2 + ")translate(" + -centroid[0] + "," + -centroid[1] + ")");
	    
		infosFond.attr("x", "60%").attr("y", "40%");
	  	infosFond.transition()
			.duration(750)
	    	.attr("width", "30%").attr("height", "40%")
	    	.each("end", afficherInfos );
	    	
	  oldPaysCliqueId = paysClique.id;
	    
	  isZoomed = true;
	}
	
	
	
	
	function resetInfos()
	{
		
		infosTitre[0].text("");
		infosTitre[1].text("");
		for(var i = 0; i < nbCat; i++){	
			infosTexte[i].text("");
			infosValeurs[0][i] = 0;
			legendeReligionsCarres[i].remove();
			legendeReligionsTextes[i].remove(); 
		}
		donut.remove();
		capitaleTexte.remove();
		capitalePoint.remove();	
	}
	
	
	
	
	function afficherInfos()
	{
		
		// titre
		infosTitre[0].text(paysClique.properties.name);
		
		// rappel de la penalisation
		var cible = document.getElementById(paysClique.id);
		var classe = cible.className.baseVal.split(" ", 2)[1];
		
		categories.forEach(function(d, i){
			if(classe == d[0]){ infosTitre[1].text("Pénalisations : "+d[1]); }
		});
	
		queue()
			.defer(d3.csv,  "couleursReligions.csv",			function(d, i){ recupererCouleurReligion(d, i); })
			.defer(d3.csv, 	"COWstate.csv", 							function(d){ traiterNoms(d); })
			.defer(d3.csv, 	"WRPstate2010.csv", 					function(d){ traiterReligions(d); })
			.defer(d3.csv ,	"listeCapitalesPosition.csv", function(d){ dessinerCapitales(d); })
			.awaitAll(dessinerInfos);
		
	}
	
	
	
	
	
	function recupererCouleurReligion(d, i){
		
		infosValeurs[1][i] = d.name;
		infosValeurs[2][i] = d.color;
	}
	
	
	
	
	
	function traiterNoms(d)
	{
		if(d.name == paysClique.properties.name)
		{
			cow = d.cow;
			isInformed = true;
		}
	}
	
	
	
	
	
	function traiterReligions(d)
	{	
		
		if(isInformed && cow == d.name)
		{
			
			infosValeurs[0][0] = d.chrstcatpct;
			infosValeurs[0][1] = d.chrstprotpct;
			infosValeurs[0][2] = d.chrstorthpct;
			infosValeurs[0][3] = d.chrstangpct;
			infosValeurs[0][4] = d.islmsunpct;
			infosValeurs[0][5] = d.islmshipct;
			infosValeurs[0][6] = d.judgenpct;
			infosValeurs[0][7] = d.budgenpct;
			infosValeurs[0][8] = d.taogenpct;
			
		}
	}
	
	
	
	
	function dessinerInfos()
	{

		var pctX = "62%";
		var pctY = "44%";
		infosTitre[0].attr("x", pctX).attr("y", pctY); 
		infosTitre[1].attr("x", pctX).attr("y", plusPct(pctY, 33)); 

		if(isInformed && isZoomed)
		{		  
			
			donut = infos.selectAll(".arc")
			    .data(pie(infosValeurs[0]))
				.enter().append("g")
			    .attr("class", "arc");
			      
			var posX = width*0.01*68;
			var posY = height*0.01*60;
			pctY = plusPct(pctY, 4);		
	
			donut.append("path")
			    .attr("d", arc)
			    .style("fill", function(d, i){ return "hsl("+infosValeurs[2][i]+", 80%, 50%)"; })
			    .attr("title", function(d, i){ return infosValeurs[1][i]+": "+d.data*100+"%"; })
			    .attr("transform", "translate("+posX+", "+posY+")")
			    .each(function(d, i){ 
			    	legendeReligionsCarres[i] = infos.append("svg:rect")
			    		.attr("width", "1%").attr("height", "1%")
			    		.attr("x", plusPct(pctX, 16)).attr("y", plusPct(pctY, 1))
			    		.style("fill", "hsl("+infosValeurs[2][i]+", 80%, 50%)");
			    	legendeReligionsTextes[i] = infos.append("svg:text").attr("class", "infosTexte")
			    		.attr("x", plusPct(pctX, 18)).attr("y", plusPct(pctY, 2))
			    		.text(infosValeurs[1][i]);
							pctY = plusPct(pctY, 3);
			    });	
			    
		} else if(!isInformed){
			
			for(var i = 0; i < nbCat; i++)
			{
				legendeReligionsCarres[i] = infos.append("svg:rect");
				legendeReligionsTextes[i] = infos.append("svg:text");
			}
			
			legendeReligionsTextes[0].attr("class", "infosTexte")
				.attr("x", pctX).attr("y", plusPct(pctY, 4))
			    .text("unknow");
		
		}
	}

	
	function plusPct(cible, ajout)
	{
		
		var cibleInt = parseInt(cible.substring(0, (cible.length)-1));
		cibleInt += ajout;
		return cibleInt+"%";
	
	}	
	
	function dessinerCapitales(data)
	{ 
		
		
		if(data.country == paysClique.properties.name)
		{
			
			// conversion des latitudes et longitudes
			var lat = parseFloat(data.lat.substring(0, data.lat.length-1));
			var sens = data.lat.substring(data.lat.length-1, data.lat.length);
			if(sens == "S"){ lat *= -1; }
			var long = parseFloat(data.long.substring(0, data.long.length-1));
			sens = data.long.substring(data.long.length-1, data.long.length);
			if(sens == "W"){ long *= -1; }
			
			coordonneesCapitale = [ long, lat ];
			var traductionCoor = projection(coordonneesCapitale);
			var x = traductionCoor[0];
			var y = traductionCoor[1];
		
			capitalePoint = carte.append("rect").attr("class", "capitalePoint");
			capitaleTexte = carte.append("svg:text").attr("class", "capitaleTexte");
		
			// dessiner un point
			capitalePoint.attr("width", 4).attr("height", 4)
				.attr("x", x).attr("y", y);
		
			// dessiner le nom de la capitale
			capitaleTexte.attr("x", x+6).attr("y", y+4)
				.text(data.capital);
	
		}
		
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
	        .scale(width / 10);
	
		svg
			.attr("width", width)
			.attr("height", height);
		
	    carte
	        .style('width', width)
	        .style('height', height);
	        
		
	    dessinGraticule.attr('d', path);
	    carte.selectAll("path").attr('d', path);
	    
		paysPenaliseParMort.forEach(function(d){
			var centroid = path.centroid(d);
			carte.append("svg:g")
				.attr("transform", "translate("+centroid[0]+", "+centroid[1]+") scale("+width/500+")")
				.append("svg:path")
				.attr("class", "pictosMort")
				.attr("d", pictoPath);
		});

	
		var posX = width*0.01*1.5;
		var posY = height*0.01*54.5;
		
		pictoMortLegende.attr("transform", "translate("+posX+", "+posY+") scale(4)");
		
		posX = width*0.01*2;
		posY = width*0.01*6;
		arc.outerRadius(posX).innerRadius(posY);
		
		if(isZoomed)
		{
							
			posX = width*0.01*68;
			posY = height*0.01*60;
    	donut.selectAll("path").attr("d", arc).attr("transform", "translate("+posX+", "+posY+")");
			
			var traductionCoor = projection(coordonneesCapitale);
			var x = traductionCoor[0];
			var y = traductionCoor[1];
			capitalePoint.attr("x", x).attr("y", y);
			capitaleTexte.attr("x", x+6).attr("y", y+4);
	
		}
	}




} // fin setup


