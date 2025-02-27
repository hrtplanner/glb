import type { TransitionsProps } from '@threlte/extras'

declare global {
  namespace Threlte {
    interface UserProps extends TransitionsProps {}
  }
}

export {}