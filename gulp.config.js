const path = require('path')

module.exports = function(){
    const config = {

        localhost: "192.168.178.110",

        folders: {
            root: path.resolve('/'),
            assets: path.resolve('/assets'),
            dist: path.resolve('/dist'),
        },

        ftp: {
            credentials: {
                host: '*^',
                user: '*',
                password: '*'
            },
            root: '/wp-content/themes/_s'
        }

    };

    config.allsass = [
        path.resolve(config.folders.assets+'/sass/**/*.sass')
    ]

    config.alljs = [
        path.resolve(config.folders.assets+'./js/libs/**/*.js'),
        path.resolve(config.folders.assets+'./js/**/*.js')
    ]

    return config;
};
