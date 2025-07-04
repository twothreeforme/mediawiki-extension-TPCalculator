<?php


class TPCalculator_Calcs {

    private int $delay;
    private int $delay_single;
    private int $delay_dual;
    private int $storetp;
    private bool $isH2H = false;

    public function __construct() {}

    private function getDelay_single(): int{ return $this->delay_single; }
    private function getDelay_dual(): int{ 
        if ( is_null($this->duadelay_dual) || $this->duadelay_dual < 0  ) return 0;
        else return $this->duadelay_dual; 
    }
    private function getStoreTP(): int{ 
        if ( is_null($this->storetp) || $this->storetp < 0  ) return 0;
        else return $this->storetp; 
    }
    private function getIsH2H(): bool{ return $this->isH2H; }

    public function setDelay_single(int $single){ $this->delay_single = $single; }
    public function setDelay_dual(int $dual){ $this->delay_dual = $dual; }
    public function setStoreTP(int $storetp){ $this->storetp = $storetp; }
    public function setIsH2H(bool $h2h){ $this->isH2H = $h2h; }

    // private function setDelay(){
    //     $this->delay = floor(floor($this->getDelay_single() * 1000 / 60) * 60 / 1000);
    // }
    public function getDelay(): int{
        return floor(floor($this->getDelay_single() * 1000 / 60) * 60 / 1000);
    }
    
    function calcTP() {

        $delay = $this->getDelay();
        
        $tpph = null;
        
        if ( $this->getIsH2H() == false ) {
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
            // $tpph = round($tpph, 0);
        } else {
            $delay += 480;
            if ($delay >= 530) {
                $tpph = (14.5 + ((( $delay - 50) * 3.5) / 470) - 14.18) * 10;
            } else {
                if ($delay > 480) {
                    $tpph = (13.0 + (($delay * 1.5) / 50) - 13.05) * 10;
                } else {
                    $tpph = 0;
                }
            }
            // $tpph = round($tpph, 0);
            //$tpph = "+" . $tpph;
        }

        $stp = $this->getStoreTP();
        if ( $stp > 0 ){
            $tpph *= 1 + ( $stp / 100 );
        }

        return $tpph;
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
        $baseTP = round($this->calcTP(), 2);

        $html .= "<b>" . $baseTP . "</b> TP per hit.<br>";
        $html .= "<b>" . $this->hitsPer1K($baseTP) . "</b> total hits for 1k TP.";

        return $html;
    }
}


?>