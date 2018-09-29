const markdown = (strings, ...keys) => {
	const lastIndex = strings.length - 1;
	return (strings
		.slice(0, lastIndex)
		.reduce((p, s, i) => p + s + keys[i], '')
		+ strings[lastIndex]).replace(/^\s+/gm, '')
}

const WITHOUT_ALT = markdown`
	![](https://example.com/image-without-alt.jpg)
`

const WITH_ALT = markdown`
	![alt description](https://example.com/image.jpg)
`

const INSIDE_BLOCKQUOTE = markdown`
	> ![](https://example.com/image-without-alt.jpg)
	> ![alt description](https://example.com/image.jpg)
`

const _INLINE = markdown`${WITHOUT_ALT} ${WITH_ALT}`.replace(/\n+/gm, ' ')
const INLINE_CODE = `\`${_INLINE}\``
const INLINE = markdown`${_INLINE} ${INLINE_CODE}\n`

const CODE = "```markdown\n" + markdown`
	${WITHOUT_ALT}
	${WITH_ALT}
	${INSIDE_BLOCKQUOTE}
` + "\n```\n"

const KITCHEN_SINK = markdown`
	${WITHOUT_ALT}
	${WITH_ALT}
	${INSIDE_BLOCKQUOTE}
	${_INLINE}
	${INLINE_CODE}
	${CODE}
`

const PARAGRAPHS = KITCHEN_SINK.split(/\n+/g).join('\n\n')

module.exports = {
	WITHOUT_ALT,
	WITH_ALT,
	INSIDE_BLOCKQUOTE,
	INLINE,
	KITCHEN_SINK,
	PARAGRAPHS,
}
