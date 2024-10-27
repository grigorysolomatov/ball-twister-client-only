export class StateTree {
    set(dict) {
	this.external = this.external || {};
	this.external = {...this.external, ...dict};
	return this;
    }
    async run() {
	const {root, ctx} = this.external;
	const path = [];
	while (true) {
	    const node = path.reduce((node, step) => node[step], root);
	    if (!node) {break;}
	    const res = await node[0](ctx);
	    if (res === '..') { path.pop(); } else { path.push(res); }
	}
	return this;
    }
}
