export default ctx => {
  const {
    useApp,
    useMobManager,
    useCleanup,
  } = ctx;
  const app = useApp();
  const mobManager = useMobManager();

  mobManager.addMobApp(app, srcUrl);

  useCleanup(() => {
    mobManager.removeMobApp(app);
  });

  return app;
};
export const contentId = ${this.contentId};
export const name = ${this.name};
export const description = ${this.description};
export const type = 'mob';
export const components = ${this.components};
export const srcUrl = ${this.srcUrl};
