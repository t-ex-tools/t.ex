var Blocklists = [{
  name: "EasyList",
  version: "latest",
  url: "https://easylist.to/easylist/easylist.txt",
  type: "easylist",
  active: true,
  evaluator: EasyListEvaluator(EasyListParser)
}, {
  name: "EasyPrivacy",
  version: "latest",
  url: "https://easylist.to/easylist/easyprivacy.txt",
  type: "easylist",
  active: true,
  evaluator: EasyListEvaluator(EasyListParser)
}, {
  name: "Disconnect.me",
  version: "latest",
  url: "https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json",
  type: "disconnect",
  active: true,
  evaluator: DisconnectMeEvaluator(DisconnectMeParser)
}];