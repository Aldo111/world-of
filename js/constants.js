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
  'text': {
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
    'AND': 'ALL',
    'OR': 'ANY'
  }
})

app.constant('STATE_OPS', {
  'text': '',
  'number': 0
})

app.constant('MOD_OPS', {
  'text': {
    'SET': '=',
  },
  'number': {
    'ADD': '+',
    'SUB': '-',
    'SET': '=',
    'MULT': '*',
    'DIV': '/',
  }
})

.constant('_', window._);
