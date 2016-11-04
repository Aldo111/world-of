/**
 * Condition constants.
 */
app.constant('CONDITIONS_OPS', {
  'string': {
    'EQ': '==='
  },
  'number': {
    'EQ': '===',
    'GT': '>',
    'LT': '<',
    'GTE': '>=',
    'LTE': '<='
  },
  'logical': {
    'AND': '&&',
    'OR': '||'
  }
})

.constant('_', window._);
