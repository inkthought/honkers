import Event from "../struct/Event";

abstract class ReadyEvent extends Event {
  constructor() {
    super({
      name: "ready",
      once: true,
    });
  }

  async exec() {
    console.log("[Bot] Ready!");
  }
}

export default ReadyEvent;
