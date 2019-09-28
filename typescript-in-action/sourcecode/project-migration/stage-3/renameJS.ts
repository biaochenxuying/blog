import * as shelljs from 'shelljs';

shelljs.find('src')
.filter(file => file.match(/\.jsx?$/))
.forEach(file => {
    let newName = file.replace(/\.j(sx?)$/, '.t$1');
    shelljs.mv(file, newName);
});