import Header0 from "src/components/text/Header0";
import ColorClass from "src/types/enums/ColorClass";

export default function HeaderLogo() {
  return (
    <Header0 textTransform="uppercase">
      <span className={ColorClass.Rust}>P</span>
      <span className={ColorClass.WinterGreen}>R</span>
      <span className={ColorClass.Yellow}>I</span>
      <span className={ColorClass.Rust}>V</span>
      <span className={ColorClass.Navy}>Y</span>
      {/* <span className={ColorClass.Yellow}>f</span>
      <span className={ColorClass.WinterGreen}>l</span>
      <span className={ColorClass.Navy}>p</span> */}
    </Header0>
  );
}
