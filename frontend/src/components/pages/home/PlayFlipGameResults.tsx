import ButtonWithText from "src/components/buttons/ButtonWithText";
import PlayFlipGameGeneric from "src/components/pages/home/PlayFlipGameGeneric";
import Header1 from "src/components/text/Header1";
import ButtonTheme from "src/types/enums/ButtonTheme";
import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";

export default function PlayFlipGameResults() {
  return (
    <PlayFlipGameGeneric rowGap={36}>
      <Header1
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        You Won!
      </Header1>
      <ButtonWithText
        buttonTheme={ButtonTheme.Yellow}
        fontClass={FontClass.Header1}
        style={{ width: 300 }}
        textTransform="uppercase"
        width="100%"
      >
        Again!!!
      </ButtonWithText>
    </PlayFlipGameGeneric>
  );
}
