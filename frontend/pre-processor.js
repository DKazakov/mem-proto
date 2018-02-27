const sass = require('node-sass')

module.exports = (data, filename) => {
    console.log(filename);
  return sass.renderSync({
    data,
    file: filename,
    indentedSyntax: true,
    outputStyle: 'compressed'
  }).css.toString('utf8')
}
