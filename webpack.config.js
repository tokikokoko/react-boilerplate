const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';

const plugins = [
  new HtmlWebpackPlugin({
    template: "./static/index.html"
  }),
  new HotModuleReplacementPlugin(),
];
if (!devMode) {
  // enable in production only
  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css'
    }),
  );
}

console.log(devMode);

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",
  target: "web",
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: "./src/index.tsx",
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: "main.js"
  },
  devServer: {
    open: true,
    clientLogLevel: 'silent',
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
  },
  plugins,
  module: {
    rules: [
      {
        // 拡張子 .ts もしくは .tsx の場合
        test: /\.tsx?$/,
        // TypeScript をコンパイルする
        use: "ts-loader"
      },
      {
        test: /\.html$/,
        use: "html-loader"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  'postcss-preset-env',
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            }
          },
          'sass-loader',
        ],
      },
    ]
  },
  // import 文で .ts や .tsx ファイルを解決するため
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    extensions: [".ts", ".tsx", ".js", ".json", ".html"]
  },
};
