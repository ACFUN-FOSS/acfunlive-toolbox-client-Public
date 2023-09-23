module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		"plugin:vue/vue3-essential",
		"@vue/standard",
		"@vue/typescript/recommended"
	],
	parser: "vue-eslint-parser",
	parserOptions: {
		// parser: "babel-eslint",
		parser: "@typescript-eslint/parser",
		ecmaVersion: 2020
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		eqeqeq: "error",
		"no-tabs": "off",
		"no-constant-condition": "off",
		"for-direction": "error",
		"func-call-spacing": "error",
		semi: ["error", "always"],
		"semi-spacing": [
			"error",
			{
				before: false,
				after: true
			}
		],
		"semi-style": ["error", "last"],
		"space-before-function-paren": [
			"error",
			{
				anonymous: "never",
				named: "never",
				asyncArrow: "always"
			}
		],
		indent: [
			"error",
			"tab",
			{
				SwitchCase: 1
			}
		],
		"init-declarations": ["error", "always"],
		"jsx-quotes": ["error", "prefer-double"],
		quotes: ["error", "double"],
		"key-spacing": [
			"error",
			{
				beforeColon: false,
				afterColon: true
			}
		],
		"keyword-spacing": [
			"error",
			{
				overrides: {
					if: {
						after: true
					},
					for: {
						after: true
					},
					while: {
						after: true
					}
				}
			}
		],
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-explicit-any": ["off"],
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/no-namespace": "off",
		"@typescript-eslint/no-this-alias": ["off"],
		"spaced-comment": ["off"]
	},
	overrides: [
		{
			files: [
				"**/__tests__/*.{j,t}s?(x)",
				"**/tests/unit/**/*.spec.{j,t}s?(x)"
			],
			env: {
				mocha: true
			}
		},
		{
			files: [
				"**/__tests__/*.{j,t}s?(x)",
				"**/tests/unit/**/*.spec.{j,t}s?(x)"
			],
			env: {
				jest: true
			}
		},
		{
			files: [
				"**/__tests__/*.{j,t}s?(x)",
				"**/tests/unit/**/*.spec.{j,t}s?(x)"
			],
			env: {
				jest: true
			}
		}
	]
};
