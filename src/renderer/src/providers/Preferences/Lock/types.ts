export interface LockDataContext {
  isScreenLocked: boolean
  userAlreadyHasCode: boolean
  updateCodeStep: 'newCode' | 'checkCode'
  createLockCode: (code: number) => void
  checkCode: (code: number, toUnlockScreen?: boolean) => void
}
