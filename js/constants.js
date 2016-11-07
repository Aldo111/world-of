/**
 * Condition constants.
 */
app.constant('CONDITIONS_OPS', {
  'general': {
    'NEQ': '!=='
  },
  'links': {
    'CHOSEN': 'CHSN'
  },
  'string': {
    'EQ': '===',
    'NEQ': '!=='
  },
  'number': {
    'EQ': '===',
    'NEQ': '!==',
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
