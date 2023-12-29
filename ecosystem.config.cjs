module.exports = {
  apps : [{
    name   : "slog-backend",    
    script: './dist/main.js',
    watch: './dist',
    instances: "2",
    exec_mode: "cluster",
    autorestart: true,
    node_args: "--experimental-specifier-resolution=node",    
    wait_ready: true,
    listen_timeout: 50000,
    kill_timeout: 5000,
  }],
};
