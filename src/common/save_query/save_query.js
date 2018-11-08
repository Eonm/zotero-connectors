let confing_url = {
  "(www\.)?sudoc\.abes\.fr//DB=" : () => {
    let query_table = document.getElementsByTagName("table")[0]; // This have to be the ID of your table, not the tag
    let rows = query_table.getElementsByTagName("tr");
    return Array.from(rows).map(function(columns) {
      return Array.from(columns.getElementsByTagName("td")).map(elem => elem.innerHTML)
        .join(" ")
        .replace(/<span.*/g, "")
        .replace(/élargir/g, "OR")
        .replace(/restreindre/g, "AND")
        .trim();
    }).join(" ").replace(/rechercher \([a-z]+\) /, "");
  },
  "^http(s)?:\/\/(www\.)?persee\.fr" : "q",
  "^http(s)?:\/\/eds\..\.ebscohost\.com\/eds\/results" : "bquery", //() => document.getElementById('SearchTerm1').value,
  "^http(s)?:\/\/scholar\.google\.([a-z]*?)\/scholar" : () => document.getElementById('gs_hdr_tsi').value,
  "^http(s)?:\/\/(www.)?cairn.info" : () => document.getElementById('compute_search_field').value,
  "^http(s)?:\/\/(www.)?jstor.org" : "Query",
  "^http(s)?:\/\/(www\.)?gallica\.bnf\.fr" : "query",//document.getElementById('motcle').value
  "^http(s)?:\/\/(www\.)?catalogue\.bnf\.fr\/rechercher" : "motRecherche",
  "^http(s)?:\/\/(www\.)?base-search\.net\/Search\/Results" : () => document.getElementById('Query').value,
  "^http(s)?:\/\/(www\.)?unr-ra\.scholarvox\.com" : "searchterm",
  "^http(s)?:\/\/(www\.)?erudit\.org\/[a-z]*?\/" : () => document.getElementsByClassName("search-query")[0].innerHTML.trim(),
  "^http(s)?:\/\/(www\.)?search\.crossref\.org\/.q": () => document.getElementById("search-input").value,
};

function retrieve_query (url) {
  let matching_config_keys = Object.keys(confing_url).filter(k => {
    let regex = new RegExp(k);
    return url.match(regex);
  });

  if ( matching_config_keys.len > 1 ) {
    console.debug("Warning : multiple matching config. Using the first one");
  }

  let first_matching_config_key = matching_config_keys[0];
  let value = confing_url[first_matching_config_key];
  if (typeof value === "string") {
    return save_query_from_url(value);
  } else {
    return value();
  }
}

function save_query_from_url(url_var) {
  let value = getUrlVars()[url_var];
  return value.replace(/\+/g, " ");
}


function getUrlVars() {
    var vars = {};
    var parts = decodeURI(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
