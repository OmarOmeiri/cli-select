## USAGE

```ts
import Select from './select';

const stylingTypeSel = new Select({
  question: 'Which styling do you want?',
  options: ['CSS', 'SASS', 'SCSS', 'LESS'],
  answers: ['css', 'sass', 'scss', 'less'],
  pointer: '-',
  color: 'red',
  textColor: 'magenta',
});

stylingTypeSel.start();
```