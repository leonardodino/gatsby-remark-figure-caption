require('array.prototype.flatmap/auto')
const omit = require('@babel/runtime/helpers/objectWithoutPropertiesLoose')
const id = x => x
const render = value => {
	const jsType = typeof value
	if(jsType === 'string') return createElement('text', {value})
	if(jsType === 'boolean') return null
	if(Array.isArray(value)) return value
	if(typeof value.type === 'function'){
		return render(value.type({...value, type: null}))
	}
	if(typeof value.type === 'string') return value
	return null
}

const toArray = input => Array.isArray(input) ? input : [input]
const flatRender = value => toArray(render(value))
const toChildrenArray = input => {
	const parsed = toArray(input).flatMap(flatRender).filter(id)
	return parsed.length ? parsed : undefined
}

const toClassNameArray = input => {
	if(Array.isArray(input)){
		const parsed = input.filter(x => x && typeof x === 'string')
		return parsed.length ? parsed : undefined
	}
	if(typeof input === 'string') return toClassNameArray(input.split(/\s+/))
	return undefined
}

const _ = object => JSON.parse(JSON.stringify(render(object)))

const createElement = (type, props, ...args) => _({
	...omit(props, ['className', 'tagName']), type,
	children: toChildrenArray(args),
	data: {
		hName: props?.tagName,
		hProperties: toClassNameArray(props?.className) && {
			className: toClassNameArray(props?.className),
	}},
})

const replace = source => ({with: target => {
	for(let property in source){
		if(!target.hasOwnProperty(property)) delete source[property]
	}
	Object.assign(source, target)
}})

module.exports = {createElement, replace}
