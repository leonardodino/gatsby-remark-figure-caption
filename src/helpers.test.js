const assert = require('mdast-util-assert')
const render = require('unist-util-inspect')
const {createElement, replace} = require('./helpers')

/** @jsx createElement */

expect.addSnapshotSerializer({
	test: tree => tree && Array.isArray(tree.children) && tree.type,
	print: tree => render.noColor(tree),
})

const KitchenSink = ({name = '', ...props}) => (
	<blockquote {...props}>
		<paragraph>wat</paragraph>
		<image className={''}/>
		{false && 'wont render'}{0}
		{undefined}{null}
		<image url='http://'/>
		{name.split('').map(letter => <paragraph>{letter}</paragraph>)}
	</blockquote>
)

describe('createElement', () => {
	it('renders custom component', () => {
		const mdast = <KitchenSink tagName='section' name='batman'/>
		expect(mdast).toMatchSnapshot()
		expect(() => assert(mdast)).not.toThrow()
	})
})

describe('replace(source).with(target)', () => {
	const source = {alt: 'lazy stuff'}, sourceBackup = {...source}
	const target = {tagName: 'figure'}, targetBackup = {...target}
	const result = replace(source).with(target)

	it('remove source props that arent in the target', () => {
		expect(source).toEqual({tagName: 'figure'})
	})

	it('should not mutate the target', () => {
		expect(target).toEqual(targetBackup)
	})

	it('should mutate the source', () => {
		expect(source).not.toEqual(sourceBackup)
	})

	it('should return undefined', () => {
		expect(result).toBeUndefined()
	})
})
