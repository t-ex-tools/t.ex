const L = Labeler.default;

var Blocklists = [{
  name: "EasyList",
  version: "latest",
  url: "https://easylist.to/easylist/easylist.txt",
  active: true,
  evaluator: L.AdBlockEvaluator(L.AdBlockParser),
}, {
  name: "EasyPrivacy",
  version: "latest",
  url: "https://easylist.to/easylist/easyprivacy.txt",
  active: true,
  evaluator: L.AdBlockEvaluator(L.AdBlockParser),
}, {
  name: "Disconnect.me",
  version: "latest",
  url: "https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json",
  active: false,
  evaluator: L.DisconnectMeEvaluator(L.DisconnectMeParser),
}];