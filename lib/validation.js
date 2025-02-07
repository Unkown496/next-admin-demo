import { FormatRegistry, Type } from '@sinclair/typebox';

FormatRegistry.Set('email', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

export default Type;
