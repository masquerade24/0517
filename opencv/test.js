const spawn = require('child_process').spawn;

const process = spawn('python3', ['test.py']);

process.stdout.on('data', (data) => {
    console.log(data.toString());
});

process.stderr.on('data', (data) => {
    console.error(data.toString());
});