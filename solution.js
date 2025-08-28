const fs = require('fs');

function parseBigInt(str, base) {
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = 0n;
    const baseBigInt = BigInt(base);
    for (let i = 0; i < str.length; i++) {
        const digit = digits.indexOf(str[i].toLowerCase());
        if (digit === -1 || digit >= base) {
            throw new Error("Invalid character for the given base");
        }
        result = result * baseBigInt + BigInt(digit);
    }
    return result;
}

function solve() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Usage: node solve.js <json_file>");
        return;
    }

    const rawData = fs.readFileSync(filename);
    const data = JSON.parse(rawData);
    const k = data.keys.k;
    const points = [];

    for (const key in data) {
        if (points.length >= k) break;
        if (key === 'keys') continue;
        
        const x = parseInt(key, 10);
        const base = parseInt(data[key].base, 10);
        const value = data[key].value;
        const y = parseBigInt(value, base);
        points.push({ x, y });
    }

    let c = 0n;
    
    for (let j = 0; j < k; j++) {
        const y_j = points[j].y;
        
        let num = 1n;
        let den = 1n;

        for (let i = 0; i < k; i++) {
            if (i === j) continue;
            
            num *= BigInt(-points[i].x);
            den *= BigInt(points[j].x - points[i].x);
        }
        
        const l_j_at_0 = num / den;
        c += y_j * l_j_at_0;
    }
    
    console.log(`The secret constant c is: ${c}`);
}

solve();