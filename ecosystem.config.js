module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : "API",
      script    : "app.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      }
    },

    // Second application
    {
      name      : "WEB",
      script    : "web.js"
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   *
   * Manual machine setup:
   *  wget https://nodejs.org/dist/v7.3.0/node-v7.3.0-linux-armv6l.tar.xz
   *  tar -xvf node-v7.3.0-linux-armv6l.tar.xz
   *  cd node-v7.3.0-linux-armv6l/
   *  sudo cp -R * /usr/local/
   *
   */
  deploy : {
    production : {
      user : "pi",
      host : "192.168.1.124",
      ref  : "origin/master",
      repo : "git@github.com:dustyjewett/dexters-lab.git",
      "forward-agent": "yes",
      path : "/home/pi/dexters-lab",
      "post-deploy" : "yarn install && pm2 startOrRestart ecosystem.json --env production"
    },
    dev : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/development",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
}
