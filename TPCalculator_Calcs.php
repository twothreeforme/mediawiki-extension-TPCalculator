<?php


class TPCalculator_Calcs {

    // private int $delay;
    private int $delay_single;
    private int $delay_dual;
    private int $dualwield;
    private int $storetp;
    private int $delay_traits;
    private bool $isH2H = false;

    public function __construct() {}

    private function getDelay_single(): int{ return $this->delay_single; }
    private function getDelay_dual(): int{ 
        if ( is_null($this->delay_dual) || $this->delay_dual < 0  ) return 0;
        else return $this->delay_dual; 
    }
    private function getDW(): int{ 
        if ( is_null($this->dualwield) || $this->dualwield < 0  ) return 0;
        else return $this->dualwield; 
    }
    private function getStoreTP(): int{ 
        if ( is_null($this->storetp) || $this->storetp < 0  ) return 0;
        else return $this->storetp; 
    }
    private function getDelay_traits(): int{ 
        if ( is_null($this->delay_traits) || $this->delay_traits <= 0  ) return 480;
        else return $this->delay_traits; 
    }
    private function getIsH2H(): bool{ return $this->isH2H; }

    public function setDelay_single(int $single){ $this->delay_single = $single; }
    public function setDelay_dual(int $dual){ $this->delay_dual = $dual; }
    public function setDW(int $dualwield){ $this->dualwield = $dualwield; }
    public function setStoreTP(int $storetp){ $this->storetp = $storetp; }
    public function setDelay_traits(int $delay_traits){ $this->delay_traits = $delay_traits; }
    public function setIsH2H(bool $h2h){ $this->isH2H = $h2h; }


    private function getTrueDelay($delay){
        return floor(floor($delay * 1000 / 60) * 60 / 1000); 
    }

    private function getDelay(): int{

        $delay = $this->getTrueDelay( $this->getDelay_single() );
        $delaySUB = $this->getTrueDelay( $this->getDelay_dual() );
        if ( $delaySUB > 0 ){
            $delay = (( $delay + $delaySUB ) * ( 1 - ( $this->getDW() / 100 )) ) / 2 ;
        }
        if ( $this->getIsH2H() === true ) {
            $delay += $this->getDelay_traits();
        }

        return floor($delay);
    }
    
    function calcTP() {

        $delay = $this->getDelay();
        $tpph = null;

        if ($delay > 530) {
            $tpph = (14.5 + ((( $delay - 530) * 3.5) / 470)) * 10;
        } elseif ($delay >= 480) {
            $tpph = (13.0 + ((( $delay - 480) * 1.5) / 50)) * 10;
        } elseif ($delay >= 450) {
            $tpph = (11.5 + ((( $delay - 450) * 1.5) / 30)) * 10;
        } elseif ($delay >= 180) {
            $tpph = (5.0 + ((( $delay - 180) * 6.5) / 270)) * 10;
        } else {
            $tpph = (5.0 + ((( $delay - 180) * 1.5) / 180)) * 10;
        }

        $stp = $this->getStoreTP();
        if ( $stp > 0 ){
            $tpph *= 1 + ( $stp / 100 );
        }

        return floor($tpph);
    }
    
    function hitsPer1K($tp){
        $totalhitsneeded = 1000 / $tp;
        $t = floor($totalhitsneeded);

        if ( ( 1000 % $tp ) > 0 ){
            return $t + 1;
        }
        return $t;
    }

    function htmlWithCalcs(){
        $html = "";
        $baseTP = $this->calcTP();

        $html .= "<b>" . $baseTP . "</b> TP per hit.<br>";
        $html .= "<b>" . $this->hitsPer1K($baseTP) . "</b> total hits for 1k TP.";

        return $html;
    }
}


?>