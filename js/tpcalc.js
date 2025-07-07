var API = require("./TPCalculator_ActionAPI.js");
var ToggleSwitch = require("./toggleswitch.js");

const tpcalc_submit = document.getElementById("TPCalculator_calc");
tpcalc_submit.addEventListener("click", (e) =>  {
    let delay = document.getElementById("TPCalculator_delay_single").value;
    if ( delay == "" || delay == 0 ){
        mw.notify( 'Delay must be > 0', { autoHide: true,  type: 'error' } ); 
    }
    else {
        let output = document.getElementById("TPCalculator_calc_output");
        output.innerHTML = "Loading...";
        API.actionAPI(getTPCalcParams(), tpcalc_submit_callback);
    }
});

ToggleSwitch.setup();

const inputFields = document.getElementsByClassName("TPCalculator_textinput");
// https://stackoverflow.com/questions/70806083/how-to-preview-the-result-of-a-beforeinput-event/70806297#70806297
Array.from(inputFields).forEach((button) => {
    button.addEventListener("beforeinput", function(e) {
        const nextVal = e.target.value.substring(0, e.target.selectionStart) + (e.data ?? '') + e.target.value.substring(e.target.selectionEnd);
        //console.log(nextVal)
        if(!/^(\d{0,7}|\d{3}-?\d{0,4}|)$/.test(nextVal)) {
            e.preventDefault();
        }
        return;
    });
});

function getTPCalcParams(){
    let isH2H = false;
    let H2Hradio = document.getElementById("TPCalculator_three-state-switch_radio3");
    if ( H2Hradio && H2Hradio.checked ) isH2H = true;
    
    return {
        action: "tpcalculator",
        delay_single:document.getElementById("TPCalculator_delay_single").value,
        delay_dual:document.getElementById("TPCalculator_delay_dual").value, 
        dual_wield:document.getElementById("TPCalculator_delay_DW").value, 
        traits:document.getElementById("TPCalculator_delay_traits").value, 
        storetp:document.getElementById("TPCalculator_storetp").value,
        H2H:isH2H,
    };
}

function tpcalc_submit_callback(result){
    //console.log(result["tp"]);
    let tpcalc_output = document.getElementById("TPCalculator_calc_output");
    tpcalc_output.innerHTML = result["tp"];
}

