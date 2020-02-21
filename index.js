const fs = require('fs');

const readFile = filename => {
	const file = fs.readFileSync(filename, 'utf8').split("\n");

	// Books libaries days
	// Scores of books in order

	// For library: num of books, signup days, books per day
	// Ids of books a library contains

	const [numOfBooks, numOfLibraries, maxDays] = file.shift().split(' ');
	const scores = file.shift().split(' ').map(score => parseInt(score));

	const libraries = file.reduce((prev, current, i) => {
		if(i % 2 === 0) {
			const [numOfBooks, signUpDays, booksPerDay] = current.split(' ');
			return [...prev, {numOfBooks, signUpDays, booksPerDay, books: null}]
		}

		prev[(i-1) / 2].id = (i-1) / 2;
		prev[(i-1) / 2].books = current.split(' ').sort((id1, id2) => scores[id2] - scores[id1]);
		return prev;
	}, []);

	return {numOfBooks, numOfLibraries, maxDays, scores, libraries};
}

const files = {
	a: 'a_example',
	b: 'b_read_on',
	c: 'c_incunabula',
	d: 'd_tough_choices',
	e: 'e_so_many_books',
	f: 'f_libraries_of_the_world'
}

const currentFile = 'b';
const resultFileName = `result_${currentFile}.txt`;
const props = readFile(`${files[currentFile]}.txt`);

const calcLibraryScore = (library, daysLeft, index) => {
	const bestPerfNDays = Math.ceil(library.numOfBooks / library.booksPerDay);
	const restNBooks = library.numOfBooks % library.booksPerDay;
	const daysToScan = daysLeft - library.signUpDays;
	let score = 0;

	let i = 0, readed = 0;
	const booksToRead = daysToScan*library.booksPerDay;
	while(readed < booksToRead){
		if (i >= library.books.length){
			break;
		}
		if (props.scores[library.books[i]] !== 0){
			readed++;
		}
		score+= props.scores[library.books[i]];
		i++;
	}

	return {...library, books1: library.books.slice(0, i), score, index};
}

const librariesToRead = []

currentDay = 0;

while(currentDay <= props.maxDays) {
	const daysLeft = props.maxDays - currentDay;
	const bestLibrary = props.libraries.map((library, i)=> calcLibraryScore(library, daysLeft, i)).sort((l1, l2) => l2.score - l1.score)[0];

	if(!bestLibrary) {
		break;
	}
	//console.log(bestLibrary.books);
	librariesToRead.push(bestLibrary);
	props.libraries.splice(bestLibrary.index, 1);

	bestLibrary.books = bestLibrary.books.sort((id1, id2) => props.scores[id2] - props.scores[id1]);

	bestLibrary.books1.forEach(book => props.scores[parseInt(book)] = 0);
	currentDay += bestLibrary.signUpDays;
}

console.log(props.scores);
fs.writeFile(
	resultFileName, 
	`${librariesToRead.length}\n${librariesToRead.map(library => `${library.id} ${library.books.length}\n${library.books.join(' ')}\n`).join('')}`
	, () => {});