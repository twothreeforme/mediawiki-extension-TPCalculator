<?php

use ApiBase;

class APIModule_TPCalculator extends ApiBase {
    public function __construct( $main, $action ) {
        parent::__construct( $main, $action);
    }

    protected function getAllowedParams() {
        return [
            'action' => null,
            'delay_single' => null,
			'delay_dual' => null,
			'delay_traits' => null,
            'dual_wield' => null,
            'storetp' => null,
            'traits' => null,
            'H2H' => null,
    		];
	}

    function execute( ) {
        $params = $this->extractRequestParams();
        $result = $this->getResult();
        
        $calc = new TPCalculator_Calcs();
        $calc->setDelay_single((int)$params['delay_single']);
        $calc->setDelay_dual((int)$params['delay_dual']);
        $calc->setStoreTP((int)$params['storetp']);
        $calc->setDW((int)$params['dual_wield']);
        $calc->setDelay_traits((int)$params['traits']);
        $calc->setIsH2H((bool)$params['H2H']);

        $finalHtml = $calc->htmlWithCalcs();

        $result->addValue($params['action'], "tp", $finalHtml);
    }
}

?>