class EasyPromise {
    constructor(cb) {
        this._tasks = [];
        this._status = 0;
        this._hadcallback = false;
        try {
            cb(this._reslove, this._reject);
        } catch (e) {
            this._reject(e);
        }
        return this;
    }
    _reslove(value) {
        if (this._hadcallback) return;
        this._value = value;
        this._status = 1;
        this._hadcallback = true;
        this._runTask();
    }
    _reject(err) {
        if (this._hadcallback) return;
        this._value = err;
        this._status = 2;
        this._hadcallback = true;
        this._runTask();
    }
    then(onFulfilled, onRejected) {
        if (onFulfilled == null || typeof onFulfilled !== 'function') {
            throw new TypeError('resolve callback is not a function');
        }
        if (onRejected != null && typeof onRejected !== 'function') {
            throw new TypeError('reject callback is not a function');
        }
        this._tasks.push([onFulfilled, onRejected]);
        if (this._status !== 0) {
            return this._runTask();
        }
        return this;
    }
    _runTask() {
        if (this._tasks.length === 0) return;
            let result;
            let [onFulfilled, onRejected] = this._tasks.shift();
            if (this._staus === 1) {
                try {
                    result = onFulfilled(this._value);
                } catch(e) {
                    result = EasyPromise.reject(e);
                }
            }
            if (this._status === 2) {
                if (typeof onRejected === 'function') {
                    try {
                        result = onRejected(this._value);
                    } catch(e) {
                        result = EasyPromise.reject(e);
                    }
                }
            }
            if (!(result instanceof EasyPromise)) {
                result = EasyPromise.resolve(result);
            }
            result._tasks = this._tasks;
            return result;
    }
}
EasyPromise.resolve = function (value) {
    return new EasyPromise((reslove, reject) => resolve(value));
}
EasyPromise.reject = function (err) {
    return new EasyPromise((reslove, reject) => reject(err));
}