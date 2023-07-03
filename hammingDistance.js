const getHammingDistance = (x,y) => {
    if ((x >= 0 && x < 231) && (y >= 0 && y < 231)) {
        let distance = 0;
        let val = x ^ y;
        while(val > 0){
            distance += val & 1;
            val = val >> 1;
        }
        return distance;
    } else return 0;
}

let x = parseInt(process.argv[2]);
let y = parseInt(process.argv[3]);

console.log('Output:',getHammingDistance(x,y))