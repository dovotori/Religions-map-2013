
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
	
	var svg = d3.select("#svgCarte");
	
	svg.append("defs").append("path")
		.datum({type: "Sphere"})
		.attr("id", "sphere")
		.attr("d", path);
	
	// svg.append("use")
	// 	.attr("class", "stroke")
	// 	.attr("xlink:href", "#sphere");
	
	// svg.append("use")
	// 	.attr("class", "fill")
	// 	.attr("xlink:href", "#sphere");
	
	var dessinGraticule = svg.append("path")
		.datum(graticule)
		.attr("class", "graticule")
		.attr("d", path);
	
	
	
	

	
	
	var infosPays = [];
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
	var infosValeurs = [3]; 
	infosValeurs[0] = []; infosValeurs[1] = []; infosValeurs[2] = [];
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
	
	var paysTrouve = false;
	var paysPenaliseParMort = [];
	var pictosMortCarte = [];
 	var forme = "M24.869 -17.798 L17.798 -24.869 L0 -7.071 L-17.797 -24.869 L-24.869 -17.798 L-7.071 0 L-24.869 17.798 L-17.798 24.869 L0 7.071 L17.798 24.869 L24.869 17.798 L7.071 0Z"
	
	
	



	function lireCsv(url, callback) {
		d3.csv(url, function(d){ callback(null, d); });
	}
	function lireJson(url, callback) {
		d3.json(url, function(d){ callback(null, d); });
	}

	queue()
		.defer(lireCsv, "data/blasphemeInfos.csv")
		.defer(lireJson, "data/world-countries.json")
		.defer(lireCsv, "data/pays-fr-en-de-es-iso2-iso3-id.csv")
		.awaitAll(ready);
	
	function ready(error, results) {

		traiterInfosBlaspheme(results[0]);
		dessinerCarte(results[1], results[2]);
		dessinerLegende();			
		lireHashDemarrage();
		resize();
	}


	

	


	function lireHashDemarrage()
	{
		var hash = window.location.hash;	
		if(hash != "#" && hash != "" && hash != "general")
		{
			d3.json("data/world-countries.json", function(collection){ 
				
				collection.features.forEach(function(d){
					if(hash == "#"+d.id){ paysClique = d; zoomPays(); }	
				});
			});
		}
	}
	
	
	
	
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
	
	
	
	
	
	
	
	
	function dessinerCarte(collection, conversionNoms)
	{


		// CARTE
		carte.selectAll("path")
			.data(collection.features)
			.enter().append("svg:path")
			.attr("d", path)
			.attr("id", function(d){ return d.id; })
			.attr("title", function(d)
			{ 

				if(LANGUE == "FR")
				{
					var nomPays = "inconnu";
					conversionNoms.forEach(function(pa){

						if(d.properties.name.toLowerCase() == pa.pays_en.toLowerCase())
						{
							nomPays = pa.pays_fr;
						}

					});
					return nomPays;
				} else {
					return d.properties.name; 
				}
			})
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
			.on("mouseout", function(d)	{ outPays(d); })
			.on("click", function(d)	{ clickPays(d); });
		
	}
	




	
		
	function dessinerLegende()
	{

		var x = "1%";
		var y = "20%";
		var legende = svg.append("svg:g").attr("class", "legende");

		// fond et titre
		legende.append("svg:rect").style("fill", "#eee")
			.attr("x", x).attr("y", y)
			.attr("width", "16%").attr("height", "42%");
		y = plusPct(y, 4);
		legende.append("svg:text").attr("class", "legendeTitre")
			.attr("x", plusPct(x, 1)).attr("y", y)
			.text(function(){
				var titreLegende = "";
				if(LANGUE == "FR"){ 
					titreLegende = "Pénalisation par la loi";
				} else {
					titreLegende = "Penalize by law";
				}
				return titreLegende;	
			});
		x = plusPct(x, 1);
		y = plusPct(y, 2);
				

		categories = [ [ "noPenalty", 				"none",						 	"aucune" ], 
						[ "diffamation", 			"defamation of religions",		"diffamation des religions" ],
						[ "blaspheme", 				"blasphemy",					"blasphème" ],
						[ "apostasie", 				"apostasy*",					"apostasie*" ],  
						[ "blasphemeDiffamation", 	"blasphemy + defamation",		"blasphème + diffamation" ],
						[ "apostasieDiffamation", 	"apostasy + defamation",		"apostasie + diffamation" ],  
						[ "blasphemeApostasie", 	"blasphemy + apostasy",			"blasphème + apostasie" ], 
						[ "allPenalties", 			"all penalties",				"toutes les pénalisations" ] ];
	

		categories.forEach(function(d, i){
			legende.append("svg:rect")
				.attr("width", "1%").attr("height", "1%")
				.attr("x", x).attr("y", y)
				.attr("class", d[0]);
			legende.append("svg:text").attr("class", "legendeTexte")
				.attr("x", plusPct(x, 2)).attr("y", plusPct(y, 1))
				.attr("name", d[0])
				.text(function(){
					var texte = "";
					if(LANGUE == "FR")
					{
						texte = d[2];
					} else {
						texte = d[1];
					}
					return texte;
				})
				.on("click", function(d){ clickLegende(this); });
			y = plusPct(y, 4);
		});
		
		// texte mort en derniere ligne
		legende.append("svg:text").attr("class", "legendeTexte")
			.attr("x", plusPct(x, 2)).attr("y", plusPct(y, 1))
			.attr("title", "passible de mort")
			.attr("name", "passible de mort")
			.text(function(){
					var texte = "";
					if(LANGUE == "FR")
					{
						texte = "passible de mort";
					} else {
						texte = "punishable by death";
					}
					return texte;
			})
			.on("click", function(d){ clickLegende(this); });

		// picto legende
		pictoMortLegende = legende.append("svg:path")
			.attr("d", forme)
			.attr("transform","scale(0.01)")
			.style("fill", "#fff")
			.style("stroke", "#000");

	}	
	
	
	
 	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

















	
	
	
	
	/////////////////////////////////////
	// INTERACTION /////////////////////
	///////////////////////////////////
	
	svg.on("click", clicSvg);
	
	function hoverPays(d)
	{

			var cible = svg.select("#"+d.id);
			cible.transition()
				.duration(100)
				.style("opacity", "0.6");

	}
	
	
	function outPays(d)
	{
			
			var cible = svg.select("#"+d.id);
			cible.transition()
				.duration(100)
				.style("opacity", "1");

	}
	
	
	
	
	
	function clickPays(d)
	{ 	
		paysClique = d;	
	}
	
	
	
	function clickLegende(d)
	{
		legendeClique = d.getAttribute("name");
	}
	
	
	
	
	
	
	function clicSvg()
	{

		resetInfos();

		if(d3.event.target.id != null && d3.event.target.id.length == 3 && (oldPaysCliqueId != paysClique.id || !isZoomed))
		{
			zoomPays();
		    	
		} else if(legendeClique != false)
		{
			colorerEnFonctionLegende();

		} else {

			dezoomPays();
		    	
		}
		
		legendeClique = false;
		
	}
	
	






	
	
	function dezoomPays()
	{
		
		window.location.hash = "general";
			
		// recolorer pays
		carte.selectAll(".boundary").style("fill", null);	
		afficherPictosMortCarte();
			
		carte.transition()
	     		.duration(750)
	     		.attr("transform", "translate(50%, 50%)scale(" + 1 + ")");
	    
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
		// recolorer pays
		carte.selectAll(".boundary").style("fill", null);

		changeHash();

		carte.transition()
     		.duration(750)
     		.attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")scale(" + 2 + ")translate(" + -centroid[0] + "," + -centroid[1] + ")");
	    
		infosFond.attr("x", "60%").attr("y", "40%");
	  	infosFond.transition()
			.duration(750)
	    	.attr("width", "30%").attr("height", "40%")
	    	.each("end", afficherInfos );
	    	
		oldPaysCliqueId = paysClique.id;
	    
		isZoomed = true;
		
	}
	
	
	


	function changeHash()
	{
		// empeche le jump lié au hash
		history.pushState(null, null, '#general');
		if(history.pushState) {
		    history.pushState(null, null, "#"+paysClique.id);
		}
		else {
		    window.location.hash = "#"+paysClique.id;
		}
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
		
		
		// rappel de la penalisation
		var cible = document.getElementById(paysClique.id);
		var classe = cible.className.baseVal.split(" ", 2)[1];
		
		categories.forEach(function(d, i){
			if(classe == d[0])
			{ 
				if(LANGUE == "FR")
				{
					infosTitre[1].text("Pénalisations : "+d[2]);
				} else {
					infosTitre[1].text("Penalisation : "+d[1]);
				}
			}
		});

		
		paysTrouve = false;

		queue()
			.defer(d3.csv, "data/pays-fr-en-de-es-iso2-iso3-id.csv",	function(d){ recupererTitre(d); })
			.defer(d3.csv,  "data/couleursReligions.csv",		function(d, i){ recupererCouleurReligion(d, i); })
			.defer(d3.csv, 	"data/COWstate.csv", 				function(d){ traiterNoms(d); })
			.defer(d3.csv, 	"data/WRPstate2010.csv", 			function(d){ traiterReligions(d); })
			.defer(d3.csv ,	"data/listeCapitalesPosition.csv", 	function(d){ dessinerCapitales(d); })
			.awaitAll(dessinerInfos);
		
	}
	
	

	function recupererTitre(d)
	{


		if(LANGUE == "FR")
		{

			if(paysClique.properties.name.toLowerCase() == d.pays_en.toLowerCase())
			{	
				infosTitre[0].text(d.pays_fr);	
				paysTrouve = true;
			} else if(!paysTrouve){
				infosTitre[0].text(paysClique.properties.name);
			}



		} else {
			
			infosTitre[0].text(paysClique.properties.name);

		}
	}



	
	
	
	function recupererCouleurReligion(d, i){
		
		if(LANGUE == "FR")
		{
			infosValeurs[1][i] = d.nom;
		} else {
			infosValeurs[1][i] = d.name;
		}
		infosValeurs[2][i] = d.color;
	}
	
	
	

	
	
	function traiterNoms(d)
	{
		if(d.name == paysClique.properties.name)
		{
			cow = d.cow;
		}
	}
	
	
	

	
	
	function traiterReligions(d)
	{	
		
		if(cow == d.name)
		{
			isInformed = true;
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
			    .style("fill", function(d, i){ return infosValeurs[2][i] })
			    .attr("title", function(d, i){ return infosValeurs[1][i]+": "+d.data*100+"%"; })
			    .attr("transform", "translate("+posX+", "+posY+")")
			    .each(function(d, i){ 
			    	legendeReligionsCarres[i] = infos.append("svg:rect")
			    		.attr("width", "1%").attr("height", "1%")
			    		.attr("x", plusPct(pctX, 16)).attr("y", plusPct(pctY, 1))
			    		.style("fill", infosValeurs[2][i]);
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
			    .text(function(d){
			    	var texte = "";
			    	if(LANGUE == "FR")
			    	{
			    		texte = "données inconnues";
			    	} else {
			    		texte = "unknow";
			    	}
			    	return texte;
			    });
		
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
	



	
	
	function colorerEnFonctionLegende()
	{
		
		pictosMortCarte.forEach(function(pic){
			pic.remove();
		});	
		
		// colorer pays en gris
		var pays = carte.selectAll(".boundary");
		pays.transition().duration(300).style("fill", "#efefef");






		pays[0].forEach(function(pa){
			
			var nomClasse = pa.getAttribute("class").split(" ")[1];



			var colorDiffamation 	= "#568cac"; 
			var colorBlaspheme 		= "#5656bf"; 
			var colorApostasie 		= "#8080a0"; 
			var colorBlasphemeDiffamation = "#804ab4";
			var colorApostasieDiffamation = "#ac568c";
			var colorBlasphemeApostasie = "#bf5656";
			

			

			switch(legendeClique)
			{
				case "diffamation":
					if(nomClasse == legendeClique || nomClasse == "apostasieDiffamation" || nomClasse == "blasphemeDiffamation" || nomClasse == "allPenalties")
					{
						carte.selectAll("#"+pa.getAttribute("id")).transition().duration(300).style("fill", colorDiffamation);	
					}
					break;
				case "blaspheme":
					if(nomClasse == legendeClique || nomClasse == "blasphemeApostasie" || nomClasse == "blasphemeDiffamation" || nomClasse == "allPenalties")
					{
						carte.selectAll("#"+pa.getAttribute("id")).transition().duration(300).style("fill", colorBlaspheme);	
					}
					break;
				case "apostasie":
					if(nomClasse == legendeClique || nomClasse == "apostasieDiffamation" || nomClasse == "blasphemeApostasie" || nomClasse == "allPenalties")
					{
						carte.selectAll("#"+pa.getAttribute("id")).transition().duration(300).style("fill", colorApostasie);	
					}
					break;
				case "blasphemeApostasie":
					if(nomClasse == legendeClique || nomClasse == "allPenalties")
					{
						carte.selectAll("#"+pa.getAttribute("id")).transition().duration(300).style("fill", colorBlasphemeApostasie);	
					}
					break;
				case "blasphemeDiffamation":
					if(nomClasse == legendeClique || nomClasse == "allPenalties")
					{
						carte.selectAll("#"+pa.getAttribute("id")).transition().duration(300).style("fill", colorBlasphemeDiffamation);	
					}
					break;
				case "apostasieDiffamation":
					if(nomClasse == legendeClique || nomClasse == "allPenalties")
					{
						carte.selectAll("#"+pa.getAttribute("id")).transition().duration(300).style("fill", colorApostasieDiffamation);	
					}
					break;
				default:
					if(nomClasse == legendeClique)
					{
						carte.selectAll("#"+pa.getAttribute("id")).transition().duration(300).style("fill", null);	
					}
					break;
			}

		
		});
		

		if(legendeClique == "passible de mort" || legendeClique == "penalize by law")
		{
			afficherPictosMortCarte();
			paysPenaliseParMort.forEach(function(pa){

				var cible = carte.selectAll("#"+pa.id); 	// selectAll car 2 Somalie et 2 Afghanistan sur carte ????
				cible.transition().duration(300).style("fill", null);

			});
		}
		
				
	}
	
	


	
	function afficherPictosMortCarte()
	{
		// supprime pour eviter doublons
		pictosMortCarte.forEach(function(pic){
			pic.remove();
		});

		paysPenaliseParMort.forEach(function(d, i){
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

	
		var posX = width*0.01*2.5;
		var posY = height*0.01*58.5;
		
		pictoMortLegende.attr("transform", "translate("+posX+", "+posY+") scale(0.3)");
		
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


