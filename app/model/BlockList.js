var BlockList = function(mName, url, mEvaluator) {
  let name = mName;
  let evaluator = mEvaluator;

  fetch(url)
    .then((res) => res.text())
    .then((list) => evaluator.parser().parse(list));

  return {
    isLabeled: (r) => Object.assign(evaluator.isLabeled(r), {blocklist: name}),
  };
};