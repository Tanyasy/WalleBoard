module.exports = {
    // "parser": "babel-eslint",
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "babel-eslint",
        "sourceType": "module"
    },
    rules: {
        'no-unused-vars': [
            'error',
            {varsIgnorePattern: '.*', args: 'none'}
        ]
    }
}