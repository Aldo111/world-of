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

app.constant('STATE_OPS', {
  'string': '',
  'number': 0
})

app.constant('MOD_OPS', {
  'string': {
    'SET': '=',
  },
  'number': {
    'ADD': '+',
    'SUB': '-',
    'SET': '=',
  }
})

.constant('_', window._);
