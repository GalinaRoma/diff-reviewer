/**
 * The enum of actions` type.
 */
export enum Action {
  /**
   * Delete a text line from the old version.
   */
  delete = -1,
  /**
   * Add a text line to the new version.
   */
  add = 1,
  /**
   * Line is not changed, it is contained in both versions.
   */
  notChanged = 0,
}
