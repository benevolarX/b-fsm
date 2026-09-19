import { fsm } from "./";

type StatesNames = "main" | "options" | "game";
type EventsNames = "play" | "opt" | "back";

const { state, transition, createMachine, interpret } = fsm<
  StatesNames,
  EventsNames
>();

const machine = createMachine({
  id: "app",
  init: "main",
  states: {
    main: state(
      transition({ to: "game", by: "play" }),
      transition({ to: "options", by: "opt" })
    ),
    options: state(transition({ to: "main", by: "back" })),
    game: state(),
  },
});

const service = interpret(machine);
service.send("back");
service.send("opt");
service.send("back");
service.send("play");
