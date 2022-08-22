import babel from '@rollup/plugin-babel';
import rollupTypescript  from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.ts',
  output: [{
    format: 'umd',
    name: 'TLS_Browser',
    file: './dist/umd/index.js'
  }, {
    format: 'iife',
    name: 'TLS_Browser',
    file: './dist/tls_browser.js'
  }],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    commonjs({ extensions: ['.js', '.ts'] }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    } ),
    rollupTypescript({
      tsconfig: './tsconfig.json',
    }),
    terser(),
  ]
}
