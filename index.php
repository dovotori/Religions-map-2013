<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr" dir="ltr"><head>
	<title>Reporters sans frontières</title>
    <meta name="description" content="Reporters sans frontières, ONG reconnue d’utilité publique, défend la liberté d’informer et d’être informé partout dans le (...)">
	
	<meta name="google-site-verification" content="DtexeBICtpOuOY_cs-8TpFIOz746jvmRkpIfGY7_eOY">
	<script type="text/javascript" async="" src="http://www.google-analytics.com/ga.js"></script><script type="text/javascript">var _sf_startpt=(new Date()).getTime()</script>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="user-scalable=no, width=device-width">





<link rel="alternate" type="application/rss+xml" title="Syndiquer tout le site" href="http://fr.rsf.org/spip.php?page=backend&amp;lang=fr">

<!--[if IE 7]>
	<link rel="stylesheet" type="text/css" media="screen" href="squelettes/lib/css/ie7.css" />
<![endif]-->
<!--[if lte IE 6]>
	<link rel="stylesheet" type="text/css" media="screen" href="squelettes/lib/css/ie6.css" />
<![endif]-->
<!--[if lt IE 6]>
	<link rel="stylesheet" type="text/css" media="screen" href="squelettes/lib/css/ie55.css" />
<![endif]-->
<!--[if lt IE 5.5]>
	<link rel="stylesheet" type="text/css" media="screen" href="squelettes/lib/css/ie5.css" />
<![endif]-->

<!-- DESKTOP CSS-->
<link rel="stylesheet" type="text/css" href="http://fr.rsf.org/squelettes/lib/css/screen130426.css">


<!--[if IE]>
<link rel="stylesheet" type="text/css" href="squelettes/lib/css/screen120814.css" media="screen" />
<![endif]-->
<!-- IPHONE CSS -->
<!--[if !IE]>-->
<link media="only screen and (max-device-width: 480px)" rel="stylesheet" type="text/css" href="http://fr.rsf.org/squelettes/lib/css/iphone.css">
<!--<![endif]-->

<!-- JS -->
<script type="text/javascript" src="http://fr.rsf.org/squelettes/lib/js/jquery-1.4.2.min.js"></script>

<script type="text/javascript" src="http://fr.rsf.org/squelettes/lib/js/jquery.cycle.all.js"></script>
<script type="text/javascript" src="http://fr.rsf.org/squelettes/lib/js/scripts120503.js"></script>

<!-- JS newsletter DoList -->
<script type="text/javascript" src="http://fr.rsf.org/squelettes/lib/js/dolist-fr.js"></script> 




<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-2498778-1']);
  _gaq.push(['_setDomainName', 'rsf.org']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>


<script src="prive/javascript/jquery.form.js" type="text/javascript"></script>

<script src="prive/javascript/ajaxCallback.js" type="text/javascript"></script>
<!-- insert_head -->
<!-- PLUGIN JQUERY UI -->
<link type="text/css" rel="stylesheet" media="all" href="http://fr.rsf.org/plugins/myinterface/css/blitzer/jquery-ui-1.8.custom.css">
<script type="text/javascript" src="http://fr.rsf.org/plugins/myinterface/javascript/jquery-ui-1.7.2.custom.min.js"></script>
<script type="text/javascript" src="http://fr.rsf.org/plugins/myinterface/javascript/i18n/ui.datepicker-fr.js"></script>

<!-- // PLUGIN JQUERY UI  -->
<link rel="stylesheet" href="http://fr.rsf.org/plugins/tetue_trousse/tetue_trousse.css" type="text/css" media="all">	</head>

<!-- CODE CARTE -->
<script type="text/javascript" src="d3.js"></script>
<script type="text/javascript" src="d3geo.js"></script>
<script type="text/javascript" src="queue.js"></script>
<script type="text/javascript" src="main.js"></script>




<body class="home fr">
	
	<script type="text/javascript">
	jQuery(document).ready(function($jQ){

		jQuery(".hasSubmenu").hover(function(){
   			jQuery(this).children(".submenus").show(0);
		}, function(){
   			jQuery(".submenus").hide(0);			
		});

	});
</script>


	<?php	
		include("menu.php");
	?>
	
	
	<br>



<!-- 
code carte
-->

	<style>
	

#conteneurCarte {
	text-align: center;
	margin: 0; padding: 0;
}

#conteneurCarte #svgCarte {
	background: #888;
	width: 100%;
	margin: 0; padding: 0;
	overflow: hidden;
}

.graticule {
	fill: none;
	stroke: #fff;
	stroke-width: 0.02em;
}

