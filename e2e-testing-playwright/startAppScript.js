const { spawn } = require('child_process');

const start = (cmd, cwd) => {
    const [exec, ...args] = cmd.split(' ');
    const proc = spawn(exec, args, { cwd, stdio: 'inherit', shell: true });
    return proc;
}

const rootDir = '/home/luca/fullstack-open-course'
const backend = start('npm run start:test', `${rootDir}/fullstack-open-exercises-part4/blog-list`)
const frontend = start('npm run dev', `${rootDir}/fullstack-open-exercises-part5/bloglist-frontend`)

const killAll = () => {
    backend.kill();
    frontend.kill();
}

process.on('exit', killAll);
process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);