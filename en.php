<!doctype html>
<html lang="fr">
	<head>
		<title>Reporters sans frontières</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<script type="text/javascript" src="/squelettes/lib/js/jquery-1.4.2.min.js"></script>
		<script type="text/javascript" src="javascript/d3.js"></script>
		<script type="text/javascript" src="javascript/d3geo.js"></script>
		<script type="text/javascript" src="javascript/queue.js"></script>
		<script type="text/javascript" src="javascript/main.js"></script>

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

		<link rel="stylesheet" href="knacss.css" media="all">

		<style type="text/css">

			@font-face {

			    font-family: 'BebasNeueRegular';
			    src: url('/squelettes/fonts/BebasNeue-webfont.eot');
			    src: url('/squelettes/fonts/BebasNeue-webfont.eot?#iefix') format('embedded-opentype'),
			         url('/squelettes/fonts/BebasNeue-webfont.woff') format('woff'),
			         url('/squelettes/fonts/BebasNeue-webfont.ttf') format('truetype'),
			         url('/squelettes/fonts/BebasNeue-webfont.svg#BebasNeueRegular') format('svg');
			    font-weight: normal;
			    font-style: normal;
			}

			body {
				font-family:helvetica, sans-serif;
				font-size:14px;
			}

			#cp, #sources{
				max-width:800px;
				margin:0 auto;
				padding:10px 20px;
			}

			#carte #svgCarte {
				background: #efefef none;
				overflow: hidden;
			}

			h2 {
				text-align:left;
				margin:20px auto 0;
				color:#000;
				position: relative;
				font-family:"BebasNeueRegular";
				font-size:2em;
			}

			.graticule {
				fill: none;
				stroke: #fff;
				stroke-width: 0.02em;
			}

			#sphere{
				fill: #efefef;	
			}

			.boundary {
				fill: none;
				stroke: #888;
				stroke-width: 0.03em;
			}


			.boundary:hover {
				cursor: pointer;
			}


			.noPenalty						{ fill: #dfdfdf; }

			.diffamation					{ fill: #568cac; }
			.blaspheme						{ fill: #5656bf; }
			.apostasie						{ fill: #8080a0; }
			.blasphemeDiffamation			{ fill: #804ab4; }
			.apostasieDiffamation			{ fill: #ac568c; }
			.blasphemeApostasie				{ fill: #bf5656; }

			.allPenalties					{ fill: #533a67; }


			.legendeTitre {
				font-size: 1em;
				font-family: sans-serif;
				fill: #000;
			}

			.legendeTexte {
				font-size: 1em;
				font-family: sans-serif;
				fill: #000;
			}

			.legendeTexte:hover {
				cursor: pointer;	
			}

			.infosTitre {
				font-size: 1.4em;
				font-family: sans-serif;
				fill: #555;
			}

			.infosTitreCat {
				fill: #555;	
			}

			.infosTexte {
				font-size: 1em;
				font-family: sans-serif;
				fill: #555;
			}

			#infosFond {
				fill: #ddd;
			}

			.capitaleTexte {
				font-size: 40%;
				font-family: sans-serif;
				fill: #aaa;
			}

			.capitalePoint {
				fill: #aaa;	
			}

			.pictosMort {
				stroke-width: 0.03em;
				stroke: #000;
				fill:#fff;	
			}

			#sources {
				color: #555;
				text-align: left;
				font-size: 0.8em;
				line-height: 1.3em;
				padding: 1%;
			}

			#sources a {
				color: #aaa;
			}

		</style>


		<script type="text/javascript">
			
			// LANGUE
			var LANGUE = "EN";

			jQuery(document).ready(function($jQ){

				jQuery("#more").hide(0);
				jQuery("#intro").append("<br/><a href='#'>More</a>");
				jQuery("#intro a").click(function(){
					jQuery("#more").slideDown(500);
					jQuery(this).hide(0);
				})

				

			});
		</script>

	</head>
	<body>
		<div id="cp" class="line">
			<div class="txtcenter">
				<a href="http://rsf.org">
					<img class="w150p" src="http://en.rsf.org/squelettes/img/en/logo-en.png" alt="logo RSF"/>
				</a>
				<br/>
				<br/>
				RWB releases report:
			</div>

			<h2>“Information sacrificed on altar of religion”</h2>
			<p id="intro">There are far too many countries where news and content providers constantly face a very special and formidable form of censorship, one exercised in the name of religion or even God. And with increasing frequency, this desire to thwart freedom of information invokes the hard-to-define and very subjective concept of the “feelings of believers.”</p>
			<div id="more">This is a minefield. Reporters Without Borders has analysed it and offered its recommendations in a report published today entitled “Information sacrificed on altar of religion.” Citing many cases that RWB has monitored in the Middle East, Africa, Asia and even some parts of Europe (the western hemisphere is the exception), the report tackles the issue from three angles.</br>
The first part describes the often cruel violations of the right to know that are carried out in the name of defending what is sacred, and shows how use of the religious bludgeon against journalists and bloggers above all serves political interests. In fact, religious censorship is rarely used to suppress actual blasphemy or violation of dogma.</br>
In the Iran of the Mullahs, the Persian Gulf emirates and even in those countries where Orthodox Christian patriarchs still wield considerable influence, journalists are branded as heretics as soon as they dare to describe the far-from-holy practices of the regime and its clergy. And if they dare to denounce the atrocities of an armed Islamist group in Pakistan, Bangladesh or Nigeria, they are gunned down as infidels even when they are Muslims.</br>
Although used for political ends, religion often carries real weight in societies where no boundary between the spiritual and secular is recognized. When an Omani publication quoted gays as saying they were better off in Oman than in neighbouring divine-right petro-monarchies, it was accused of promoting “moral depravity” and therefore “sacrilege.” Subjects such as the role of women, sexuality and reproduction – all markers of secularization – are surrounded by taboos.</br>
The second part of the report looks at the different kinds of legislation penalizing attacks on religion or the “feelings of believers.” Such laws exist in nearly half (47 per cent) of the world’s countries. Only the most hardline Islamic states penalize apostasy (the act of giving up one’s religion), which is punishable by death in some cases. But blasphemy is penalized in no fewer than 31 countries including Greece, Italy and Ireland (which updated its legislation in 2010) and “defamation of religion” is criminalized in 86 countries.</br>
Implementation is not only harshest in countries with a state religion, where dogma and its representatives have to be protected. The coexistence of different religious communities in a single country is often used by governments as grounds for cracking down on any content liable to arouse passions. Double-edged legislation in former Soviet republics defines the limits what is “journalistically acceptable,” penalizing both “offending religion” and “extremism.”</br>
The third part examines the diplomatic consequences of religion’s presence in the public domain in the era of the Internet and globalized news and information. The biggest impact has been a campaign by countries that are members of the Organization of Islamic Cooperation (OIC), which came close to sacrificing freedom of information in a dangerous UN resolution in 2007 that was even backed by such atheist countries as China, Vietnam and Cuba.</br>
After letting up for a while, the offensive intensified again in 2012 after the controversial video Innocence of Muslims was posted on YouTube. But the IOC countries are not the only ones to raise their voice against universal freedoms. Russia has taken up the cause by espousing “traditional values,” which it has promoted in three resolutions submitted to the UN Human Rights Council since 2009.</br>
A new front has opened up in the fight for freedom of information. In the light of this report’s findings and in line with its mandate and principles, Reporters Without Borders:</br>
<ul>
<li>Urges international institutions and their affiliated bodies to reject the attempts by the governments of some countries to have “blasphemy” and “defamation of religion” treated as violations of fundamental human rights.</li>
<li>Hopes that all restrictions on freedom of information and expression in the name of religion will eventually be dropped from the legislation of European countries that aspire to set an example in respect for human rights and pluralism.</li>
<li>Approves the UN General Assembly resolution of 19 December 2011 but points out that “combating intolerance, negative stereotyping, stigmatization, discrimination, incitement to violence and violence against persons, based on religion or belief” applies as much to non-believers as to believers, whether in the majority or not.</li>
</ul>
			</div>
			<p class="txtcenter">
			<a href="pdf/EN_RAPPORT_BLASPHEME_BD.pdf"><img src="img/couvBlaspheme-en.png" alt="couverture du rapport"/></a>
			</p>
			<h2>Map of religious repression</h2>
		</div>

		<div id="carte" class="line">
			
			<svg id="svgCarte"></svg>		
		</div>

		
		<div id="sources" class="line">
			<p style="text-align: left; margin-left: 20px; font-size: 0.8em;">* voluntarily renouncing one’s religion</p>
			<p>map by Pierre-Alain Leboucher and Dorian Ratovo</p>
			<p>Data source :<br/>
				Pew Research, Religion and Public Life Project, 21 novembre 2012 <a href="http://www.pewforum.org/2012/11/21/laws-penalizing-blasphemy-apostasy-and-defamation-of-religion-are-widespread/">source</a><br/>Zeev Maoz and Errol A. Henderson. “The World Religion Dataset, 1945-2010: Logic, Estimates, and trends.” International Interactions, 39(3) <a href="http://www.correlatesofwar.org/COW2%20Data/Religion/Religion.htm">source</a><br/>
			powerd by Mike Bostock's <a href="http://d3js.org/">D3.js</a></p>
		</div>

	</body>
</html>

