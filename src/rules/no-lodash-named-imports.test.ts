import { RuleTester } from 'eslint'
import rule from './no-lodash-named-imports'

const tester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
})

tester.run('no-lodash-named-imports', rule, {
  valid: [
    { code: "import get from 'lodash/get'" },
    { code: "import defaultImport from 'other-package'" },
    { code: "import { namedImport } from 'other-package'" },
  ],
  invalid: [
    {
      code: "import _ from 'lodash'",
      errors: [{ messageId: 'noDefaultLodashImport' }],
    },
    {
      code: "import { get, map } from 'lodash'",
      output: "import get from 'lodash/get'\nimport map from 'lodash/map'",
      errors: [{ messageId: 'noNamedImportsFromLodash' }],
    },
    {
      code: "import _, { get, map } from 'lodash'",
      errors: [{ messageId: 'noDefaultLodashImport' }],
    },
  ],
})
