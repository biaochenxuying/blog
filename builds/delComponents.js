// delComponents.js
const fs = require("fs");
const findMarkdown = require("./findMarkdown");
const rootDir = "./docs";

findMarkdown(rootDir, delComponents);

function delComponents(dir) {
    fs.readFile(dir, "utf-8", (err, content) => {
        if (err) throw err;

        fs.writeFile(
            dir,
            content.replace(/\n \n <comment\/> \n /g, ""),
            err => {
                if (err) throw err;
                console.log(`del components from ${dir}`);
            }
        );
    });
}
