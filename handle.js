const url = require('url')
const qs = require('querystring')
module.exports = {
  serverHandle: function (req, res) {
    const route = url.parse(req.url)
    const path = route.pathname
    const params = qs.parse(route.query)
    if (path === '/hello' && 'name' in params) {
      if(params['name'] === 'benjamin'){
        content = '<!DOCTYPE html>' +
                    '<html>' +
                    '    <head>' +
                    '        <meta charset="utf-8" />' +
                    '        <title>ECE AST</title>' +
                    '    </head>' +
                    '    <body>' +
                    '         <p>Hello I am benjamin, I study in ECE Paris in 5th year and I am currently working on the asynchronus server technologie lab.</p>' +
                    '         <p>I am 22 and I live in France.</p>' +
                    '    </body>' +
                    '</html>';
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(content);
      }
      else{
        content = "Hello " + params['name'];
        res.write(content)
      }
    } else if(path==='/'){
      content = '<!DOCTYPE html>' +
                  '<html>' +
                  '    <head>' +
                  '        <meta charset="utf-8" />' +
                  '        <title>ECE AST</title>' +
                  '    </head>' +
                  '    <body>' +
                  '         <p>try url /hello with a name parameter.</p>' +
                  '         <p>for example try : /hello?name=julien </p>' +
                  '         <p>you can also try my name as a name parameter which is benjamin</p>' +
                  '    </body>' +
                  '</html>';
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(content);
    }
    else if(path === '/hello'){
      content = '<!DOCTYPE html>' +
                  '<html>' +
                  '    <head>' +
                  '        <meta charset="utf-8" />' +
                  '        <title>ECE AST</title>' +
                  '    </head>' +
                  '    <body>' +
                  '         <p>Hello anonymous.</p>' +
                  '    </body>' +
                  '</html>';
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(content);
    }
    else{
      content = '<!DOCTYPE html>' +
                  '<html>' +
                  '    <head>' +
                  '        <meta charset="utf-8" />' +
                  '        <title>ECE AST</title>' +
                  '    </head>' +
                  '    <body>' +
                  '         <p>Error: page not found</p>' +
                  '    </body>' +
                  '</html>';
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.write(content);
    }

    res.end();
  }
}
