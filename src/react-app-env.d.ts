/// <reference types="react-scripts" />

declare module "*.css";
declare module "*.less";

declare module "*.hbs" {
  const content: string;
  export default content;
}
