// export function createHooks(callback) {
//   const useState = (initState) => {
//     return [];
//   };

//   const useMemo = (fn, refs) => {
//     return fn();
//   };

//   const resetContext = () => {};

//   return { useState, useMemo, resetContext };
// }
export function createHooks(callback) {
  let states = [];
  let memos = [];
  let stateIndex = 0;
  let memoIndex = 0;
  let renderCallback = callback;

  const resetContext = () => {
    stateIndex = 0;
    memoIndex = 0;
  };

  const useState = (initState) => {
    const currentIndex = stateIndex;
    if (states[currentIndex] === undefined) {
      states[currentIndex] = initState;
    }

    const setState = (newState) => {
      if (states[currentIndex] !== newState) {
        states[currentIndex] = newState;
        resetContext();
        renderCallback();
      }
    };

    stateIndex++;
    return [states[currentIndex], setState];
  };

  const useMemo = (fn, deps) => {
    const currentMemo = memos[memoIndex];
    let hasChanged = true;

    if (currentMemo && currentMemo.deps) {
      hasChanged = deps.some((dep, i) => dep !== currentMemo.deps[i]);
    }

    if (hasChanged || !currentMemo) {
      const newValue = fn();
      memos[memoIndex] = { value: newValue, deps };
    }

    memoIndex++;
    return memos[memoIndex - 1].value;
  };

  // Wrap callback to manage re-render
  renderCallback = () => {
    resetContext(); // Reset context before each render
    return callback();
  };

  return { useState, useMemo, resetContext };
}
