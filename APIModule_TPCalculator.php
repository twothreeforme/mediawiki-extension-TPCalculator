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
            'storetp' => null,
    		];
	}

    function execute( ) {
        $params = $this->extractRequestParams();
        $result = $this->getResult();

        
        $calc = new TPCalculator_Calcs();
        $calc->setDelay_single((int)$params['delay_single']);
        $calc->setDelay_dual((int)$params['delay_dual']);
        $calc->setStoreTP((int)$params['storetp']);
        

        $finalHtml = $calc->htmlWithCalcs();

        $result->addValue($params['action'], "tp", $finalHtml);
    }
}

?>