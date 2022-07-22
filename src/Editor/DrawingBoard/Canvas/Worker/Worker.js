class Worker {
    constructor(options) {
        this.options = options;
    }
    getElementByID(root, createID) {
        return root.shapes.getElementByID(createID);
    }
    deleteByID(root, createID) {
        return root.shapes.deleteByID(createID);
    }
    clearAll() {
        this.update((root) => {
            for (const shape of root.shapes) {
                this.deleteByID(root, shape.getID());
            }
        });
    }
    setOption(options) {
        this.options = Object.assign(Object.assign({}, this.options), options);
    }
}
export default Worker;