import type { PartialTree, PartialTreeFile, PartialTreeFolder, PartialTreeFolderNode } from "@uppy/core/lib/Uppy"
import type { CompanionFile } from "@uppy/utils/lib/CompanionFile"

const afterClickOnFolder = (
  oldPartialTree: PartialTree,
  currentItems: CompanionFile[],
  clickedFolder: PartialTreeFolder,
  validateRestrictions: (file: CompanionFile) => object | null,
  currentPagePath: string | null
) : PartialTree => {
  let newFolders = currentItems.filter((i) => i.isFolder === true)
  let newFiles = currentItems.filter((i) => i.isFolder === false)

  const newlyAddedItemStatus = (clickedFolder.type === 'folder' && clickedFolder.status === 'checked') ? 'checked' : 'unchecked';
  const folders : PartialTreeFolderNode[] = newFolders.map((folder) => ({
    type: 'folder',
    id: folder.requestPath,

    cached: false,
    nextPagePath: null,

    status: newlyAddedItemStatus,
    parentId: clickedFolder.id,
    data: folder,
  }))
  const files : PartialTreeFile[] = newFiles.map((file) => ({
    type: 'file',
    id: file.requestPath,

    status: newlyAddedItemStatus === 'checked' && validateRestrictions(file) ? 'unchecked' : newlyAddedItemStatus,
    parentId: clickedFolder.id,
    data: file,
  }))

  // just doing `clickedFolder.cached = true` in a non-mutating way
  const updatedClickedFolder : PartialTreeFolder = {
    ...clickedFolder,
    cached: true,
    nextPagePath: currentPagePath
  }
  const partialTreeWithUpdatedClickedFolder = oldPartialTree.map((folder) =>
    folder.id === updatedClickedFolder.id ?
      updatedClickedFolder :
      folder
  )

  const newPartialTree = [
    ...partialTreeWithUpdatedClickedFolder,
    ...folders,
    ...files
  ]
  return newPartialTree
}

export default afterClickOnFolder