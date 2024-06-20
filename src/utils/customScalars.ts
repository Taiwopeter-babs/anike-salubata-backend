import { GraphQLScalarType } from 'graphql';

const regex = /^[A-Za-z0-9]+$/;

function validate(stringValue: any): string | never {
  if (typeof stringValue !== 'string' || !regex.test(stringValue)) {
    throw new Error('invalid string value');
  }
  return stringValue;
}

export const CustomStringScalar = new GraphQLScalarType({
  name: 'GraphQLString',
  description: 'A custom graphql string',
  serialize: (value: any) => validate(value),
  parseValue: (value: any) => validate(value),
  parseLiteral: (ast: any) => validate(ast.value),
});