#sphere{
	fill: #888;	
}

.boundary {
	fill: none;
	stroke: #888;
	stroke-width: 0.03em;
}


.boundary:hover {
	cursor: pointer;
}


.noPenalty						{ fill: #bbb; }
.blaspheme						{ fill: #89D0F0; }
.apostasie						{ fill: #DB8CB7; }
.diffamation					{ fill: #7EC9D0; }
.blasphemeApostasie				{ fill: hsl(349, 30%, 50%); }
.apostasieDiffamation			{ fill: hsl(349, 60%, 50%); }
.blasphemeDiffamation			{ fill: hsl(349, 80%, 50%); }	
.allPenalties					{ fill: #000; }


.legendeTexte {
	font-size: 1em;
	font-family: sans-serif;
	fill: #fff;
}

.legendeTexte:hover {
	cursor: pointer;	
}

.infosTitre {
	font-size: 1.4em;
	font-family: sans-serif;
	fill: #aaa;
}

.infosTitreCat {
	fill: #555;	
}

.infosTexte {
	font-size: 1em;
	font-family: sans-serif;
	fill: #333;
}

#infosFond {
	fill: #eee;
}

.capitaleTexte {
	font-size: 40%;
	font-family: sans-serif;
	fill: #fff;
}

.capitalePoint {
	fill: #fff;	
}

.pictosMort {
	stroke-width: 0.03em;
	stroke: #fff;	
}

#sources {
	color: #aaa;
	text-align: left;
	font-size: 0.8em;
	line-height: 1.3em;
	padding: 1%;
}

#sources a {
	color: #555;
}

	</style>
	
	<h2>Pénalisation de la loi</h2>

	<div id="conteneurCarte">
		<svg id="svgCarte"></svg>
			
	</div>
	
	<div id="sources">
			<p>Based on <br/>Pew Research, Religion and Public Life Project, 21 novembre 2012 <a href="http://www.pewforum.org/2012/11/21/laws-penalizing-blasphemy-apostasy-and-defamation-of-religion-are-widespread/">source</a><br/>Zeev Maoz and Errol A. Henderson. “The World Religion Dataset, 1945-2010: Logic, Estimates, and trends.” International Interactions, 39(3) <a href="http://www.correlatesofwar.org/COW2%20Data/Religion/Religion.htm">source</a><br/>
			Powered by <a href="http://d3js.org/">D3.js</a> de  Mike Bostock</p>
	</div>


<!-- 
fin code carte
-->




		

<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script><script src="http://www.google-analytics.com/ga.js" type="text/javascript"></script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-2498778-1");
pageTracker._trackPageview();
} catch(err) {}
</script>


<script type="text/javascript">
var _sf_async_config={uid:25093,domain:"fr.rsf.org"};
(function(){
  function loadChartbeat() {
    window._sf_endpt=(new Date()).getTime();
    var e = document.createElement('script');
    e.setAttribute('language', 'javascript');
    e.setAttribute('type', 'text/javascript');
    e.setAttribute('src',
       (("https:" == document.location.protocol) ? "https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/" : "http://static.chartbeat.com/") +
       "js/chartbeat.js");
    document.body.appendChild(e);
  }
  var oldonload = window.onload;
  window.onload = (typeof window.onload != 'function') ?
     loadChartbeat : function() { oldonload(); loadChartbeat(); };
})();

</script>


<script language="javascript" src="https://grids.iraiser.eu/analytics.js"></script>
<script language="javascript">
   try{ new iraiser_analytics({auth_key:"31dagDk1412Mku3829U379A1225"});}catch(e){}
</script>




<script language="javascript" type="text/javascript" src="http://static.chartbeat.com/js/chartbeat.js"></script><script id="hiddenlpsubmitdiv" style="display: none;"></script><script>try{for(var lastpass_iter=0; lastpass_iter < document.forms.length; lastpass_iter++){ var lastpass_f = document.forms[lastpass_iter]; if(typeof(lastpass_f.lpsubmitorig2)=="undefined"){ lastpass_f.lpsubmitorig2 = lastpass_f.submit; lastpass_f.submit = function(){ var form=this; var customEvent = document.createEvent("Event"); customEvent.initEvent("lpCustomEvent", true, true); var d = document.getElementById("hiddenlpsubmitdiv"); if (d) {for(var i = 0; i < document.forms.length; i++){ if(document.forms[i]==form){ d.innerText=i; } } d.dispatchEvent(customEvent); }form.lpsubmitorig2(); } } }}catch(e){}</script></body></html>
