export class PatternMaker {
    constructor(nrows, ncols) {
	const content = new Array(nrows).fill(null).map(_ => new Array(ncols).fill(0));	
	this.internal = {nrows, ncols, content};
	this.external = {};
    }
    set(dict) {
	this.external = {...this.external, ...dict};
	return this;
    }
    clone() {
	const {nrows, ncols, content} = this.internal;
	const newPatternMaker = new PatternMaker(nrows, ncols).draw(0, 0, content);
	return newPatternMaker;
    }
    draw(row, col, pattern) {
	const {content} = this.internal;
	const {drawMode = (oldVal, newVal) => oldVal + newVal} = this.external;
	
	const [prows, pcols] = [pattern.length, pattern[0].length];
	const patternPoints = ({
	    get: () => {
		const points = [];
		for (let prow = 0; prow < prows; prow++) {
		    for (let pcol = 0; pcol < pcols; pcol++) {
			points.push([prow, pcol]);
		    }
		}
		return points;
	    },
	}).get();
	patternPoints.forEach(([prow, pcol]) => {
	    const oldVal = content[row + prow][col + pcol];
	    const newVal =  pattern[prow][pcol];
	    content[row + prow][col + pcol] = drawMode(oldVal, newVal);
	});
	
	return this;
    }
    orient(coordFunc) {
	const {content, nrows, ncols} = this.internal;
	const gridPoints = ({
	    get: () => {
		const points = [];
		for (let row = 0; row < nrows; row++) {
		    for (let col = 0; col < ncols; col++) {
			points.push([row, col]);
		    }
		}
		return points;
	    },
	}).get();
	
	const newGridPoints = gridPoints.map(([row, col]) => coordFunc(row, col));
	const new_nrows = Math.max(...newGridPoints.map(([row, col]) => row)) + 1;
	const new_ncols = Math.max(...newGridPoints.map(([row, col]) => col)) + 1;	
	const newContent = new Array(new_nrows).fill(null).map(_ => new Array(new_ncols).fill(0));
	gridPoints.forEach(([row, col], i) => {
	    const [newRow, newCol] = newGridPoints[i];
	    newContent[newRow][newCol] = content[row][col];
	});

	this.internal.content = newContent;
	
	return this;
    }
    symmetrize(coordFunc) {
	const reoriented = this.clone().orient(coordFunc).get();
	this.draw(0, 0, reoriented);
	return this;
    }
    get() {
	const {content} = this.internal;
	return content;
    }
};
