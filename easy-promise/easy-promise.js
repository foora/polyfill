class EasyPromise {
    constructor() {
        this.tasks = [];
        this.status = 0;
    }
}
EasyPromise.statusMap = ['pending', 'fulfilled', 'rejected'];