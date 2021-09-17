module.exports = {
    extends: [
        'plugin:vue/essential',
        'airbnb-base',
        'plugin:prettier/recommended', // 添加 prettier 插件
    ],
    parserOptions: {
        parser: ['@babel/eslint-parser'],
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': [
            'off',
            // 如果插件配置中修改了相关选项，
            // 则必须在此添加相对应的自定义规则否则就会出现编辑器格式化后ESlint检查无法通过的情况。
            {
                printWidth: 200,
                singleQuote: true,
                bracketSpacing: true,
                jsxBracketSameLine: false,
                htmlWhitespaceSensitivity: 'ignore',
                parser: 'flow',
            },
        ],
        // TS特性
        'member-access': 'off', // 设置成员对象的访问权限（public,private,protect)
        'member-ordering': [
            // 设置修饰符顺序
            'off',
            {
                order: [
                    'public-static-field',
                    'public-static-method',
                    'protected-static-field',
                    'protected-static-method',
                    'private-static-field',
                    'private-static-method',
                    'public-instance-field',
                    'protected-instance-field',
                    'private-instance-field',
                    'public-constructor',
                    'protected-constructor',
                    'private-constructor',
                    'public-instance-method',
                    'protected-instance-method',
                    'private-instance-method',
                ],
            },
        ],
        'no-empty-interface': 'off', // 不允许空接口
        'no-parameter-reassignment': 'off', // 不允许修改方法输入参数
        'prefer-for-of': 'off', // 如果for循环中没有使用索引，建议是使用for-of

        // 功能特性
        'await-promise': 'off', // 不允许没有Promise的情况下使用await
        curly: 2, // if/for/do/while强制使用大括号
        'no-arg': 'off', // 不允许使用arguments.callee
        // "no-bitwise":true, // 不允许使用特殊运算符 &, &=, |, |=, ^, ^=, <<, <<=, >>, >>=, >>>, >>>=, ~
        'no-conditional-assignment': 0, // do while/for/if/while 语句中将会对例如if(a=b)进行检查
        // "no-console":true,// 不允许使用console对象
        'no-debugger': 'off', // 不允许使用debugger
        'no-duplicate-super': 'off', // 不允许super() 两次使用在构造函数中
        'no-empty': 'warn', // 函数体不允许空
        'no-eval': 'off', // 不允许使用eval
        'no-for-in-array': 'off', // 不允许对Array使用for-in
        'no-invalid-template-strings': 'off', // 只允许在模板字符串中使用${
        'no-invalid-this': 'off', // 不允许在class之外使用this
        'no-null-keyword': 'off', // 不允许使用null,使用undefined代替null，指代空指针对象
        'no-sparse-arrays': 'warn', // 不允许array中有空元素
        'no-unsafe-finally': 'warn', // 不允许在finally语句中使用return/continue/break/throw
        'no-unused-expression': 'off', // 不允许使用未使用的表达式
        'no-use-before-declare': 'off', // 在使用前必须声明
        'no-var-keyword': 'off', // 不允许使用var
        radix: 0, // parseInt时，必须输入radix精度参数
        'triple-equals': 'off', // 必须使用恒等号，进行等于比较
        'use-isnan': 'warn', // 只允许使用isNaN方法检查数字是否有效

        // 维护性功能
        indent: [1, 4], // 每行开始以4个空格符开始
        'linebreak-style': [2], // 换行符格式 CR/LF可以通用使用在windows和osx
        'max-classes-per-file': [2, 1], // 每个文件中可定义类的个数
        'no-default-export': 'off', // 禁止使用export default关键字，因为当export对象名称发生变化时，需要修改import中的对象名。https://github.com/palantir/tslint/issues/1182#issue-151780453
        'no-duplicate-imports': 'off', // 禁止在一个文件内，多次引用同一module

        // 格式
        'class-name': 'off', // 类名以大驼峰格式命名
        'import-spacing': 'off', // import关键字后加空格
        'jsdoc-format': 'off', // 注释基于jsdoc风格
        'new-parens': 'off', // 调用构造函数时需要用括号
        'no-trailing-spaces': 2,
        'no-unnecessary-initializer': 'off', // 不允许没有必要的初始化
        'comma-dangle': [2, 'always-multiline'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['off'],
        'import/no-extraneous-dependencies': 'off',
        'space-before-function-paren': 0,
        'no-param-reassign': 0,
        'import/prefer-default-export': 0,
        'no-shadow': 0, // 重复变量函数
        'import/newline-after-import': 0, // 期望在导入语句之后有一个空行，而不是后面跟着另一个导入
        'no-restricted-syntax': 0,
        'guard-for-in': 0,
        'no-multi-assign': 0,
        'global-require': 0,
        'no-console': 0,
        'no-plusplus': 0,
        'consistent-return': 0,
        'node/no-deprecated-api': 0,
        'import/extensions': 0,
        'vue/singleline-html-element-content-newline': 0,
        // eslint-fix 空格问题
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: [],
        }],
        'vue/no-mutating-props': 0,
        'vue/no-v-html': 0,
        'no-await-in-loop': 0,
        'prefer-destructuring': ['error', { object: true, array: false }],
    },
}
