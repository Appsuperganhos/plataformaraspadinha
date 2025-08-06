// Global type definitions for external libraries
declare global {
  interface Window {
    Notiflix: {
      Notify: {
        success: (message: string) => void
        failure: (message: string) => void
        info: (message: string) => void
        warning: (message: string) => void
        init: (config: any) => void
      }
      Loading: {
        standard: (message?: string) => void
        remove: () => void
      }
    }
  }
}

export {}
