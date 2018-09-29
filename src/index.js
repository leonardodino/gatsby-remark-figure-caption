/** @jsx createElement */

const visit = require('unist-util-visit')
const {createElement, replace} = require('./helpers')

module.exports = ({markdownAST}, options = {}) => {
	visit(markdownAST, 'image', node => {
		if(String(node.alt) === 'null') delete node.alt
		if(String(node.alt) === 'undefined') delete node.alt
		if(!node.alt) return delete node.alt

		replace(node).with(
			<unknown tagName='figure' className={options.figureClassName}>
				<image {...node} alt={null} className={options.imageClassName}/>
				<paragraph tagName='figcaption' className={options.captionClassName}>
					{node.alt}
				</paragraph>
			</unknown>
		)
	})
}
