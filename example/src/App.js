import React from 'react'

import { useMyHook } from 'sample'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
