/* eslint-disable consistent-return */
/* eslint-disable default-case */

import rdl from 'readline';

const l = console.log;
const {
  stdout,
  stdin,
  stderr,
} = process;

const colors = {
  yellow: [33, 89],
  blue: [34, 89],
  green: [32, 89],
  cyan: [35, 89],
  red: [31, 89],
  magenta: [36, 89],
  reset: [0, 0],
};

type ctor = {
  question: string
  options: string[]
  answers: string[]
  pointer?: string
  optColor?: keyof typeof colors
  textColor?: keyof typeof colors
  cb?: (ans: string) => void
}

class Select {
  private question: ctor['question']
  options: ctor['options']
  answers: ctor['answers']
  private pointer: ctor['pointer']
  private optColor: ctor['optColor']
  private textColor: ctor['textColor']
  private input?: number;
  private cursorLocs: {
    x: number,
    y: number,
  }
  private cb: ctor['cb']

  constructor({
    question = '',
    options = [],
    answers = [],
    pointer = '>',
    optColor = 'blue',
    textColor = 'reset',
    cb = (ans) => { console.log(this.color(`You selected: ${ans}`, this.textColor)); },
  }: ctor) {
    if (question.length <= 0) { throw Error("There must be a 'question'"); }
    if (options.length <= 0) { throw Error("There must be 'options'"); }
    if (answers.length <= 0) { throw Error("There must be 'answers'"); }
    if (options.length !== answers.length) { throw Error("'answers' and 'options' must be of the same length"); }

    this.question = question;
    this.options = options;
    this.answers = answers;
    this.pointer = pointer;
    this.optColor = optColor;
    this.textColor = textColor;
    this.input = undefined;
    this.cursorLocs = {
      x: 0,
      y: 0,
    };
    this.cb = cb;
  }

  start(): void {
    rdl.cursorTo(process.stdout, 0, 0);
    rdl.clearScreenDown(process.stdout);
    stdout.write(this.color(`${this.question}\n`, this.textColor));
    for (let opt = 0; opt < this.options.length; opt++) {
      this.options[opt] = `${this.pointer} ${this.options[opt]}`;
      if (opt === 0) {
        this.input = this.options.length - 1;
        this.options[opt] += '\n';
        stdout.write(this.color(this.options[opt], this.optColor));
      } else {
        this.options[opt] += '\n';
        stdout.write(this.color(this.options[opt], this.textColor));
      }
      this.cursorLocs.y = 1;
    }

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf-8');
    this.hideCursor();
    stdin.on('data', this.pn(this));
  }

  pn(self: this) {
    return (c: string): any => {
      switch (c) {
        case '\u0004': // Ctrl-d
        case '\r':
        case '\n':
          return self.enter();
        case '\u0003': // Ctrl-c
          return self.ctrlc();
        case '\u001b[A':
          return self.upArrow();
        case '\u001b[B':
          return self.downArrow();
      }
    };
  }

  enter(): void {
    stdin.removeListener('data', this.pn);
    stdin.setRawMode(false);
    stdin.pause();
    this.showCursor();
    // rdl.cursorTo(stdout, 0, this.options.length + 1);

    rdl.cursorTo(process.stdout, 0, 0);
    rdl.clearScreenDown(process.stdout);
    // @ts-ignore
    const ans = this.answers[this.input] as string;
    this.answers = [];
    this.options = [];
    this.input = undefined;
    // @ts-ignore
    this.cb(ans);
  }

  ctrlc(): void {
    stdin.removeListener('data', this.pn);
    stdin.setRawMode(false);
    stdin.pause();
    this.showCursor();
  }

  upArrow(): void {
    let { y } = this.cursorLocs;
    rdl.cursorTo(stdout, 0, y);
    stdout.write(this.color(this.options[y - 1], this.textColor));
    // l(y)
    // l(opts[y - 1])
    if (this.cursorLocs.y === 1) {
      this.cursorLocs.y = this.options.length;
    } else {
      this.cursorLocs.y--;
    }
    y = this.cursorLocs.y;
    rdl.cursorTo(stdout, 0, y);
    stdout.write(this.color(this.options[y - 1], this.optColor));
    this.input = y - 1;
  }

  downArrow(): void {
    let { y } = this.cursorLocs;
    rdl.cursorTo(stdout, 0, y);
    stdout.write(this.color(this.options[y - 1], this.textColor));
    // l(y)
    // l(opts[y - 1])
    if (this.cursorLocs.y === this.options.length) {
      this.cursorLocs.y = 1;
    } else {
      this.cursorLocs.y++;
    }
    y = this.cursorLocs.y;
    rdl.cursorTo(stdout, 0, y);
    stdout.write(this.color(this.options[y - 1], this.optColor));
    this.input = y - 1;
  }
  hideCursor(): void {
    stdout.write('\x1B[?25l');
  }

  showCursor(): void {
    stdout.write('\x1B[?25h');
  }

  color(str: string, colorName: keyof typeof colors = 'yellow'): string {
    const _color = colors[colorName];
    const start = `\x1b[${_color[0]}m`;
    const stop = `\x1b[${_color[1]}m\x1b[0m`;
    return start + str + stop;
  }
}

export default Select;
