
var width, height;
window.addEventListener("load", setup, false)


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
	






	function dessinerLegende(){

		var legende = svg.append("svg:g").attr("class", "legende").attr("id", "legende");

		//fond de la légende
		// legende.append("svg:rect")
		// 	.attr("width","300px")
		// 	.attr("height","350px")
		// 	.style("fill","#aaa");


		// position des elements dans le bloc legende
		var positionX = 20;
		var positionY = 40;


		//titre de la légende
		legende.append("svg:text")
			.attr("class", "legendeTitre")
			.attr("x", positionX)
			.attr("y", positionY)
			.text(function(){
				var titreLegende = "";
				if(LANGUE == "FR"){ 
					titreLegende = "Pénalisation par la loi";
				} else {
					titreLegende = "Penalize by law";
				}
				return titreLegende;	
			});

		//boucle Items de la légende
		categories = [ [ "noPenalty", 				"none",						 	"aucune" ], 
						[ "diffamation", 			"defamation of religions",		"diffamation des religions" ],
						[ "blaspheme", 				"blasphemy",					"blasphème" ],
						[ "apostasie", 				"apostasy*",					"apostasie*" ],  
						[ "blasphemeDiffamation", 	"blasphemy + defamation",		"blasphème + diffamation" ],
						[ "apostasieDiffamation", 	"apostasy + defamation",		"apostasie + diffamation" ],  
						[ "blasphemeApostasie", 	"blasphemy + apostasy",			"blasphème + apostasie" ], 
						[ "allPenalties", 			"all penalties",				"toutes les pénalisations" ] ];
	

		//creation du groupe d'items
		//var items = legende.append("svg:g")


		categories.forEach(function(d, i){

			

				if(LANGUE == "FR"){ 
					creerItem(d[2], d[0], false, i);
				} else {
					creerItem(d[1], d[0], false, i);
				}



		})


		if(LANGUE == "FR"){ 
			creerItem("passible de mort", "peindeDeMort", forme, categories.length);
		} else {
			creerItem("punishable by death", "peindeDeMort", forme, categories.length);
		}

		

		




		function creerItem(texteLegende, nomClasse, formePicto, j){

			var marge = 18;

			// création du groupe de l'item
			var item = legende.append("svg:g")
							.attr("id","item"+j)
							.attr("name", nomClasse)
							.on("click", function(){ clickLegende(this); })
							.on("mouseover", function(){ 
								d3.select("#item"+j).style("opacity", "0.8").style("cursor", "pointer"); 
							})
							.on("mouseout", function(){ 
				 				d3.select("#item"+j).style("opacity", "1").style("cursor", "arrow"); ; 
							})
			

			//fond du bouton
			var fondOmbre = item.append("svg:rect").style("fill","rgba(0,0,0,0.15)").attr("x",-1).attr("y",1);;
			var fond = item.append("svg:rect").style("fill","#fff").attr("id", "fond"+j);

			
			//carré de couleur de la légende
			var pastilleCouleur = item.append("svg:rect").attr("class", nomClasse).attr("id", "pastille"+j);
		
			if(formePicto != false){
				var picto = item.append("svg:path")
					.attr("id", "picto"+j)
					.attr("d", formePicto)
					.style("fill", "#fff")
					.style("stroke", "#000")
					
			}



			//texte de la légende
			var txtLegende = item.append("svg:text").attr("class", "legendeTexte")
				.attr("id", "text"+j)
				.text(texteLegende)
				

			var txt = document.getElementById("text"+j).getBBox();

			txtLegende.attr("x",txt.height+marge*1.5)
				.attr("y",marge*1.2)
				

			//taille et position des fonds
			fond.attr("width", txt.width+marge*2+txt.height).attr("height", txt.height+marge);
			fondOmbre.attr("width", txt.width+marge*2+txt.height).attr("height", txt.height+marge);
			
			
			pastilleCouleur.attr("width", txt.height+marge).attr("height", txt.height+marge);
			
			if(formePicto != false){
				picto.attr("transform","scale(0.5) translate("+(txt.height+marge)+","+(txt.height+marge)+")")
			}
			
			item.attr("transform", "translate("+positionX+","+(positionY*1.5+j*(txt.height+marge*1.5))+")");


		}


		
	}




	


		
	
	
	
	
 	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

















	
	
	
	/////////////////////////////////////
	// INTERACTION /////////////////////
	///////////////////////////////////
	
	function hoverLegende(d)
	{
		var btn1 = d3.select("#btn1"+d.id);
		var text = d3.select("#text"+d.id);
		btn1[0][0].style.fill = "#888";
		text[0][0].style.fill = "#fff";
	}
	
	
	function outLegende(d)
	{
		var btn1 = d3.select("#btn1"+d.id);
		var text = d3.select("#text"+d.id);
		btn1[0][0].style.fill = "#fff";
		text[0][0].style.fill = "#555";
	}
	



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
	
	
	
	svg.on("click", clicSvg);
	
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
	     		.attr("transform", "scale(" + 1 + ")");

	    infosFond.transition()
	    	.duration(750)
	    	.attr("width", "0").attr("height", "0");
	    	
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
	    
	  	infosFond.transition()
			.duration(750)
	    	.attr("width", infosLargeur+"px").attr("height", infosHauteur+"px")
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
		infosPlus.remove();
		capitaleTexte.remove();
		capitalePoint.remove();	
	}
	
	
	




















	///////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////


	var infos = svg.append("svg:g").attr("id", "infos");
	var infosFond = infos.append("svg:rect").attr("id", "infosFond").attr("width", "0").attr("height", "0");
	var infosTitre = [3];
	infosTitre[0] = infos.append("svg:text").attr("class", "infosTitre");
	infosTitre[1] = infos.append("svg:text").attr("class", "infosPenalisations");
	var infosPlus = infos.append("svg:g").attr("class", "infosPlus");
	var infosLargeur = 500, infosHauteur = 550;
	
	var nbCat = 16;
	var infosTexte = [nbCat];
	for(var i = 0; i < nbCat; i++){
		infosTexte[i] = infos.append("svg:text").attr("class", "infosTexte");
	}
	var infosValeurs = [3]; 
	infosValeurs[0] = []; infosValeurs[1] = []; infosValeurs[2] = [];
	var cow = ""; var isInformed;
	var pie = d3.layout.pie().sort(null).value(function(d) { return d; });    
	var arc = d3.svg.arc().outerRadius(100).innerRadius(50);
	var donut  = infos.selectAll(".arc");
	var legendeReligionsCarres = [nbCat];
	var legendeReligionsTextes = [nbCat];
	for(var i = 0; i < nbCat; i++)
	{
		legendeReligionsCarres[i] = infos.append("svg:rect");
		legendeReligionsTextes[i] = infos.append("svg:text");
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
					infosTitre[1].text("Pénalisation(s) : "+d[2]);
				} else {
					infosTitre[1].text("Penalisation(s)): "+d[1]);
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

			/*var pcts = [ d.chrstcatpct, d.chrstprotpct, d.chrstorthpct, d.chrstangpct, d.islmsunpct, d.islmshipct,
			d.judgenpct, d.budgenpct, d.taogenpct, d.hindgenpct, d.confgenpct, d.anmgenpct ];
			pcts.sort();
			pcts.reverse();*/


			isInformed = true;

			infosValeurs[0][0] = d.chrstcatpct;
			infosValeurs[0][1] = d.chrstprotpct;
			infosValeurs[0][2] = d.chrstorthpct;
			infosValeurs[0][3] = d.chrstangpct;
			infosValeurs[0][4] = d.chrstothrpct;
			infosValeurs[0][5] = d.islmsunpct;
			infosValeurs[0][6] = d.islmshipct;
			infosValeurs[0][7] = d.judgenpct;
			infosValeurs[0][8] = d.anmgenpct;
			infosValeurs[0][9] = d.budgenpct;
			infosValeurs[0][10] = d.taogenpct;
			infosValeurs[0][11] = d.hindgenpct;
			infosValeurs[0][12] = d.confgenpct;
			infosValeurs[0][13] = d.syncgenpct;
			infosValeurs[0][14] = d.nonreligpct;
			

			var total = 0;
			var nbElemSansDernier = nbCat-1;

			for(var i = 0; i < nbElemSansDernier; i++)
			{

				total += parseFloat(infosValeurs[0][i]);

				infosValeurs[1][i] = Math.round(infosValeurs[0][i]*100*100)/100+"% "+infosValeurs[1][i];


			}
			infosValeurs[0][nbElemSansDernier] = 1-total;
			infosValeurs[1][nbElemSansDernier] = Math.round(infosValeurs[0][nbElemSansDernier]*100*100)/100+"% "+infosValeurs[1][nbElemSansDernier];

			

			// verification du pourcentage
			var verif = 0.0;
			for(var i = 0; i < nbCat; i++)
			{
				verif += parseFloat(infosValeurs[0][i]);
			}
			console.log(verif);			


		}

	}
	
	














	

	
	function dessinerInfos()
	{
		var marge = 20;
		//var largeurInfos = document.getElementById("infosFond").getBBox().height;

		infosPlus = infos.append("svg:g").attr("class", "infosPlus");
		var ligne = infosPlus.append("svg:line").style("stroke", "#fff")
			.attr("x1", marge).attr("y1", 80)
			.attr("x2", 480).attr("y2", 80);
		var ligne2 = infosPlus.append("svg:line").style("stroke", "#fff")
			.attr("x1", marge).attr("y1", infosHauteur-50)
			.attr("x2", 480).attr("y2", infosHauteur-50);
		var titreLegende = infosPlus.append("svg:text")
			.attr("class", "infosTexte")
			.attr("x", marge).attr("y", 110)
			.text(function(){
				if(LANGUE=="FR"){
					return "Répartition des croyants";
				}else{
					return "Breakdown of adherents";
				}
			});
		var source = infosPlus.append("svg:text")
			.attr("class", "infosSource")
			.attr("x", marge).attr("y", infosHauteur-marge-12)
			.text("sources: Zeev Maoz and Errol A. Henderson. “The World Religion Dataset, 1945-2010:")
			.on("click", function(){ window.location.href="http://www.correlatesofwar.org/COW2%20Data/Religion/Religion.htm";  });
		var source2 = infosPlus.append("svg:text")
			.attr("class", "infosSource")
			.attr("x", marge).attr("y", infosHauteur-marge)
			.text("Logic, Estimates, and trends.” International Interactions, 39(3)")
			.on("click", function(){ window.location.href="http://www.correlatesofwar.org/COW2%20Data/Religion/Religion.htm";  });




		infosTitre[0].attr("x", marge).attr("y", marge*2); 
		infosTitre[1].attr("x", marge).attr("y", marge*3); 

		for(var i = 0; i < nbCat; i++)
		{
			legendeReligionsCarres[i] = infos.append("svg:rect");
			legendeReligionsTextes[i] = infos.append("svg:text").attr("class", "infosTexte");
		}

		if(isInformed && isZoomed)
		{
			donut = infos.selectAll(".arc")
			    .data(pie(infosValeurs[0]))
				.enter().append("g")
			    .attr("class", "arc");

			var cpt = 0;
			donut.append("path")
			    .attr("d", arc)
			    .style("fill", function(d, i){ return infosValeurs[2][i] })
			    .attr("title", function(d, i){ return infosValeurs[1][i]+": "+d.data*100+"%"; })
			    .attr("transform", "translate("+150+", "+260+")")
			    .each(function(d, i) { 

			    	if(infosValeurs[0][i] != 0)
			    	{
				    	// pastilles legendes 
				    	legendeReligionsCarres[i].attr("width", "10").attr("height", "10")
				    		.attr("x", 300).attr("y", 140+(cpt*marge*1.2))
				    		.style("fill", infosValeurs[2][i]);

				    	// textes legendes
				    	legendeReligionsTextes[i].attr("x", 320).attr("y", 150+(cpt*marge*1.2))
				    		.text(infosValeurs[1][i]);
				    	cpt++;
					}
			    });	

		} else if(!isInformed){
	
			legendeReligionsTextes[0].attr("class", "infosTexte")
				.attr("x", marge).attr("y", 140)
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
		

		if(legendeClique == "peindeDeMort")
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



	/*function map(valeur, minRef, maxRef, minDest, maxDest) {
  		return minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef);
	}*/



} // fin setup


