<?php

if ( !defined('MEDIAWIKI') )
{
	die( 'This file is a MediaWiki extension, it is not a valid entry point' );
}

class TPCalculator {
	
	static function onParserInit( Parser $parser ) {
		$parser->setHook('TPCalculator', 'TPCalculator::showCalculator' );
		return true;
	}

	public static function showCalculator( $input, array $params, Parser $parser, PPFrame $frame ) {
		
		$parser->getOutput()->updateCacheExpiry(0);
		$parser->getOutput()->addModules(['ext.TPCalculator']);

		$divContents = "Good to go";

		$html = self::calcHTML();

		return 	$html;
	}

	public static function calcHTML(){
		// http://www.evil-kitty.com/tpcalc/
		$html = "<div id=\"TPCalculator_form\">" .
					"<p class=\"TPCalculator_form_title\">TP Calculator</p>" .
                    "<table class=\"TPCalculator_table\"><tbody>" .
                        "<tr>
                            <td><input class=\"TPCalculator_textinput\" id=\"TPCalculator_delay_single\">Delay (single wield) </td>
                        </tr>" .
                        // "<tr>
                        //     <td><input class=\"TPCalculator_textinput\" id=\"TPCalculator_delay_dual\">(not required) Delay (dual wield)</td>
                        // </tr>" . 
                        "<tr>
                            <td><input class=\"TPCalculator_textinput\" id=\"TPCalculator_storetp\">Store TP from gear</td>
						</tr>" . 
						"<tr>
							<td><button id=\"TPCalculator_calc\" class=\"TPCalculator_customButton\">Calculate</button></td>
						</tr>" . 
						"<tr>
							<td><p id=\"TPCalculator_calc_output\"></p></td>
						</tr>" . 
					"</tbody></table>
				</div>";
        return $html;        
	}

	// public static function onParserAfterTidy( Parser &$parser, &$text ) {
	// 	return true;
	// }

	// public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
	// 	return true;
	// }

}
