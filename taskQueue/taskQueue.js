function tasksQueue (tasks, done) {
    function next (err, ...args) {
        if (err) return typeof done === 'function' && done(err);
        if (tasks.length === 0) return typeof done === 'function' && done(null, args);
        tasks.shift()(next, ...args);
    }
    next();
}