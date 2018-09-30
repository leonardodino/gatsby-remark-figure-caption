require('object.entries/shim')() // gatsby supports node v6
const Remark = require('remark')
const toHAST = require('mdast-util-to-hast')
const find   = require('unist-util-find')
const hcheck = require('hast-util-assert')
const mcheck = require('mdast-util-assert')
const select = require('hast-util-select').selectAll
const strip  = require('unist-util-remove-position')
const render = require('unist-util-inspect')
const inputs = require('../fixtures/markdown')
const {name} = require('../package.json')
const plugin = require('.')
const remark = new Remark().data('settings', {
	commonmark: true, footnotes: true, pedantic: true,
})

const options = {
	figureClassName: 'wrapper',
	captionClassName: 'text',
	imageClassName: 'lqip',
}

expect.addSnapshotSerializer({
	test: tree => tree && tree.type === 'root',
	print: tree => render.noColor(tree),
})

const canon = ast => JSON.parse(JSON.stringify(strip(ast, true)))
const hasAlt = node => !!(node && node.properties && node.properties.alt)
const normal = ast => typeof ast === 'string' ? parse(ast) : ast
const parse  = string => canon(remark.parse((string)))
const convert = ast => canon(toHAST(normal(ast), {allowDangerousHTML: true}))
const transform = (markdownAST, options) => (
	typeof markdownAST === 'string'
		? transform(normal(markdownAST), options)
		: (plugin({markdownAST}, options), convert(markdownAST))
)

describe(name, () => {
	it('plugin exports a function', () => {
		expect(typeof plugin).toBe('function')
	})

	Object.entries(inputs).forEach(([description, string]) => {
		const before = convert(string)
		const result = transform(string)

		if(description === 'WITHOUT_ALT'){
			it(`noop on images without alt [${description}]`, () => {
				expect(before).toMatchObject(result)
			})
		}else{
			it(`removes all alt properties [${description}]`, () => {
				expect(find(before, hasAlt)).toBeDefined()
				expect(find(result, hasAlt)).toBeUndefined()
			})
		}
	})

	![inputs.KITCHEN_SINK, inputs.PARAGRAPHS, inputs.INLINE].forEach(markdown => {
		const mdast_basic = normal(markdown)
		const mdast_class = normal(markdown)
		it('snapshot: mdast_basic', () => expect(mdast_basic).toMatchSnapshot())
		it('snapshot: mdast_class', () => expect(mdast_basic).toMatchSnapshot())
		it('must be valid markdown AST', () => {
			expect(() => mcheck(hast_basic)).not.toThrow()
			expect(() => mcheck(hast_class)).not.toThrow()
		})

		const hast_basic = transform(mdast_basic)
		const hast_class = transform(mdast_class, options)
		it('must be valid html AST', () => {
			expect(() => hcheck(hast_basic)).not.toThrow()
			expect(() => hcheck(hast_class)).not.toThrow()
		})
		it('snapshot: hast_basic', () => expect(hast_basic).toMatchSnapshot())
		it('snapshot: hast_class', () => expect(hast_class).toMatchSnapshot())
	})

	test.each`
		key                       | count
		${'WITHOUT_ALT'}          |  ${0}
		${'WITH_ALT'}             |  ${1}
		${'INSIDE_BLOCKQUOTE'}    |  ${1}
		${'INLINE'}               |  ${1}
		${'KITCHEN_SINK'}         |  ${3}
		${'PARAGRAPHS'}           |  ${3}
	`('$key => $count transformations', ({key, count}) => {
		const mdast = normal(inputs[key])
		const hast = transform(mdast, options)
		const {figureClassName, captionClassName, imageClassName} = options
		expect(select(`figure.${figureClassName}`, hast)).toHaveLength(count)
		expect(select(`img.${imageClassName}`, hast)).toHaveLength(count)
		expect(select(`figcaption.${captionClassName}`, hast)).toHaveLength(count)
	})
})
