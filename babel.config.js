module.exports = (api) => {
  const isCj = api.env('cj');
  return {
    comments: false,
    presets: [
      ['@babel/preset-env', {
        modules: isCj ? 'commonjs' : false,
      }]
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
  }
};
