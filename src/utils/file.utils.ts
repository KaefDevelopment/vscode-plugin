export const getFileRelativePath = (fileFullPath: string, workspace: string): string => {
    return fileFullPath.split(workspace)[1] || '';
};