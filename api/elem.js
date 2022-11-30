let sel = 1;
const elem = async(Selector) => {
	const Element1 = document.querySelector(`${Selector}`);
	await console.log(`Selector:${sel} == ${Selector}`);
	sel++
	return Element1;
}

export default elem;