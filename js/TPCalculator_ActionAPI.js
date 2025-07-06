
function actionAPI(params, callback) {
  //console.log(params);
  var api = new mw.Api();
  console.log(params);
  api.get( params ).done( function ( result ) {
    callback(result["tpcalculator"]);
  });

}

module.exports = { actionAPI }
