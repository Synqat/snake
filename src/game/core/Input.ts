type OnKeyDownCallback<K = KeyName> = (key: K) => void
type KeyName = 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp'

export class Input {
  document: Document
  keyStates: { [key: string]: boolean } = {}
  keySubscriptions: { [key: string]: OnKeyDownCallback[] } = {}

  constructor(document: Document) {
    this.document = document
    console.log({ document })

    this.document.onkeydown = (e) => {
      console.log('key down', e.key)
      this.keyStates[e.key] = true
      if (this.keySubscriptions[e.key]) {
        this.keySubscriptions[e.key]?.forEach((callback) =>
          callback(e.key as KeyName),
        )
      }
    }

    this.document.onkeyup = (e) => {
      this.keyStates[e.key] = false
    }
  }

  public isKeyDown(key: KeyName): boolean {
    return this.keyStates[key]
  }

  public isKeyUp(key: KeyName): boolean {
    return !this.keyStates[key]
  }

  public onKeyDown<K extends KeyName>(
    key: K,
    callback: OnKeyDownCallback<K>,
  ): void {
    if (!this.keySubscriptions[key]) {
      this.keySubscriptions[key] = []
    }

    this.keySubscriptions[key].push(callback as OnKeyDownCallback)
  }
  public onAnyKeysDown<K extends KeyName>(
    keys: K[],
    callback: OnKeyDownCallback<K>,
  ): void {
    keys.forEach((key: K) => {
      this.onKeyDown(key, callback as OnKeyDownCallback<K>)
    })
  }
}
