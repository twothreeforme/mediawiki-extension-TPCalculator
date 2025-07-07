/*** ASSUMPTIONS:
* Delay reduction (e.g., Dual Wield) does reduce TP per hit
* Haste does NOT reduce TP per hit
* Delay reduction changes delay as: Delay * (1 - reduction%)
* Haste changes delay as: Delay * (1 - haste%), caps at 70%
*/


/* calcDelay - calculate overall delay
************
	Inputs:	delayMain	Main-hand weapon delay	[ REQUIRED ]
			delaySub	Off-hand weapon delay	[ OPTIONAL ]
			haste		Amount of Haste+%		[ OPTIONAL ]
			delayReduc	Amount of delay reduction (e.g., DW bonus)	[ OPTIONAL ]
	Output:	delay		Overall delay (per hand)
*/
function calcDelay(delayMain, delaySub, haste, delayReduc) {
	/* calculate base delay */
	var delay = delayMain;
	if (delaySub > 0) {
		delay += delaySub;
		delay /= 2;
	}
	if (delayReduc > 0) {
		delay *= (1-(delayReduc/100));
	}
	if (haste > 0) {
		delay *= 1 - (Math.min(haste,70)/100);
	}
	/* assume delay is rounded down */
	delay = Math.floor(delay);

	return delay;
}

/* calcDelayTp - calculate overall delay for TP calculations
************
	Inputs:	delayMain	Main-hand weapon delay	[ REQUIRED ]
			delaySub	Off-hand weapon delay	[ OPTIONAL ]
			delayReduc	Amount of delay reduction (e.g., DW bonus)	[ OPTIONAL ]
	Output:	delay		Overall delay (per hand, for TP calculations)
*/
function calcDelayTp(delayMain, delaySub, delayReduc) {
	/* calculate base delay */
	var delay = delayMain;
	if (delaySub > 0) {
		delay += delaySub;
		delay /= 2;
	}
	if (delayReduc > 0) {
		delay *= (1-(delayReduc/100));
	}
	/* assume delay is rounded down */
	delay = Math.floor(delay);

	return delay;
}

/* calcTpStats - calculate TP per hit, hits to 100% TP, and delay to 100% TP
**************
	Inputs:	delay			Overall delay (per hand)	[ REQUIRED ]
			delayTp		Delay used to calculate TP		[ REQUIRED ]
			hitRate		Hit rate				[ OPTIONAL ]
	Output:	tpStats.tpPerHit	TP gained per hit
			tpStats.hitsToTp	Hits to get at least 100% TP
			tpStats.delayToTp	Delay taken to get at least 100% TP
			tpStats.secsToTp	Seconds (to 0.1) taken to get at least 100% TP
*/
function calcTpStats(delay,delayTp,hitRate,isDualWield,storeTp) {
	var tpStats = new Object;

	/* calculate TP/hit, hits/100TP, delay/100TP */
	if (delayTp < 180) {
		tpStats.tpPerHit = 5;
	} else if (delayTp < 480) {
		tpStats.tpPerHit = ((delayTp-180)/256*6) + 5;
	} else {
		tpStats.tpPerHit = (delayTp+480)/80;
	}
	/* add in Store TP */
	if (storeTp > 0) {
		tpStats.tpPerHit *= 1 + (storeTp/100)
	}
	
	/* round TP awarded down to the nearest 0.1 */
	tpStats.tpPerHit = Math.floor(tpStats.tpPerHit*10)/10;
	tpStats.hitsToTp = Math.ceil(100/tpStats.tpPerHit);
	tpStats.delayToTp = delay * tpStats.hitsToTp;
	if (hitRate > 0)
	{
		if (isDualWield)
			tpStats.swingsToTp = Math.ceil((tpStats.hitsToTp/(hitRate/100))/2)*2;
		else
			tpStats.swingsToTp = Math.ceil(tpStats.hitsToTp/(hitRate/100));
		tpStats.delayToTp = delay * tpStats.swingsToTp;
	}
	tpStats.secsToTp = Math.ceil(tpStats.delayToTp/6)/10;

	return tpStats;
}

