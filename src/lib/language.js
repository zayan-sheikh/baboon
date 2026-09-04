const EMOJIS = {
  zero: '0️⃣',
  one: '1️⃣',
  plus: '➕',
  dup2: '📝📝',
  runFunc: '🏃',
  startFunc: '🎬',
  endFunc: '🏁'
};

export class LanguageError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LanguageError';
  }
}

export class BaboonLanguage {
  constructor() {
    this.dataStack = [];
    this.controlStack = [];
    this.pendingCode = [];
    this.program = [];
    this.stateStack = [];
    this.runFunction = [];
  }

  doPose(poseName) {
    if (poseName === 'undo') {
      this.undo();
      return;
    }

    if (poseName === 'startFunc') {
      this.startFunction();
    } else if (poseName === 'endFunc') {
      this.endFunction();
    } else if (poseName === 'runFunc') {
      this.pendingCode.push(...this.runFunction);
    } else if (['zero', 'one', 'plus', 'dup2'].includes(poseName)) {
      this.pendingCode.push(poseName);
    } else {
      throw new Error(`Invalid pose: ${poseName}`);
    }

    if (this.controlStack.length === 0) {
      try {
        for (const operation of this.pendingCode) this.execute(operation);
      } catch (error) {
        this.pendingCode = [];
        throw error;
      }
      this.pendingCode = [];
    }

    this.program.push(poseName);
    this.saveState();
  }

  execute(operation) {
    if (operation === 'zero') {
      this.dataStack.push(0);
    } else if (operation === 'one') {
      this.dataStack.push(1);
    } else if (operation === 'plus') {
      if (this.dataStack.length < 2) {
        throw new LanguageError('plus requires two elements on stack');
      }
      const a = this.dataStack.pop();
      const b = this.dataStack.pop();
      this.dataStack.push(a + b);
    } else if (operation === 'dup2') {
      if (this.dataStack.length < 2) {
        throw new LanguageError('dup2 requires two elements on stack');
      }
      this.dataStack.push(this.dataStack.at(-2));
      this.dataStack.push(this.dataStack.at(-2));
    }
  }

  startFunction() {
    if (this.controlStack.length > 0) {
      throw new LanguageError('Function started inside control sequence');
    }
    this.controlStack.push('FUNCTION');
  }

  endFunction() {
    if (this.controlStack.at(-1) !== 'FUNCTION') {
      throw new LanguageError('Function ended without start');
    }
    this.controlStack.pop();
    this.runFunction = [...this.pendingCode];
    this.pendingCode = [];
  }

  undo() {
    if (this.stateStack.length === 1) {
      this.clear();
    } else if (this.stateStack.length === 0) {
      throw new LanguageError('Too early to undo');
    } else {
      this.stateStack.pop();
      const previousState = this.stateStack.at(-1);
      this.dataStack = [...previousState.dataStack];
      this.controlStack = [...previousState.controlStack];
      this.pendingCode = [...previousState.pendingCode];
      this.program = [...previousState.program];
    }
  }

  clear() {
    this.dataStack = [];
    this.controlStack = [];
    this.pendingCode = [];
    this.program = [];
    this.runFunction = [];
  }

  saveState() {
    this.stateStack.push({
      dataStack: [...this.dataStack],
      controlStack: [...this.controlStack],
      pendingCode: [...this.pendingCode],
      program: [...this.program]
    });
  }

  getState() {
    return {
      program_text: [...this.program],
      program_emojis: this.program.map((pose) => EMOJIS[pose]),
      stack: [...this.dataStack]
    };
  }
}
