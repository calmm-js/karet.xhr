import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import {uglify} from 'rollup-plugin-uglify'

const globals = {
  'karet.lift': 'karet.lift',
  'karet.util': 'karet.util',
  'kefir.partial.lenses': 'kefir.partial.lenses',
  'partial.lenses': 'L',
  'partial.lenses.validation': 'V',
  infestines: 'I',
  kefir: 'Kefir'
}

const build = ({NODE_ENV, format, suffix}) => ({
  external: Object.keys(globals),
  input: 'src/karet.xhr.js',
  output: {
    globals,
    name: 'karet.xhr',
    format,
    file: `dist/karet.xhr.${suffix}`
  },
  plugins: [
    NODE_ENV && replace({'process.env.NODE_ENV': JSON.stringify(NODE_ENV)}),
    nodeResolve(),
    babel(),
    NODE_ENV === 'production' &&
      uglify({
        compress: {
          hoist_funs: true,
          passes: 3,
          pure_getters: true,
          pure_funcs: ['require']
        }
      })
  ].filter(x => x)
})

export default [
  build({format: 'cjs', suffix: 'cjs.js'}),
  build({format: 'es', suffix: 'es.js'}),
  build({format: 'umd', suffix: 'js', NODE_ENV: 'dev'}),
  build({format: 'umd', suffix: 'min.js', NODE_ENV: 'production'})
]
