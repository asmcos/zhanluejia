var path = require('path')
var projectRoot = path.resolve(__dirname, '../')
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  entry:path.resolve(__dirname, './') + '/webpack_entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // This is where images AND js will go
	filename: 'js/[name].[chunkhash:8].js',
  },
  plugins: [
        new CopyPlugin([
			 // Copy directory contents to {output}/to/directory/
            { from: './node_modules/admin-lte/dist',to: '../../public'},
            { from: './node_modules/bootstrap/dist',to: '../../public'},
            { from: './node_modules/casper/assets/css',to: '../../public/css'},
            { from: './node_modules/casper/assets/js',to: '../../public/js'},
            { from: './node_modules/casper/assets/built/screen.css',to: '../../public/css/screen.css'},
            { from: './node_modules/casper/assets/built/global.css',to: '../../public/css/global.css'},
            { from: './node_modules/bootstrap/js/tooltip.js',to: '../../public/js/tooltip.js'},
            { from: './node_modules/vue/dist/vue.js',to: '../../public/js/vue.js'},
            { from: './node_modules/swiper/dist/js/swiper.js',to: '../../public/js/swiper.js'},
            { from: './node_modules/swiper/dist/css/swiper.css',to: '../../public/css/swiper.css'},
            { from: './node_modules/@ckeditor/ckeditor5-build-decoupled-document/build',to: '../../public/js'},
				
		], {
            ignore: [
                // Doesn't copy any files with a txt extension    
                '*.txt',
            ],

            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: true
        }), //CopyWebpackPlugin




	] //plugins
};
