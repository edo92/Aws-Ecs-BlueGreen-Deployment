declare module "*.json" {
   const value: typeof import("../config.json");
   export default value;
}
