const path = require('path')

module.exports = function(){
    const config = {

        localhost: "192.168.178.110",
        proxy: "https://project.site",
        folders: {
            root: path.resolve('./'),
            assets: path.resolve('./assets'),
            dist: path.resolve('./dist'),
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
        config.folders.assets+'/sass/**/*.sass'
    ]

    config.alljs = [
        config.folders.assets+'./js/libs/**/*.js',
        config.folders.assets+'./js/**/*.js'
    ]

    return config;
};
