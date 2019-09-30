const http = require('http');
const fs = require('fs');


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  
	const readStream = fs.createReadStream('../html/zwplugin.html')
	// var shell = require('shelljs/global');
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	readStream.pipe(res)
	// res.end('Hello parthi\n');
  	
	// const shell = require('shelljs');

	// shell.echo('hello world');
	// const writer = shell.exec("cd /Users/parthi-4272/Office/Branch/Writer/WRITER_CONVERSION_QA_BRANCH/writer/;ls;hg pull");
});	


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// writer.exec('hgpull');



// mkdir('-p', 'out/Release');

// cd('/Users/parthi-4272/Office/Branch/Writer/WRITER_CONVERSION_QA_BRANCH/writer') 