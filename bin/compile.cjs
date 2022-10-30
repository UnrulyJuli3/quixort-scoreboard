const fs = require("node:fs");

const input = fs.readFileSync("quixortforevernamelist.txt", "utf-8");
const output = input.split(/\r\n|\n/g).map(l => {
    const res = /^(\d+) (.+?)$/.exec(l);
    return { name: res[2], score: parseInt(res[1]) };
}).sort((a, b) => b.score - a.score);

fs.writeFileSync("scores.json", JSON.stringify(output), "utf-8");