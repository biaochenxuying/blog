import * as shell from 'shelljs';

shell.cp('-R', 'public', 'dist');
shell.cp('-R', 'views', 'dist');