/** @jsx createElement */

const visit = require('unist-util-visit')
const {createElement, replace} = require('./helpers')

module.exports = ({markdownAST}, options = {}) => {
	visit(markdownAST, 'image', node => {
		if(!node.alt) return;

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
