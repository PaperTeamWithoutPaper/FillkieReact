const INTERVAL_TIME = 50;
let tasks = [];
let timeout;
let work;
const doWork = () => {
    if (typeof work === 'function') {
        work(tasks);
        tasks = [];
    }
};
function requestTask(isDone) {
    if (isDone) {
        doWork();
        return;
    }
    timeout = setTimeout(() => {
        doWork();
        requestTask(false);
    }, INTERVAL_TIME);
}
export function reserveTask(task, _work) {
    tasks.push(task);
    if (work === undefined) {
        work = _work;
        requestTask(false);
    }
}   
export function flushTask() {
    clearTimeout(timeout);
    if (typeof work === 'function') {
        requestTask(true);
    }
    work = undefined;
}