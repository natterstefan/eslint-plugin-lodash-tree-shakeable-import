import { Rule } from 'eslint'
import { ImportDeclaration } from 'estree'

type Case = {
  matcher: (
    node: ImportDeclaration & Rule.NodeParentExtension,
    context: Rule.RuleContext,
  ) => boolean
  body: (
    node: ImportDeclaration & Rule.NodeParentExtension,
    context: Rule.RuleContext,
  ) => void
}

const cases: Case[] = [
  {
    matcher: node =>
      node.specifiers.find(
        specifier => specifier.type === 'ImportDefaultSpecifier',
      ) !== undefined && node.source.value === 'lodash',
    body: (node, context) =>
      context.report({
        node,
        messageId: 'noDefaultLodashImport',
      }),
  },
  {
    matcher: node =>
      node.source.value === 'lodash' &&
      node.specifiers.find(
        specifier => specifier.type !== 'ImportDefaultSpecifier',
      ) !== undefined,
    body: (node, context) =>
      context.report({
        node,
        messageId: 'noNamedImportsFromLodash',
        fix: fixer =>
          fixer.replaceText(
            node,
            node.specifiers
              .map(
                specifier =>
                  `import ${specifier.local.name} from 'lodash/${specifier.local.name}'`,
              )
              .join('\n'),
          ),
      }),
  },
]

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      noDefaultLodashImport:
        "Do not import lodash directly, import single functions like `import { get } from 'lodash/get'`",
      noNamedImportsFromLodash:
        "Do not use named imports from lodash. Import single functions like `import get from 'lodash/get'",
    },
    fixable: 'code',
  },
  create: context => {
    return {
      ImportDeclaration: node => {
        cases.some(c => {
          if (c.matcher(node, context)) {
            c.body(node, context)
            return true
          }
          return false
        })
      },
    }
  },
}

export = rule
