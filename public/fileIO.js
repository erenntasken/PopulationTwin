import fs from "fs";

var obj = {
    table: []
};

obj.table.push({Name: "Dummy", Population:0});
var json = JSON.stringify(obj);
fs.writeFileSync("data/dummy.json", json)