const r = m => require.resolve(m)

module.exports = (api, options = {}) => {
  api && api.cache(false)
	const {debug = false} = options
	const {NODE_ENV, BABEL_ENV} = process.env
	const TEST = BABEL_ENV === 'test' || NODE_ENV === 'test'

	return {
		presets: [
			[r('@babel/preset-env'), {
				loose: true,
				debug: !!debug,
				useBuiltIns: 'entry',
				shippedProposals: true,
				modules: 'commonjs',
				targets: {node: 6.0},
			}],
		],
		plugins: [
      [r('@babel/plugin-proposal-optional-chaining'), {loose: true}],
      [r('@babel/plugin-transform-runtime')],
      [r('@babel/plugin-transform-react-jsx'), {useBuiltIns: true}],
		],
	}
}