/* calcNewTpStats - calculate TP per hit, hits to 100% TP, and delay to 100% TP [ post-TP update ]
**************
	Inputs:	delay			Overall delay (per hand)	[ REQUIRED ]
			delayTp		Delay used to calculate TP		[ REQUIRED ]
			hitRate		Hit rate				[ OPTIONAL ]
	Output:	tpStats.tpPerHit	TP gained per hit
			tpStats.hitsToTp	Hits to get at least 100% TP
			tpStats.swingsToTp	Swings to get at least 100% TP
			tpStats.delayToTp	Delay taken to get at least 100% TP
			tpStats.secsToTp	Seconds (to 0.1) taken to get at least 100% TP
*/
function calcNewTpStats(delay,delayTp,hitRate,isDualWield,storeTp) {
	var tpStats = new Object;

	/* calculate TP/hit, hits/100TP, delay/100TP */
	if (delayTp < 180) {
		tpStats.tpPerHit = ((delayTp-180)*1.5/180) + 5;
	} else if (delayTp < 450) {
		tpStats.tpPerHit = ((delayTp-180)*6.5/270) + 5;
	} else if (delayTp < 480) {
		tpStats.tpPerHit = ((delayTp-450)*1.5/30) + 11.5;
	} else if (delayTp < 530) {
		tpStats.tpPerHit = ((delayTp-480)*1.5/50) + 13;
	} else {
		tpStats.tpPerHit = ((delayTp-530)*3.5/470) + 14.5;
	}
	/* add in Store TP */
	if (storeTp > 0) {
		tpStats.tpPerHit *= 1 + (storeTp/100)
	}
	/* round TP awarded down to the nearest 0.1 */
	tpStats.tpPerHit = Math.floor(tpStats.tpPerHit*10)/10;
	tpStats.hitsToTp = Math.ceil(100/tpStats.tpPerHit);
	tpStats.delayToTp = delay * tpStats.hitsToTp;
	if (hitRate > 0)
	{
		if (isDualWield)
			tpStats.swingsToTp = Math.ceil((tpStats.hitsToTp/(hitRate/100))/2)*2;
		else
			tpStats.swingsToTp = Math.ceil(tpStats.hitsToTp/(hitRate/100));
		tpStats.delayToTp = delay * tpStats.swingsToTp;
	}
	tpStats.secsToTp = Math.ceil(tpStats.delayToTp/6)/10;

	return tpStats;
}

