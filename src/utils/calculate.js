const calculate = (expression) => {
  const matched = (new RegExp('([\\d]+\\.?[\\d]*)?([-+/*%][\\d]+\\.?[\\d]*)*')).exec(expression)
  if (!matched) {
    return 0;
  }
  if (/^[*+/]/.test(expression)) {
    return () => {
      throw new Error('Cannot start the expression with invalid operators')
    }
  }
  // eslint-disable-next-line
  return new Function(`return ${matched[0]}`)()
}

export default calculate