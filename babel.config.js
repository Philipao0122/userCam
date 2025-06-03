module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Agrega plugins adicionales si son necesarios
      'react-native-reanimated/plugin',
    ],
  };
};
