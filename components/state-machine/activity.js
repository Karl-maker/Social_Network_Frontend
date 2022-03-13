import { createMachine } from "xstate";

const activityMachine = createMachine({
  id: "activity",
  initial: "clear",
  states: {
    like: {
      on: { LIKE: "clear", DISLIKE: "dislike" },
    },
    dislike: {
      on: { LIKE: "like", DISLIKE: "clear" },
    },
    clear: {
      on: { LIKE: "like", DISLIKE: "dislike" },
    },
  },
});

export default activityMachine;
