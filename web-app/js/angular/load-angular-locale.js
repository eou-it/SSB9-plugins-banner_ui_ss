var local=_.isUndefined(navigator.languages)? navigator.language || navigator.userLanguage : navigator.languages[0] || navigator.userLanguage;
var locale=local.toLowerCase();
console.log("locale "+locale);
console.log("locale "+(locale=="ar"));
if(locale=="ar") {
   // console.log("here in false "+(locale=="ar-sa"));
    locale="en-us";
}

switch(locale)  {
    case "en-us" :
        console.log("en-us "+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "AM",
                        "1": "PM"
                    },
                    "DAY": {
                        "0": "Sunday",
                        "1": "Monday",
                        "2": "Tuesday",
                        "3": "Wednesday",
                        "4": "Thursday",
                        "5": "Friday",
                        "6": "Saturday"
                    },
                    "MONTH": {
                        "0": "January",
                        "1": "February",
                        "2": "March",
                        "3": "April",
                        "4": "May",
                        "5": "June",
                        "6": "July",
                        "7": "August",
                        "8": "September",
                        "9": "October",
                        "10": "November",
                        "11": "December"
                    },
                    "SHORTDAY": {
                        "0": "Sun",
                        "1": "Mon",
                        "2": "Tue",
                        "3": "Wed",
                        "4": "Thu",
                        "5": "Fri",
                        "6": "Sat"
                    },
                    "SHORTMONTH": {
                        "0": "Jan",
                        "1": "Feb",
                        "2": "Mar",
                        "3": "Apr",
                        "4": "May",
                        "5": "Jun",
                        "6": "Jul",
                        "7": "Aug",
                        "8": "Sep",
                        "9": "Oct",
                        "10": "Nov",
                        "11": "Dec"
                    },
                    "fullDate": "EEEE, MMMM d, y",
                    "longDate": "MMMM d, y",
                    "medium": "MMM d, y h:mm:ss a",
                    "mediumDate": "MMM d, y",
                    "mediumTime": "h:mm:ss a",
                    "short": "M/d/yy h:mm a",
                    "shortDate": "M/d/yy",
                    "shortTime": "h:mm a"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "$",
                    "DECIMAL_SEP": ".",
                    "GROUP_SEP": ",",
                    "PATTERNS": {
                        "0": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "(\u00a4",
                            "negSuf": ")",
                            "posPre": "\u00a4",
                            "posSuf": ""
                        }
                    }
                },
                "id": "en-us",
                "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
    break;
    case "en-au" :
        console.log("en-au "+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "AM",
                        "1": "PM"
                    },
                    "DAY": {
                        "0": "Sunday",
                        "1": "Monday",
                        "2": "Tuesday",
                        "3": "Wednesday",
                        "4": "Thursday",
                        "5": "Friday",
                        "6": "Saturday"
                    },
                    "MONTH": {
                        "0": "January",
                        "1": "February",
                        "2": "March",
                        "3": "April",
                        "4": "May",
                        "5": "June",
                        "6": "July",
                        "7": "August",
                        "8": "September",
                        "9": "October",
                        "10": "November",
                        "11": "December"
                    },
                    "SHORTDAY": {
                        "0": "Sun",
                        "1": "Mon",
                        "2": "Tue",
                        "3": "Wed",
                        "4": "Thu",
                        "5": "Fri",
                        "6": "Sat"
                    },
                    "SHORTMONTH": {
                        "0": "Jan",
                        "1": "Feb",
                        "2": "Mar",
                        "3": "Apr",
                        "4": "May",
                        "5": "Jun",
                        "6": "Jul",
                        "7": "Aug",
                        "8": "Sep",
                        "9": "Oct",
                        "10": "Nov",
                        "11": "Dec"
                    },
                    "fullDate": "EEEE, d MMMM y",
                    "longDate": "d MMMM y",
                    "medium": "dd/MM/yyyy h:mm:ss a",
                    "mediumDate": "dd/MM/yyyy",
                    "mediumTime": "h:mm:ss a",
                    "short": "d/MM/yy h:mm a",
                    "shortDate": "d/MM/yy",
                    "shortTime": "h:mm a"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "$",
                    "DECIMAL_SEP": ".",
                    "GROUP_SEP": ",",
                    "PATTERNS": {
                        "0": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "(\u00a4",
                            "negSuf": ")",
                            "posPre": "\u00a4",
                            "posSuf": ""
                        }
                    }
                },
                "id": "en-au",
                "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
    break;
    case "en-gb" :
        console.log("en-gb "+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "AM",
                        "1": "PM"
                    },
                    "DAY": {
                        "0": "Sunday",
                        "1": "Monday",
                        "2": "Tuesday",
                        "3": "Wednesday",
                        "4": "Thursday",
                        "5": "Friday",
                        "6": "Saturday"
                    },
                    "MONTH": {
                        "0": "January",
                        "1": "February",
                        "2": "March",
                        "3": "April",
                        "4": "May",
                        "5": "June",
                        "6": "July",
                        "7": "August",
                        "8": "September",
                        "9": "October",
                        "10": "November",
                        "11": "December"
                    },
                    "SHORTDAY": {
                        "0": "Sun",
                        "1": "Mon",
                        "2": "Tue",
                        "3": "Wed",
                        "4": "Thu",
                        "5": "Fri",
                        "6": "Sat"
                    },
                    "SHORTMONTH": {
                        "0": "Jan",
                        "1": "Feb",
                        "2": "Mar",
                        "3": "Apr",
                        "4": "May",
                        "5": "Jun",
                        "6": "Jul",
                        "7": "Aug",
                        "8": "Sep",
                        "9": "Oct",
                        "10": "Nov",
                        "11": "Dec"
                    },
                    "fullDate": "EEEE, d MMMM y",
                    "longDate": "d MMMM y",
                    "medium": "d MMM y HH:mm:ss",
                    "mediumDate": "d MMM y",
                    "mediumTime": "HH:mm:ss",
                    "short": "dd/MM/yyyy HH:mm",
                    "shortDate": "dd/MM/yyyy",
                    "shortTime": "HH:mm"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "\u00a3",
                    "DECIMAL_SEP": ".",
                    "GROUP_SEP": ",",
                    "PATTERNS": {
                        "0": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "\u00a4-",
                            "negSuf": "",
                            "posPre": "\u00a4",
                            "posSuf": ""
                        }
                    }
                },
                "id": "en-gb",
                "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
        break;
    case "en-ie" :
        console.log("en-ie "+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "a.m.",
                        "1": "p.m."
                    },
                    "DAY": {
                        "0": "Sunday",
                        "1": "Monday",
                        "2": "Tuesday",
                        "3": "Wednesday",
                        "4": "Thursday",
                        "5": "Friday",
                        "6": "Saturday"
                    },
                    "MONTH": {
                        "0": "January",
                        "1": "February",
                        "2": "March",
                        "3": "April",
                        "4": "May",
                        "5": "June",
                        "6": "July",
                        "7": "August",
                        "8": "September",
                        "9": "October",
                        "10": "November",
                        "11": "December"
                    },
                    "SHORTDAY": {
                        "0": "Sun",
                        "1": "Mon",
                        "2": "Tue",
                        "3": "Wed",
                        "4": "Thu",
                        "5": "Fri",
                        "6": "Sat"
                    },
                    "SHORTMONTH": {
                        "0": "Jan",
                        "1": "Feb",
                        "2": "Mar",
                        "3": "Apr",
                        "4": "May",
                        "5": "Jun",
                        "6": "Jul",
                        "7": "Aug",
                        "8": "Sep",
                        "9": "Oct",
                        "10": "Nov",
                        "11": "Dec"
                    },
                    "fullDate": "EEEE d MMMM y",
                    "longDate": "d MMMM y",
                    "medium": "d MMM y h:mm:ss a",
                    "mediumDate": "d MMM y",
                    "mediumTime": "h:mm:ss a",
                    "short": "dd/MM/yyyy h:mm a",
                    "shortDate": "dd/MM/yyyy",
                    "shortTime": "h:mm a"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "\u20ac",
                    "DECIMAL_SEP": ".",
                    "GROUP_SEP": ",",
                    "PATTERNS": {
                        "0": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "(\u00a4",
                            "negSuf": ")",
                            "posPre": "\u00a4",
                            "posSuf": ""
                        }
                    }
                },
                "id": "en-ie",
                "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
        break;
    case "en-in" :
        console.log("en-in "+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "AM",
                        "1": "PM"
                    },
                    "DAY": {
                        "0": "Sunday",
                        "1": "Monday",
                        "2": "Tuesday",
                        "3": "Wednesday",
                        "4": "Thursday",
                        "5": "Friday",
                        "6": "Saturday"
                    },
                    "MONTH": {
                        "0": "January",
                        "1": "February",
                        "2": "March",
                        "3": "April",
                        "4": "May",
                        "5": "June",
                        "6": "July",
                        "7": "August",
                        "8": "September",
                        "9": "October",
                        "10": "November",
                        "11": "December"
                    },
                    "SHORTDAY": {
                        "0": "Sun",
                        "1": "Mon",
                        "2": "Tue",
                        "3": "Wed",
                        "4": "Thu",
                        "5": "Fri",
                        "6": "Sat"
                    },
                    "SHORTMONTH": {
                        "0": "Jan",
                        "1": "Feb",
                        "2": "Mar",
                        "3": "Apr",
                        "4": "May",
                        "5": "Jun",
                        "6": "Jul",
                        "7": "Aug",
                        "8": "Sep",
                        "9": "Oct",
                        "10": "Nov",
                        "11": "Dec"
                    },
                    "fullDate": "EEEE d MMMM y",
                    "longDate": "d MMMM y",
                    "medium": "dd-MMM-y h:mm:ss a",
                    "mediumDate": "dd-MMM-y",
                    "mediumTime": "h:mm:ss a",
                    "short": "dd/MM/yy h:mm a",
                    "shortDate": "dd/MM/yy",
                    "shortTime": "h:mm a"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "\u20b9",
                    "DECIMAL_SEP": ".",
                    "GROUP_SEP": ",",
                    "PATTERNS": {
                        "0": {
                            "gSize": 2,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 2,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "\u00a4\u00a0-",
                            "negSuf": "",
                            "posPre": "\u00a4\u00a0",
                            "posSuf": ""
                        }
                    }
                },
                "id": "en-in",
                "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
        break;
    case "en" :
        console.log("en "+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "AM",
                        "1": "PM"
                    },
                    "DAY": {
                        "0": "Sunday",
                        "1": "Monday",
                        "2": "Tuesday",
                        "3": "Wednesday",
                        "4": "Thursday",
                        "5": "Friday",
                        "6": "Saturday"
                    },
                    "MONTH": {
                        "0": "January",
                        "1": "February",
                        "2": "March",
                        "3": "April",
                        "4": "May",
                        "5": "June",
                        "6": "July",
                        "7": "August",
                        "8": "September",
                        "9": "October",
                        "10": "November",
                        "11": "December"
                    },
                    "SHORTDAY": {
                        "0": "Sun",
                        "1": "Mon",
                        "2": "Tue",
                        "3": "Wed",
                        "4": "Thu",
                        "5": "Fri",
                        "6": "Sat"
                    },
                    "SHORTMONTH": {
                        "0": "Jan",
                        "1": "Feb",
                        "2": "Mar",
                        "3": "Apr",
                        "4": "May",
                        "5": "Jun",
                        "6": "Jul",
                        "7": "Aug",
                        "8": "Sep",
                        "9": "Oct",
                        "10": "Nov",
                        "11": "Dec"
                    },
                    "fullDate": "EEEE, MMMM d, y",
                    "longDate": "MMMM d, y",
                    "medium": "MMM d, y h:mm:ss a",
                    "mediumDate": "MMM d, y",
                    "mediumTime": "h:mm:ss a",
                    "short": "M/d/yy h:mm a",
                    "shortDate": "M/d/yy",
                    "shortTime": "h:mm a"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "$",
                    "DECIMAL_SEP": ".",
                    "GROUP_SEP": ",",
                    "PATTERNS": {
                        "0": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "(\u00a4",
                            "negSuf": ")",
                            "posPre": "\u00a4",
                            "posSuf": ""
                        }
                    }
                },
                "id": "en-us",
                "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
        break;
    case "fr" :
        console.log("fr"+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "AM",
                        "1": "PM"
                    },
                    "DAY": {
                        "0": "dimanche",
                        "1": "lundi",
                        "2": "mardi",
                        "3": "mercredi",
                        "4": "jeudi",
                        "5": "vendredi",
                        "6": "samedi"
                    },
                    "MONTH": {
                        "0": "janvier",
                        "1": "f\u00e9vrier",
                        "2": "mars",
                        "3": "avril",
                        "4": "mai",
                        "5": "juin",
                        "6": "juillet",
                        "7": "ao\u00fbt",
                        "8": "septembre",
                        "9": "octobre",
                        "10": "novembre",
                        "11": "d\u00e9cembre"
                    },
                    "SHORTDAY": {
                        "0": "dim.",
                        "1": "lun.",
                        "2": "mar.",
                        "3": "mer.",
                        "4": "jeu.",
                        "5": "ven.",
                        "6": "sam."
                    },
                    "SHORTMONTH": {
                        "0": "janv.",
                        "1": "f\u00e9vr.",
                        "2": "mars",
                        "3": "avr.",
                        "4": "mai",
                        "5": "juin",
                        "6": "juil.",
                        "7": "ao\u00fbt",
                        "8": "sept.",
                        "9": "oct.",
                        "10": "nov.",
                        "11": "d\u00e9c."
                    },
                    "fullDate": "EEEE d MMMM y",
                    "longDate": "d MMMM y",
                    "medium": "d MMM y HH:mm:ss",
                    "mediumDate": "d MMM y",
                    "mediumTime": "HH:mm:ss",
                    "short": "dd/MM/yy HH:mm",
                    "shortDate": "dd/MM/yy",
                    "shortTime": "HH:mm"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "\u20ac",
                    "DECIMAL_SEP": ",",
                    "GROUP_SEP": "\u00a0",
                    "PATTERNS": {
                        "0": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "(",
                            "negSuf": "\u00a0\u00a4)",
                            "posPre": "",
                            "posSuf": "\u00a0\u00a4"
                        }
                    }
                },
                "id": "fr",
                "pluralCat": function (n) {  if (n >= 0 && n <= 2 && n != 2) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
        break;
    case "fr-ca" :
        console.log("fr-ca "+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "AM",
                        "1": "PM"
                    },
                    "DAY": {
                        "0": "dimanche",
                        "1": "lundi",
                        "2": "mardi",
                        "3": "mercredi",
                        "4": "jeudi",
                        "5": "vendredi",
                        "6": "samedi"
                    },
                    "MONTH": {
                        "0": "janvier",
                        "1": "f\u00e9vrier",
                        "2": "mars",
                        "3": "avril",
                        "4": "mai",
                        "5": "juin",
                        "6": "juillet",
                        "7": "ao\u00fbt",
                        "8": "septembre",
                        "9": "octobre",
                        "10": "novembre",
                        "11": "d\u00e9cembre"
                    },
                    "SHORTDAY": {
                        "0": "dim.",
                        "1": "lun.",
                        "2": "mar.",
                        "3": "mer.",
                        "4": "jeu.",
                        "5": "ven.",
                        "6": "sam."
                    },
                    "SHORTMONTH": {
                        "0": "janv.",
                        "1": "f\u00e9vr.",
                        "2": "mars",
                        "3": "avr.",
                        "4": "mai",
                        "5": "juin",
                        "6": "juil.",
                        "7": "ao\u00fbt",
                        "8": "sept.",
                        "9": "oct.",
                        "10": "nov.",
                        "11": "d\u00e9c."
                    },
                    "fullDate": "EEEE d MMMM y",
                    "longDate": "d MMMM y",
                    "medium": "yyyy-MM-dd HH:mm:ss",
                    "mediumDate": "yyyy-MM-dd",
                    "mediumTime": "HH:mm:ss",
                    "short": "yy-MM-dd HH:mm",
                    "shortDate": "yy-MM-dd",
                    "shortTime": "HH:mm"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "$",
                    "DECIMAL_SEP": ",",
                    "GROUP_SEP": "\u00a0",
                    "PATTERNS": {
                        "0": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "(",
                            "negSuf": "\u00a0\u00a4)",
                            "posPre": "",
                            "posSuf": "\u00a0\u00a4"
                        }
                    }
                },
                "id": "fr-ca",
                "pluralCat": function (n) {  if (n >= 0 && n <= 2 && n != 2) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
        break;
    case "pt" :
        console.log("pt"+locale);
        angular.module("ngLocale", [], ["$provide", function($provide) {
            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
            $provide.value("$locale", {
                "DATETIME_FORMATS": {
                    "AMPMS": {
                        "0": "AM",
                        "1": "PM"
                    },
                    "DAY": {
                        "0": "domingo",
                        "1": "segunda-feira",
                        "2": "ter\u00e7a-feira",
                        "3": "quarta-feira",
                        "4": "quinta-feira",
                        "5": "sexta-feira",
                        "6": "s\u00e1bado"
                    },
                    "MONTH": {
                        "0": "janeiro",
                        "1": "fevereiro",
                        "2": "mar\u00e7o",
                        "3": "abril",
                        "4": "maio",
                        "5": "junho",
                        "6": "julho",
                        "7": "agosto",
                        "8": "setembro",
                        "9": "outubro",
                        "10": "novembro",
                        "11": "dezembro"
                    },
                    "SHORTDAY": {
                        "0": "dom",
                        "1": "seg",
                        "2": "ter",
                        "3": "qua",
                        "4": "qui",
                        "5": "sex",
                        "6": "s\u00e1b"
                    },
                    "SHORTMONTH": {
                        "0": "jan",
                        "1": "fev",
                        "2": "mar",
                        "3": "abr",
                        "4": "mai",
                        "5": "jun",
                        "6": "jul",
                        "7": "ago",
                        "8": "set",
                        "9": "out",
                        "10": "nov",
                        "11": "dez"
                    },
                    "fullDate": "EEEE, d 'de' MMMM 'de' y",
                    "longDate": "d 'de' MMMM 'de' y",
                    "medium": "dd/MM/yyyy HH:mm:ss",
                    "mediumDate": "dd/MM/yyyy",
                    "mediumTime": "HH:mm:ss",
                    "short": "dd/MM/yy HH:mm",
                    "shortDate": "dd/MM/yy",
                    "shortTime": "HH:mm"
                },
                "NUMBER_FORMATS": {
                    "CURRENCY_SYM": "R$",
                    "DECIMAL_SEP": ",",
                    "GROUP_SEP": ".",
                    "PATTERNS": {
                        "0": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 3,
                            "minFrac": 0,
                            "minInt": 1,
                            "negPre": "-",
                            "negSuf": "",
                            "posPre": "",
                            "posSuf": ""
                        },
                        "1": {
                            "gSize": 3,
                            "lgSize": 3,
                            "macFrac": 0,
                            "maxFrac": 2,
                            "minFrac": 2,
                            "minInt": 1,
                            "negPre": "(\u00a4",
                            "negSuf": ")",
                            "posPre": "\u00a4",
                            "posSuf": ""
                        }
                    }
                },
                "id": "pt",
                "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });
        }]);
        break;
}