/* getResults - Main function, calculates based on data in form elements of expected names, and
	writes results to a div.
*************
	Inputs:	(none)
	Output:	(none)
*/
function getResults() {
	div = document.getElementById("results");

	/***** SETUP 1 *****/
	delayMain1Input = document.getElementById("delayMain1");
	delaySub1Input = document.getElementById("delaySub1");
	haste1Input = document.getElementById("haste1");
	delayReduc1Input = document.getElementById("delayReduc1");
	hitRate1Input = document.getElementById("hitRate1");
	storeTp1Input = document.getElementById("storeTp1");

	if (!div || !delayMain1Input || !delaySub1Input || !haste1Input || !hitRate1Input) return;

	/* get values from text fields */
	delayMain1 = Number(delayMain1Input.value);
	delaySub1 = Number(delaySub1Input.value);
	haste1 = Number(haste1Input.value);
	delayReduc1 = Number(delayReduc1Input.value);
	hitRate1 = Number(hitRate1Input.value);
	if (hitRate1 <= 0) hitRate1 = 100;
	isDualWield1 = (delaySub1>0)?true:false;
	storeTp1 = Number(storeTp1Input.value);

	if (isNaN(delayMain1) || isNaN(delaySub1) || isNaN(haste1) || isNaN(delayReduc1) || isNaN(hitRate1) || isNaN(storeTp1)) {
		div.innerHTML = "<p>Only numerical values are accepted in the text fields.</p>";
		return false;
	}

	/* calculate base delay */
	delay1 = calcDelay(delayMain1,delaySub1,haste1,delayReduc1);
	delayTp1 = calcDelayTp(delayMain1,delaySub1,delayReduc1);

	/* calculate TP/hit, hits/100TP, delay/100TP */
	var tpStats1 = calcTpStats(delay1,delayTp1,hitRate1,isDualWield1,storeTp1);
	var tpStatsNew1 = calcNewTpStats(delay1,delayTp1,hitRate1,isDualWield1,storeTp1);

	/* generate HTML string for results */
	setup1String = '<h3>TP</h3><p>Delay = '+delay1+'</p><p>TP per hit = '+tpStatsNew1.tpPerHit+'</p><p>Hits to 100% TP = '+tpStatsNew1.hitsToTp+'</p>';
	if (tpStatsNew1.swingsToTp>0)
		setup1String += '<p>Swings to 100% TP = '+tpStatsNew1.swingsToTp+'</p>';
	setup1String += '<p>Delay to 100% TP = '+tpStatsNew1.delayToTp+' ('+tpStatsNew1.secsToTp+' secs)</p>';

	setup1String += '<hr/><span style="color:grey"><h3>Old TP</h3><p>Delay = '+delay1+'</p><p>TP per hit = '+tpStats1.tpPerHit+'</p><p>Hits to 100% TP = '+tpStats1.hitsToTp+'</p>';
	if (tpStatsNew1.swingsToTp>0)
		setup1String += '<p>Swings to 100% TP = '+tpStats1.swingsToTp+'</p>';
	setup1String += '<p>Delay to 100% TP = '+tpStats1.delayToTp+' ('+tpStats1.secsToTp+' secs)</p></span>';
	/***** END SETUP 1 *****/

	/***** SETUP 2 *****/
	delayMain2Input = document.getElementById("delayMain2");
	delaySub2Input = document.getElementById("delaySub2");
	haste2Input = document.getElementById("haste2");
	delayReduc2Input = document.getElementById("delayReduc2");
	hitRate2Input = document.getElementById("hitRate2");
	storeTp2Input = document.getElementById("storeTp2");

	if (!div || !delayMain2Input || !delaySub2Input || !haste2Input || !hitRate2Input) return;

	/* get values from text fields */
	delayMain2 = Number(delayMain2Input.value);
	delaySub2 = Number(delaySub2Input.value);
	haste2 = Number(haste2Input.value);
	delayReduc2 = Number(delayReduc2Input.value);
	hitRate2 = Number(hitRate2Input.value);
	if (hitRate2 <= 0) hitRate2 = 100;
	isDualWield2 = (delaySub2>0)?true:false;
	storeTp2 = Number(storeTp2Input.value);

	if (isNaN(delayMain2) || isNaN(delaySub2) || isNaN(haste2) || isNaN(delayReduc2) || isNaN(hitRate2) || isNaN(storeTp2)) {
		div.innerHTML = "<p>Only numerical values are accepted in the text fields.</p>";
		return false;
	}

	/* if delayMain2 is set, then go ahead and calculate for Setup 2 */
	if (delayMain2 > 0) {
		/* calculate base delay */
		delay2 = calcDelay(delayMain2,delaySub2,haste2,delayReduc2);
		delayTp2 = calcDelayTp(delayMain2,delaySub2,delayReduc2);

		/* calculate TP/hit, hits/100TP, delay/100TP */
		var tpStats2 = calcTpStats(delay2,delayTp2,hitRate2,isDualWield2,storeTp2);
		var tpStatsNew2 = calcNewTpStats(delay2,delayTp2,hitRate2,isDualWield2,storeTp2);

		/* generate HTML string for results */
		setup2String = '<h3>TP</h3><p>Delay = '+delay2+'</p><p>TP per hit = '+tpStatsNew2.tpPerHit+'</p><p>Hits to 100% TP = '+tpStatsNew2.hitsToTp+'</p>';
		if (tpStatsNew2.swingsToTp>0)
			setup2String += '<p>Swings to 100% TP = '+tpStatsNew2.swingsToTp+'</p>';
		setup2String += '<p>Delay to 100% TP = '+tpStatsNew2.delayToTp+' ('+tpStatsNew2.secsToTp+' secs)</p>';

		setup2String += '<hr/><span style="color:grey"><h3>Old TP</h3><p>Delay = '+delay2+'</p><p>TP per hit = '+tpStats2.tpPerHit+'</p><p>Hits to 100% TP = '+tpStats2.hitsToTp+'</p>';
		if (tpStatsNew2.swingsToTp>0)
			setup2String += '<p>Swings to 100% TP = '+tpStats2.swingsToTp+'</p>';
		setup2String += '<p>Delay to 100% TP = '+tpStats2.delayToTp+' ('+tpStats2.secsToTp+' secs)</p></span>';
	} else {
		setup2String = '';
	}
	/***** END SETUP 2 *****/


	if (delayMain2 > 0)
	{
		div.innerHTML = '<div class="results"><h2>Setup 1</h2>'+setup1String+'</div><div class="results"><h2>Setup 2</h2>'+setup2String+'</div>';
	} else {
		div.innerHTML = '<div class="results"><h2>Setup 1</h2>'+setup1String+'</div>';
	}
}
