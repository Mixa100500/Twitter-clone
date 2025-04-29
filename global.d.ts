// declare module '*.svg' {
//   const content: string;
//   export default content;
// }

declare module '*.svg' {
  type SvgUrl = string & { __brand: 'svg'};
  const src: SvgUrl;
  export default src;
}
