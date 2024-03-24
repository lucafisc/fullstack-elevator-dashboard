// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      },
    },
    testEnvironment: 'jsdom',
  };
  