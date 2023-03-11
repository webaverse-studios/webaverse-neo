interface IInputCommand {
  name: string;
  triggers: string[];
}

interface IBindings {
  [command: string]: string[];
}

class PlayerInputManager {
  private commands: IInputCommand[] = [];
  private bindings: IBindings = {};
  private defaultBindings: IBindings = {
    jump: ["Space"],
    attack: ["Mouse0"],
  };

  constructor() {
    this.commands = [
      { name: "jump", triggers: [] },
      { name: "attack", triggers: [] },
    ];
    this.bindings = _.cloneDeep(this.defaultBindings);
  }

  public setBinding(command: string, triggers: string[]): void {
    if (!this.bindings[command]) {
      console.error(`Command ${command} does not exist`);
      return;
    }
    this.bindings[command] = triggers;
  }

  public addTrigger(command: string, trigger: string): void {
    if (!this.bindings[command]) {
      console.error(`Command ${command} does not exist`);
      return;
    }
    this.bindings[command].push(trigger);
  }

  public removeTrigger(command: string, trigger: string): void {
    if (!this.bindings[command]) {
      console.error(`Command ${command} does not exist`);
      return;
    }
    _.pull(this.bindings[command], trigger);
  }

  public handleInput(event: KeyboardEvent | MouseEvent): void {
    const trigger =
      (event as KeyboardEvent).code || `Mouse${(event as MouseEvent).button}`;
    this.commands.forEach((command) => {
      if (this.bindings[command.name].includes(trigger)) {
        this.fireEvent(command);
      }
    });
  }

  private fireEvent(command: IInputCommand): void {
    console.log(`Event fired: ${command.name}`);
    // TODO: fire event for this command
  }
}

// Example usage
const inputManager = new PlayerInputManager();
console.log(inputManager);
inputManager.addTrigger("jump", "KeyW");
console.log(inputManager);
inputManager.handleInput({ code: "KeyW" } as KeyboardEvent);

export { PlayerInputManager };
