var local=_.isUndefined(navigator.languages)? navigator.language || navigator.userLanguage : navigator.languages[0] || navigator.userLanguage;
var locale=local.toLowerCase();
//console.log("locale "+locale);
//console.log("locale "+(locale=="ar"));
if(locale=="ar") {
   // console.log("here in false "+(locale=="ar-sa"));
    locale="en-us";
}
//console.log("locale "+locale);
var localeFileName='/locales/angular-locale_' + locale + '.js'
var script = document.currentScript;
var fullUrl = script.src;
//console.log('file location src',fullUrl);
var len = fullUrl.lastIndexOf("/");
//console.log('file location src',len);
fullUrl = fullUrl.substring(0,len)+localeFileName;
//console.log('file location src',fullUrl);
document.write('<script src='+fullUrl+'><\/script>');