export default function() {
  let data = {}

  return {
    put: (value) => (data[value])
      ? data[value]++
      : data[value] = 1,

    all: () => data,

    get: (value) => data[value]
  };
};