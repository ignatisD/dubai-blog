module.exports = {
    "apps": [
        {
            "name": "DubaiBlog",
            "script": "api/index.js",
            "exec_mode": "cluster",
            kill_timeout: 5000,
            listen_timeout: 6000,
            wait_ready: true
        }
    ]
};
