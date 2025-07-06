
module.exports.setup = function () {

    const delayTypeDIVs = document.getElementsByClassName("TPCalculator_form_is");
    if ( delayTypeDIVs ) { 
        Array.from(delayTypeDIVs).forEach((div) => {
            if ( !div.classList.contains('hidden') ) div.classList.toggle('hidden');
            });
    }

    const toggleIsSingle = document.getElementById("TPCalculator_three-state-switch_radio1");
    toggleIsSingle.addEventListener("change", (e) =>  {
        resetAllInputs();

        let div = document.getElementById("TPCalculator_delayType");
        if ( !div.classList.contains('hidden') ){
            div.classList.toggle("hidden");
        }
    });

    const toggleIsSDual = document.getElementById("TPCalculator_three-state-switch_radio2");
    toggleIsSDual.addEventListener("change", (e) =>  {
        resetAllInputs();

        let div = document.getElementById("TPCalculator_delayType");
        if ( div.classList.contains('hidden') ){ div.classList.toggle("hidden"); }

        hideDelayTypesDIV();

        hideDelayType("TPCalculator_form_isDual");
    });

    const toggleIsH2H = document.getElementById("TPCalculator_three-state-switch_radio3");
    toggleIsH2H.addEventListener("change", (e) =>  {
        resetAllInputs();
        
        let div = document.getElementById("TPCalculator_delayType");
        if ( div.classList.contains('hidden') ){ div.classList.toggle("hidden"); }
        
        hideDelayTypesDIV();

        hideDelayType("TPCalculator_form_isH2H");
    });


}

function hideDelayTypesDIV(){
    let delayTypeDIVs = document.getElementsByClassName("TPCalculator_form_is");
    if ( delayTypeDIVs ) { 
        Array.from(delayTypeDIVs).forEach((div) => {
            if ( !div.classList.contains('hidden') ) div.classList.toggle('hidden');
            });
    }
}

function hideDelayType(classname){
    let innerDiv = document.getElementById(classname);
    if ( innerDiv.classList.contains('hidden') ){ innerDiv.classList.toggle("hidden"); }
}

function resetAllInputs(){
    let form = document.getElementById("TPCalculator_form");
    const inputs = form.querySelectorAll('input');
    if ( inputs ) { 
        Array.from(inputs).forEach((inp) => {
            inp.value = "";
        });
    }

}
