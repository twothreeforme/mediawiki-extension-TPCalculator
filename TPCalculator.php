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
                    self::toggleSwitch() .
					"<table class=\"TPCalculator_table\"><tbody>" .
                        "<tr>
                            <td><input class=\"TPCalculator_textinput\" id=\"TPCalculator_delay_single\">* Delay (main weapon)
							</td>
                        </tr>" .
                        "<tr>
                            <td>" . 
							"<div id=\"TPCalculator_delayType\" class=\"TPCalculator_delayType hidden\" >" . 
								self::_isDual() . self::_isH2H() .
							"</div>
							</td>
                        </tr>" . 
                        "<tr>
                            <td><input class=\"TPCalculator_textinput\" id=\"TPCalculator_storetp\">Store TP from gear</td>
						</tr>" . 
						"<tr>
							<td><button id=\"TPCalculator_calc\" class=\"TPCalculator_customButton\">Calculate</button></td>
						</tr>" . 
						"<tr>
							<td><p><i>* required</i></p><br>
								<p id=\"TPCalculator_calc_output\"></p></td>
						</tr>" . 
					"</tbody></table>
				</div>";
        return $html;        
	}

	public static function toggleSwitch(){
		return "<div class=\"TPCalculator_three-state-switch\">
					<input type=\"radio\" id=\"TPCalculator_three-state-switch_radio1\" name=\"radio\" checked/>
					<label for=\"TPCalculator_three-state-switch_radio1\">Single Wield</label>

					<input type=\"radio\" id=\"TPCalculator_three-state-switch_radio2\" name=\"radio\"/>
					<label for=\"TPCalculator_three-state-switch_radio2\">Dual Wield</label>

					<input type=\"radio\" id=\"TPCalculator_three-state-switch_radio3\" name=\"radio\"/>
					<label for=\"TPCalculator_three-state-switch_radio3\">Hand-to-Hand</label>
				</div>";
	}

	public static function _isDual(){
		return "<div id=\"TPCalculator_form_isDual\" class=\"TPCalculator_form_is hidden\">" .
				"<input class=\"TPCalculator_textinput\" id=\"TPCalculator_delay_dual\">Delay (sub weapon)<br>" . 
				"<input class=\"TPCalculator_textinput\" id=\"TPCalculator_delay_DW\">DW %" .
				"</div>";
	}

		public static function _isH2H(){
		return "<div id=\"TPCalculator_form_isH2H\" class=\"TPCalculator_form_is hidden\">" .
				"<input class=\"TPCalculator_textinput\" id=\"TPCalculator_delay_traits\">Delay (from player traits)<br>" .
				"<span class=\"superscript\">480 used as default when left blank</span>". 
				"</div>";
	}

	// public static function onParserAfterTidy( Parser &$parser, &$text ) {
	// 	return true;
	// }

	// public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
	// 	return true;
	// }

}
