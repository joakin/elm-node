module.exports = Elm => {
  const app = Elm.MainWithJs.init();
  app.ports.log && app.ports.log.subscribe(console.log);
};
