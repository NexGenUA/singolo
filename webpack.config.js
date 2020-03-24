module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        loader: 'file-loader',
          options: { outputPath: 'fonts' },
      },
    ],
  }
}
