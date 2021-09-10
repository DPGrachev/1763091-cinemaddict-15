
const calculateRuntime = (runtime) => {
  const hours = Math.floor(runtime/60);
  const minutes = runtime%60;
  return `${hours}h ${minutes}m`;
};

export {calculateRuntime};
