module.exports = {
    apps: [
      {
        name: 'my-keystone',
        script: './node_modules/@keystone-6/core/bin/cli.js',
        args: 'start',
  
        instances: 1,
        exec_mode: 'cluster',
        wait_ready: true,
        listen_timeout: 10000,
  
        env: {
          PORT: 3000,
        },
      },
    ],
  };