const path = require(`path`);

module.exports = {
  webpack: {
    extensions: ['.ts'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/hooks/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@components(.*)$': '<rootDir>/src/components$1',
        '^@features(.*)$': '<rootDir>/src/features$1',
        '^@hooks(.*)$': '<rootDir>/src/hooks$1',
        '^@pages(.*)$': '<rootDir>/src/pages$1',
        '^@services(.*)$': '<rootDir>/src/hooks/services$1',
        '^@utils(.*)$': '<rootDir>/src/utils$1',
      },
    },
  },
};
