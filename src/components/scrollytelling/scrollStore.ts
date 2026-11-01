export interface ScrollState {
  progress: number; // 0 to 1
  targetProgress: number;
  activeChapter: number; // 0 to 5
  mouseX: number; // -1 to 1
  mouseY: number; // -1 to 1
  isReducedMotion: boolean;
  isLowPower: boolean;
}

class ScrollStore {
  private state: ScrollState = {
    progress: 0,
    targetProgress: 0,
    activeChapter: 0,
    mouseX: 0,
    mouseY: 0,
    isReducedMotion: false,
    isLowPower: false,
  };

  private listeners: Set<(state: ScrollState) => void> = new Set();

  public getState(): ScrollState {
    return this.state;
  }

  public setProgress(progress: number) {
    this.state.progress = Math.max(0, Math.min(1, progress));
    const chapter = Math.min(5, Math.floor(this.state.progress * 6));
    if (chapter !== this.state.activeChapter) {
      this.state.activeChapter = chapter;
      this.notify();
    }
  }

  public setMouse(x: number, y: number) {
    this.state.mouseX = x;
    this.state.mouseY = y;
  }

  public setPreferences(reducedMotion: boolean, lowPower: boolean) {
    this.state.isReducedMotion = reducedMotion;
    this.state.isLowPower = lowPower;
    this.notify();
  }

  public subscribe(listener: (state: ScrollState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const scrollStore = new ScrollStore();

