const get = async (req, res, next) => {
  try{
    let content = '';
    let param = req.query;
    if(param && param.name && (param.name === 'benjamin' || param.name === 'Benjamin')){
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
    else if(param && param.name){
      content = "Hello " + param.name;
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
                  '         <p>Hello anonymous.</p>' +
                  '    </body>' +
                  '</html>';
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(content);
    }
  }catch (e){
      return next(e);
  }
  return res.status(200).json();
};

exports.get = get;
